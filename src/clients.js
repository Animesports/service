import express from "express";
import {
  getAllClientDataWithId,
  updateClient,
  updateSession,
} from "../database/functions.js";
import responseError from "../utils/errors.js";
import schemas from "../schemas.json" assert { type: "json" };
import { ArrToObj, ObjToArr } from "../utils/converter.js";

const router = express();

router.get("/", async (req, res) => {
  const id = res.locals.id;

  await getAllClientDataWithId({ id }).then((user) => {
    if (!user?.id) return responseError(res, 400);
    res.json(user);
  });
});

router.patch("/", async (req, res) => {
  const id = res.locals.id;
  const sessionId = res.locals.session.sessionId;
  const props = req.body;

  if (!props || typeof props !== "object") return responseError(res, 400);

  const acceptProps = ObjToArr(props).filter(([key, value]) => {
    return schemas.user[key] && typeof value === schemas.user[key];
  });

  if (acceptProps.length <= 0) return responseError(res, 400);

  const sessionProps = ObjToArr(schemas.session)
    .filter(([_s, [_t, uKey]]) => {
      return acceptProps.map(([key]) => key).includes(uKey);
    })
    .map(([key, [_t, uKey]]) => {
      return [key, ArrToObj(acceptProps)[uKey]];
    });

  if (sessionProps.length >= 1) {
    await updateSession({ sessionId, props: ArrToObj(sessionProps) });
  }

  await updateClient({ id, props: ArrToObj(acceptProps) }).then(
    ({ acknowledged, modifiedCount }) => {
      res.json({ acknowledged, modifiedCount });
    },
    () => {
      responseError(res, 501);
    }
  );
});

const clients = { router, methods: "" };
export default clients;
