import express from "express";
import { removeClient } from "../../database/functions.js";
import responseError from "../../utils/errors.js";

const router = express();

router.delete("/", async (req, res) => {
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

const adminClients = { router, methods: "" };
export default adminClients;
