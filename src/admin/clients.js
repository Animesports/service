import express from "express";
import { getAllClients, removeClient } from "../../database/functions.js";
import responseError from "../../utils/errors.js";

const router = express();

router.get("/all", async (req, res) => {
  await getAllClients().then(
    (clients) => {
      if (!Array.isArray(clients)) return responseError(res, 501);
      res.json(clients);
    },
    () => {
      responseError(res, 501);
    }
  );
});

router.delete("/", async (req, res) => {
  console.info("delete");
  const { name, email, id } = req.body;
  if (!name || !email || !id) return responseError(res, 400);

  await removeClient({ email, name, id }).then(
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
