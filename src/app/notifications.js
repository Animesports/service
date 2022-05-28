import express from "express";
import { getAllNotifications } from "../../database/functions.js";
import Response from "../../utils/response.js";
import responseError from "../../utils/errors.js";

const router = express();

router.get("/", (req, res) => {
  getAllNotifications().then((notifications) => {
    if (!Array.isArray(notifications)) return responseError(res, 501);
    Response(req, res, notifications);
  });
});

const appNotifications = { router, methods: "" };
export default appNotifications;
