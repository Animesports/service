import express from "express";
import {
  findClientEmail,
  getAllClientDataWithId,
  insertNewClient,
  removeClient,
  updateClient,
  validateClientCredentials,
} from "../database/functions.js";
import responseError from "../utils/errors.js";
import { generateId } from "../utils/token.js";
import schemas from "../schemas.json";
import { ArrToObj, ObjToArr } from "../utils/converter.js";

const router = express();

router.get("/", async (req, res) => {
  // Get updated user data and user config : OPEN && LOGGED
  const id = res.locals.id;
  console.info(id);
  await getAllClientDataWithId({ id }).then((user) => {
    if (!user?.id) return responseError(res, 400);
    res.json(user);
  });
});

router.patch("/", async (req, res) => {
  // Update user data and user config : ACCOUNT
  const id = res.locals.id;
  const props = req.body;
  if (!props || typeof props !== "object") return responseError(res, 400);

  const acceptProps = ObjToArr(props).filter(([key, value]) => {
    return schemas.user[key] && typeof value === schemas.user[key];
  });

  if (acceptProps.length <= 0) return responseError(res, 400);

  await updateClient({ id, props: ArrToObj(acceptProps) }).then(
    ({ acknowledged, modifiedCount }) => {
      res.json({ acknowledged, modifiedCount });
    },
    () => {
      responseError(res, 501);
    }
  );
});

router.delete("/", async (req, res) => {
  // Remove a unique user : ADMIN
  const { name, email } = req.body;
  if (!name || !email) return responseError(res, 400);

  await removeClient({ email, name }).then(
    ({ deletedCount }) => {
      res.json({ email, deleted: !!deletedCount });
    },
    () => {
      responseError(res, 501);
    }
  );
});

router.post("/", async (req, res) => {
  // Create a new user in database : REGISTER
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
  // Validate user and (if) return client data : LOGIN
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

const clients = { router, methods: "" };
export default clients;
