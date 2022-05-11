import express from "express";
import { getAllSoccerGames } from "../../database/functions.js";
import responseError from "../../utils/errors.js";

const router = express();

router.get("/current", async (req, res) => {
  const { month, year } = res.locals.season;
  await getAllSoccerGames({ reference: `${month}/${year}` }).then(
    (games) => {
      if (!Array.isArray(games)) return responseError(res, 501);
      res.json(games);
    },
    () => {
      responseError(res, 501);
    }
  );
});

router.get("/", async (req, res) => {
  await getAllSoccerGames().then(
    (games) => {
      if (!Array.isArray(games)) return responseError(res, 501);
      res.json(games);
    },
    () => {
      responseError(res, 501);
    }
  );
});

const appSoccer = { router, methods: "" };
export default appSoccer;
