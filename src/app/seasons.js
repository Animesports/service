import express from "express";
import { Connection } from "../../database/connection.js";
import {
  getAllClients,
  getAllPaymentBySeason,
  getAllSoccerGames,
  getSeasonById,
  insertAwardPayments,
  insertNewSeason,
  newNotification,
  updateManyGames,
  updateSeason,
} from "../../database/functions.js";
import { month } from "../../utils/converter.js";
import responseError from "../../utils/errors.js";
import { plural } from "../../utils/global.js";
import { sendEmail } from "../../utils/mailer.js";
import { WinnerNotification } from "../../utils/mailShape.js";
import { getSeasonWinners } from "../../utils/soccer.js";
import { generateNotifyId } from "../../utils/token.js";

const router = express();

router.get("/", (req, res) => {
  const { ["month"]: m, year } = res.locals.season;

  getSeasonById({ id: `${m}/${year}` }).then(
    async (season) => {
      await getAllPaymentBySeason({ season: `${m}/${year}` }).then(
        (payments) => {
          season.amount = payments
            .map((payment) => payment.value)
            .reduce((a, b) => a + b, 0);
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
  const { ["month"]: m, year } = req.body.utc_date ?? res.locals.season;

  await getAllClients().then(async (clients) => {
    if (!Array.isArray(clients)) return responseError(res, 501);

    await updateManyGames({
      filter: { reference: `${m}/${year}`, status: "opened" },
      props: { status: "canceled" },
    }).then(async ({ acknowledged }) => {
      if (!acknowledged) return responseError(res, 501);

      await getAllSoccerGames({ reference: `${m}/${year}` }).then(
        async (games) => {
          if (!Array.isArray(games)) return responseError(res, 501);

          games
            .filter((g) => g.status === "canceled")
            .map((game) => {
              Connection.emit("update-game", game);
            });

          await getAllPaymentBySeason({ season: `${m}/${year}` }).then(
            async (payments) => {
              if (!Array.isArray(payments)) return responseError(res, 501);

              const amount = payments
                .map((payment) => payment.value)
                .reduce((a, b) => a + b, 0);

              if (amount === 0) return res.end();

              await updateSeason({
                id: `${m}/${year}`,
                props: {
                  running: false,
                },
              }).then(
                async ({ acknowledged }) => {
                  if (!acknowledged) return responseError(res, 501);

                  clients = clients.filter((c) =>
                    payments.map((p) => p.reference).includes(c.id)
                  );

                  const tax =
                    amount < 10.5 ? 0 : Number(process.env.APP_TAX) ?? 0.4;
                  const appAmount = amount * tax;
                  const awardAmount = amount * (1 - tax);
                  const weight = [[1], [0.65, 0.35], [0.6, 0.3, 0.1]];

                  const winners = getSeasonWinners({
                    clients,
                    games,
                    season: `${m}/${year}`,
                  })
                    .slice(0, 3)
                    .map((winner, position, a) => {
                      return {
                        ...winner,
                        position: position + 1,
                        season: m,
                        award: awardAmount * weight[a.length][position],
                      };
                    });

                  await insertAwardPayments({
                    winners: [
                      ...winners,
                      tax && {
                        id: "cee53a81-dc1e-5a8d-9459-bdc300816688",
                        award: appAmount,
                      },
                    ],
                    payIdPrefix: `app${m}${year}`, // TODO: Mudar isso para isolado dentro do "Winner"
                  }).then(({ acknowledged }) => {
                    if (!acknowledged) return responseError(res, 501);

                    winners.map((winner) => {
                      sendEmail({
                        subject: "[Animesports] Temporada Encerrada!",
                        text: WinnerNotification(winner).text,
                        html: WinnerNotification(winner).html,
                        email: winner.data.email.address,
                      });
                    });

                    generateNotifyId().then((notificationId) => {
                      const wl = winners.length;

                      const notification = {
                        id: notificationId,
                        title: "Temporada Encerrada!",
                        message: `Parabéns ${plural(wl).convert("ao")} ${plural(
                          wl
                        ).convert("vencedor", "es")} da temporada de ${month(
                          m
                        )}.`,
                        winners: winners.map(
                          ({ ["data"]: { name, picture } }) => {
                            return { name, picture };
                          }
                        ),
                      };

                      newNotification(notification).then(({ acknowledged }) => {
                        if (!acknowledged) return;

                        Connection.emit("insert-notification", notification);
                      });
                    });

                    Connection.emit("update-season", {
                      id: `${m}/${year}`,
                      running: false,
                    });

                    //TODO: Criar notificações dentro do APP

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
});

router.post("/open", (req, res) => {
  const { m, year } = req.body.utc_date ?? res.locals.season;

  insertNewSeason({ id: `${m}/${year}` }).then(
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
