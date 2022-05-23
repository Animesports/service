import express from "express";
import {
  createNewGameEntry,
  getClientSeasonPayment,
  searchSoccerGame,
  updateGameEntry,
} from "../database/functions.js";
import responseError from "../utils/errors.js";
import { getGameStatus } from "../utils/soccer.js";
import { Connection } from "../database/connection.js";

const router = express();

router.use((req, res, next) => {
  const { year, month } = res.locals.season;
  const id = res.locals.id;

  getClientSeasonPayment({ season: `${month}/${year}`, id }).then((payment) => {
    if (payment?.id) return next();
    return responseError(res, 406);
  });
});

router.post("/entry/:gameId", async (req, res) => {
  const gameId = req.params.gameId;
  const id = res.locals.id;
  const { visited, visitor } = req.body;

  if (typeof visited !== "number" || typeof visitor !== "number") {
    return responseError(res, 400);
  }

  await searchSoccerGame({ id: gameId }).then((game) => {
    if (getGameStatus(game) !== "opened") return responseError(res, 403);

    const hasAnEntry = game.entries.filter((entry) => entry.id === id)[0];
    const func = hasAnEntry ? updateGameEntry : createNewGameEntry;

    func({ gameId, id, entry: { visited, visitor } }).then(
      ({ acknowledged }) => {
        if (!acknowledged) return responseError(res, 501);

        Connection.emit("update-entry", {
          id: game.id,
          entry: { id, visited, visitor },
        });

        res.json({ acknowledged });
      }
    );
  });
});

const soccer = { router, methods: "" };
export default soccer;
