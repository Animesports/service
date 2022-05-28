import express from "express";
import { getAllClients, removeClient } from "../../database/functions.js";
import responseError from "../../utils/errors.js";
import Response from "../../utils/response.js";

const router = express();

router.get("/all", async (req, res) => {
  await getAllClients({
    projection: { _id: 0, config: 0, "data.password": 0 },
  }).then(
    (clients) => {
      if (!Array.isArray(clients)) return responseError(res, 501);
      Response(req, res, clients);
    },
    (err) => {
      console.info(err);
      responseError(res, 501);
    }
  );
});

router.delete("/", async (req, res) => {
  const { name, email, id } = req.body;
  if (!name || !email || !id) return responseError(res, 400);

  await removeClient({ email, name, id }).then(
    ({ deletedCount }) => {
      Response(req, res, { deleted: !!deletedCount });
    },
    () => {
      responseError(res, 501);
    }
  );
});

const adminClients = { router, methods: "" };
export default adminClients;
