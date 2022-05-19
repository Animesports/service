import express from "express";
import {
  findClientEmail,
  getAllClientDataWithId,
  getAllClients,
  getAllPayments,
  insertNewClient,
  insertNewSession,
  validateClientCredentials,
} from "../../database/functions.js";
import responseError from "../../utils/errors.js";
import { generateId, generateSessionId } from "../../utils/token.js";

const router = express();

router.get("/", async (req, res) => {
  const { month, year } = res.locals.season;

  await getAllPayments().then(async (payments) => {
    if (!Array.isArray(payments)) return responseError(res, 501);

    payments = payments
      .filter((pay) => pay.season === `${month}/${year}`)
      .map((pay) => pay.reference);

    await getAllClients().then((clients) => {
      if (!Array.isArray(clients)) return responseError(res, 501);

      clients = clients.filter((client) => payments.includes(client.id));

      res.json(
        clients.map(({ id, ["data"]: { name, picture } }) => {
          return {
            id,
            data: {
              name,
              picture,
            },
          };
        })
      );
    });
  });
});

router.post("/", async (req, res) => {
  const { email, password, name } = req.body ?? {};

  if (!email || !password || !name) return responseError(res, 400);

  const hasEmail = await findClientEmail({ email });

  if (hasEmail?.address)
    return responseError(res, 400, "invalid email address");

  await generateId({ email }).then(
    async (id) => {
      await insertNewClient({ name, email, password, id }).then(
        async ({ acknowledged }) => {
          const clientInserted = acknowledged;

          if (acknowledged) {
            return await getAllClientDataWithId({ id }).then(
              async (client) => {
                await generateSessionId({ id: client.id }).then(
                  async (sessionId) => {
                    await insertNewSession({
                      sessionId,
                      id: client.id,
                      password: client.data.password,
                      email: client.data.email.address,
                    }).then(
                      ({ acknowledged }) => {
                        if (!acknowledged) return error(clientInserted);
                        res.json({
                          success: true,
                          sessionId,
                          client: client,
                        });
                      },
                      () => {
                        error(clientInserted);
                      }
                    );
                  },
                  () => {
                    error(clientInserted);
                  }
                );
              },
              () => {
                error(clientInserted);
              }
            );
          }
          responseError(res, 501);
        }
      );
    },
    () => {
      responseError(res, 501);
    }
  );

  function error(inserted) {
    if (inserted)
      return res.json({
        success: true,
        client: responseError(null, 510),
      });
    responseError(res, 501);
  }
});

router.post("/validate", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return responseError(res, 400);

  await validateClientCredentials({ email, password }).then(
    async (client) => {
      await generateSessionId({ id: client.id }).then(async (sessionId) => {
        await insertNewSession({
          sessionId,
          id: client.id,
          password: client.data.password,
          email: client.data.email.address,
        }).then(
          ({ acknowledged }) => {
            if (!acknowledged) return responseError(res, 501);
            res.json({ valid: true, sessionId, client });
          },
          () => {
            responseError(res, 501);
          }
        );
      });
    },
    (error) => {
      if (error !== "not-found") return responseError(res, 501);
      res.json({ valid: false });
    }
  );
});

const appClients = { router, methods: "" };
export default appClients;
