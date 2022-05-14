import express from "express";
import {
  insertNewSoccerGame,
  updateSoccerGame,
} from "../../database/functions.js";
import responseError from "../../utils/errors.js";
import { createGameId } from "../../utils/token.js";
import schemas from "../../schemas.json" assert { type: "json" };
import { ArrToObj, ObjToArr } from "../../utils/converter.js";

const router = express();

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
