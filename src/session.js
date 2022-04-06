import express from "express";
import { searchSessionById } from "../database/functions";
import responseError from "../utils/errors";

const router = express();

router.use("*", (req, res, next) => {
  const [authorization, sessionId] =
    req.headers.authorization?.split("@") ?? [];

  if (authorization !== process.env.APP_TOKEN || !sessionId) {
    return responseError(res, 401);
  }

  if (sessionId === process.env.APP_ID) {
    res.locals.onlyapp = true;
    return next();
  }

  await searchSessionById({sessionId}).then(async (session) => {
    if(!session?.sessionId) return responseError(res, 401, 'Unauthorized: session not found')
    res.locals.session = session
    next()
  }, () => {
    responseError(res, 500)
  })
});

const session = { router, methods: "" };
export default session;
