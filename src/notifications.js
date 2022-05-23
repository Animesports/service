import express from "express";
import { updateNotification } from "../database/functions.js";
import responseError from "../utils/errors.js";

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
    res.json({ acknowledged });
  });
});

const notifications = { router, methods: "" };
export default notifications;
