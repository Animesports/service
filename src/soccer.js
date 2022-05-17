import express from "express";
import {
  createNewGameEntry,
  searchSoccerGame,
  updateGameEntry,
} from "../database/functions.js";
import responseError from "../utils/errors.js";
import { getGameStatus } from "../utils/soccer.js";

const router = express();

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
        res.json({ acknowledged });
      }
    );
  });
});

const soccer = { router, methods: "" };
export default soccer;
