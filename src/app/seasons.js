import express from "express";
import { Connection } from "../../database/connection.js";
import {
  getAllPaymentBySeason,
  getSeasonById,
  insertNewSeason,
  updateSeason,
} from "../../database/functions.js";
import responseError from "../../utils/errors.js";

const router = express();

router.get("/", (req, res) => {
  const { month, year } = res.locals.season;

  getSeasonById({ id: `${month}/${year}` }).then(
    async (season) => {
      await getAllPaymentBySeason({ season: `${month}/${year}` }).then(
        (payments) => {
          season.amount = payments
            .map((payment) => payment.value)
            .reduce((a, b) => a + b);
        }
      );

      res.json(season);
    },
    () => {
      responseError(res, 501);
    }
  );
});

router.post("/close", (req, res) => {
  const { month, year } = req.body.utc_date ?? res.locals.season;
  updateSeason({
    id: `${month}/${year}`,
    props: {
      running: false,
    },
  }).then(
    ({ acknowledged }) => {
      if (!acknowledged) return responseError(res, 501);

      // Definir vencedores usando as Ref de jogos com o resultado e usando ID com mais pontos.
      // Gerar notificação de vencedores
      // Pagamentos de saída para vencedores

      Connection.emit("update-season", {
        id: `${month}/${year}`,
        running: false,
      });

      res.end();
    },
    (err) => {
      responseError(res, 501);
    }
  );
});

router.post("/open", (req, res) => {
  const { month, year } = req.body.utc_date ?? res.locals.season;

  insertNewSeason({ id: `${month}/${year}` }).then(
    ({ acknowledged, season }) => {
      if (!acknowledged) return responseError(res, 501);

      Connection.emit("update-season", season);
      res.end();
    },
    () => {
      responseError(res, 501);
    }
  );
});

const appSeasons = { router, methods: "" };
export default appSeasons;
