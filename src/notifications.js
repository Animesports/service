import express from "express";
import { updateNotification } from "../database/functions.js";
import responseError from "../utils/errors.js";
import Response from "../utils/response.js";

const router = express();

router.patch("/:notifyId", (req, res) => {
  const notifyId = req.params.notifyId;
  const id = res.locals.id;

  updateNotification({
    id: notifyId,
    func: "push",
    props: { readlist: id },
  }).then(({ acknowledged }) => {
    if (!acknowledged) return responseError(res, 501);
    Response(req, res, { acknowledged });
  });
});

const notifications = { router, methods: "" };
export default notifications;
