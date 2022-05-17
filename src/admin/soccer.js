import express from "express";
import {
  deleteSoccerGame,
  insertNewSoccerGame,
  searchSoccerGame,
  updateSoccerGame,
} from "../../database/functions.js";
import responseError from "../../utils/errors.js";
import { createGameId } from "../../utils/token.js";
import schemas from "../../schemas.json" assert { type: "json" };
import { ArrToObj, ObjToArr } from "../../utils/converter.js";
import { getGameStatus } from "../../utils/soccer.js";

const router = express();

router.patch("/close/:id", async (req, res) => {
  const id = req.params.id;
  const score = req.body.score;

  //TODO: Antes de fechar, verificar se ele está em andamento
  if (!score.visited || !score.visitor) return responseError(res, 400);

  await updateSoccerGame({ id, props: { status: "closed", score } }).then(
    ({ acknowledged }) => {
      return res.json({ acknowledged });
    },
    () => {
      responseError(res, 501);
    }
  );
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  await searchSoccerGame({ id }).then(async (game) => {
    if (!game.id) return responseError(res, 510);

    switch (getGameStatus(game)) {
      case "opened":
        await deleteSoccerGame({ id }).then(
          ({ deletedCount }) => {
            return res.json({ deleted: !!deletedCount, id });
          },
          () => {
            responseError(res, 501);
          }
        );
        break;
      case "running":
        await updateSoccerGame({ id, props: { status: "canceled" } }).then(
          ({ acknowledged }) => {
            return res.json({ acknowledged });
          },
          () => {
            responseError(res, 501);
          }
        );
        break;
      default:
        responseError(res, 403);
    }
  });
});

router.patch("/score/:id", async (req, res) => {
  const id = req.params.id;
  const { visited, visitor } = req.body.score;

  if (!visited == null || !visitor == null) return responseError(res, 400);

  if ([visitor, visited].every((v) => typeof v === "number") === false) {
    return responseError(res, 401);
  }

  await searchSoccerGame({ id }).then(async (game) => {
    if (!game.id) return responseError(res, 510);

    if (getGameStatus(game) !== "running") return responseError(res, 403);

    await updateSoccerGame({ id, props: { score: { visited, visitor } } }).then(
      ({ acknowledged }) => {
        res.json({
          acknowledged,
        });
      },
      () => {
        responseError(res, 501);
      }
    );
  });
});

router.patch("/:id", async (req, res) => {
  const id = req.params.id;

  if (!req.body || !id) return responseError(res, 400);

  const acceptProps = ObjToArr(req.body).filter(([key, value]) => {
    return schemas.game[key] && typeof value === schemas.game[key];
  });

  await updateSoccerGame({ id, props: ArrToObj(acceptProps) }).then(
    ({ acknowledged }) => {
      res.json({ acknowledged, modified: ArrToObj(acceptProps) });
    },
    () => {
      responseError(res, 501);
    }
  );
  res.end();
});

router.post("/", async (req, res) => {
  const { visited, visitor, date } = req.body ?? {};
  const { month, year } = res.locals.season;
  if (!visited.id || !visitor.id || !date) return responseError(res, 401);

  await createGameId({ visited, visitor }).then(
    async (id) => {
      await insertNewSoccerGame({
        id,
        teams: { visited, visitor },
        date: new Date(date),
        reference: `${month}/${year}`,
      }).then(
        ({ acknowledged, game }) => {
          res.json({
            success: acknowledged,
            game,
          });
        },
        () => {
          responseError(res, 501);
        }
      );
    },
    () => {
      responseError(res, 501);
    }
  );
});

const adminSoccer = { router, methods: "" };
export default adminSoccer;
