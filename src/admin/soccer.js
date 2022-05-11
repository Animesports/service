import express from "express";
import { insertNewSoccerGame } from "../../database/functions.js";
import responseError from "../../utils/errors.js";
import { createGameId } from "../../utils/token.js";

const router = express();

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
