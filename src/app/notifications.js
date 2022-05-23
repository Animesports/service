import express from "express";
import { getAllNotifications } from "../../database/functions.js";

import responseError from "../../utils/errors.js";

const router = express();

router.get("/", (req, res) => {
  getAllNotifications().then((notifications) => {
    if (!Array.isArray(notifications)) return responseError(res, 501);
    res.json(notifications);
  });
});

const appNotifications = { router, methods: "" };
export default appNotifications;
