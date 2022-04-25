import express from "express";
import { insertNewSeason, updateSeason } from "../../database/functions";

const router = express();

router.post("/close", (req, res) => {
  const { month, year } =
    { day: 19, month: 4, year: 2022 } ?? req.body.date_utc;
  updateSeason({
    id: Object.values({ month, year }),
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
  const { month, year } =
    { day: 19, month: 4, year: 2022 } ?? req.body.date_utc;

  insertNewSeason({ id: Object.values({ month, year }).join("/") }).then(
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
