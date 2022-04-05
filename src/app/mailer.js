import express from "express";
import {
  updateClientByEmail,
  validationCreate,
  validationRemove,
  validationSearcher,
} from "../../database/functions.js";
import responseError from "../../utils/errors.js";
import { generateCode, generateToken } from "../../utils/token.js";

const router = express();

router.post("/code", async (req, res) => {
  const { email } = req.body;
  if (!email) return responseError(res, 400);

  await generateCode().then(
    async (code) => {
      await validationCreate({
        type: "code",
        value: code,
        reference: email,
      }).then(
        ({ acknowledged }) => {
          res.json({ success: acknowledged, code });
        },
        () => {
          responseError(res, 500);
        }
      );
    },
    () => {
      responseError(res, 500);
    }
  );
});

router.get("/code/:code", async (req, res) => {
  const code = req.params.code;
  if (!code) return responseError(res, 400);

  await validationSearcher({ code }).then(
    async (document) => {
      if (!document.reference) return responseError(res, 510);
      await updateClientByEmail({
        email: document.reference,
        props: {
          "data.email.verified": true,
        },
      }).then(async ({ acknowledged }) => {
        await validationRemove({ code });
        res.json({ success: acknowledged });
      });
    },
    () => {
      responseError(res, 500);
    }
  );
});

router.post("/token", async (req, res) => {
  const { email } = req.body;
  if (!email) return responseError(res, 400);

  await generateToken().then(
    async (token) => {
      await validationCreate({
        type: "token",
        value: token,
        reference: email,
      }).then(
        ({ acknowledged }) => {
          res.json({ success: acknowledged, token });
        },
        () => {
          responseError(res, 500);
        }
      );
    },
    () => {
      responseError(res, 500);
    }
  );
});

router.get("/token/:token", async (req, res) => {
  const token = req.params.token;
  if (!token) return responseError(res, 400);

  await validationSearcher({ token }).then(
    async (document) => {
      if (!document.reference) return responseError(res, 510);
      await updateClientByEmail({
        email: document.reference,
        props: {
          "data.email.verified": true,
        },
      }).then(async ({ acknowledged }) => {
        await validationRemove({ token });
        res.json({ success: acknowledged });
      });
    },
    () => {
      responseError(res, 500);
    }
  );
});

const appMailer = { router, methods: "" };
export default appMailer;
