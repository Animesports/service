import express from "express";
import { Connection } from "../../database/connection.js";
import {
  getAllClients,
  getAllPaymentBySeason,
  getAllSoccerGames,
  getSeasonById,
  insertAwardPayments,
  insertNewSeason,
  updateSeason,
} from "../../database/functions.js";
import responseError from "../../utils/errors.js";
import { getSeasonWinners } from "../../utils/soccer.js";

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

router.post("/close", async (req, res) => {
  const { month, year } = req.body.utc_date ?? res.locals.season;

  // Pegar todos os usuários, e todos os jogos

  await getAllClients().then(async (clients) => {
    if (!Array.isArray(clients)) return responseError(res, 501);

    await getAllSoccerGames({ reference: `${month}/${year}` }).then(
      async (games) => {
        if (!Array.isArray(games)) return responseError(res, 501);

        await getAllPaymentBySeason({ season: `${month}/${year}` }).then(
          async (payments) => {
            if (!Array.isArray(payments)) return responseError(res, 501);

            await updateSeason({
              id: `${month}/${year}`,
              props: {
                running: false,
              },
            }).then(
              async ({ acknowledged }) => {
                if (!acknowledged) return responseError(res, 501);

                const amount = payments
                  .map((payment) => payment.value)
                  .reduce((a, b) => a + b);

                const appAmount = amount * process.env.APP_TAX ?? 0.4;
                const awardAmount = amount * (1 - (process.env.APP_TAX ?? 0.4));

                const winners = getSeasonWinners({
                  clients,
                  games,
                  season: `${month}/${year}`,
                })
                  .slice(0, 3)
                  .map((winner, position) => {
                    const award = (awardAmount * 0.6) / (position + 1);

                    return { ...winner, award };
                  });

                await insertAwardPayments({
                  winners: [
                    ...winners,
                    {
                      id: "cee53a81-dc1e-5a8d-9459-bdc300816688",
                      award: appAmount,
                    },
                  ],
                  payIdPrefix: `app${month}${year}`,
                }).then(({ acknowledged }) => {
                  if (!acknowledged) return responseError(res, 501);

                  Connection.emit("update-season", {
                    id: `${month}/${year}`,
                    running: false,
                  });

                  // Enviar as notificações
                  console.info("ok");
                  res.end();
                });
              },
              () => {
                responseError(res, 501);
              }
            );
          }
        );
      }
    );
  });
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
