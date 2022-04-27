import express from "express";
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
    () => {
      // Definir vencedores usando as Ref de jogos com o resultado e usando ID com mais pontos.
      // Gerar notificação de vencedores
      // Pagamentos de saída para vencedores
      res.end();
    },
    (err) => {
      res.status(501).json({ err });
    }
  );
});

router.post("/open", (req, res) => {
  const { month, year } = req.body.utc_date ?? res.locals.season;

  insertNewSeason({ id: `${month}/${year}` }).then(
    () => {
      res.end();
    },
    (err) => {
      res.status(501).json({ err });
    }
  );

  res.end();
});

const appSeasons = { router, methods: "" };
export default appSeasons;
