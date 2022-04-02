import express from "express";
import {
  findClientEmail,
  insertNewClient,
  validateClientCredentials,
} from "../../database/functions.js";
import responseError from "../../utils/errors.js";
import { generateId } from "../../utils/token.js";

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
        ({ acknowledged }) => {
          if (acknowledged) return res.json({ success: acknowledged });
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
    (client) => {
      res.json({ valid: true, client });
    },
    (error) => {
      if (error !== "not-found") return responseError(res, 501);
      res.json({ valid: false });
    }
  );
});

const appClients = { router, methods: "" };
export default appClients;
