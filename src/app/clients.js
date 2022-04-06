import express from "express";
import {
  findClientEmail,
  getAllClientDataWithId,
  insertNewClient,
  insertNewSession,
  validateClientCredentials,
} from "../../database/functions.js";
import responseError from "../../utils/errors.js";
import { generateId, generateSessionId } from "../../utils/token.js";

const router = express();

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
          if (acknowledged) {
            const client = await getAllClientDataWithId({ id });
            return res.json({
              success: acknowledged,
              client: client ?? responseError(null, 510),
            });
          }
          responseError(res, 501);
        }
      );
    },
    () => {
      responseError(res, 501);
    }
  );
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
          () => {
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
