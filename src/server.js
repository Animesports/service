import http from "http";
import express from "express";
import dotenv from "dotenv";
import responseError from "../utils/errors.js";
import { validateClient } from "../database/functions.js";
import routes, { appRoutes, adminRoutes } from "./routes.js";
import { Connection } from "../database/connection.js";
import override from "./override.js";

dotenv.config();
const router = express();

// Default Routes
router.use(override.router);

// Connect Database (check && connect)
router.use(async (req, res, next) => {
  const conn = await Connection.check();
  if (conn?.db && conn?.current) {
    return next();
  }

  responseError(res, 500);
});

// Authentication (app && user)
router.use((req, res, next) => {
  const [authorization, id] = req.headers.authorization?.split("@") ?? [];

  if (authorization !== process.env.APP_TOKEN || !id)
    return responseError(res, 401);

  if (id === process.env.APP_ID) {
    res.locals.onlyapp = true;
    return next();
  }

  validateClient({ id }).then(
    ({ id, admin }) => {
      if (!id) return responseError(res, 401);
      res.locals.id = id;
      res.locals.admin = admin;
      next();
    },
    () => responseError(res, 500)
  );
});

// Filter Only App Routes
appRoutes.forEach(([method, address]) => {
  router[method](address, (req, res, next) => {
    if (res.locals.onlyapp !== true) return responseError(res, 401);
    next();
  });
});

// Filter Only Admin Routes
adminRoutes.forEach(([method, address]) => {
  router[method](address, (req, res, next) => {
    if (res.locals.admin !== true) return responseError(res, 401);
    next();
  });
});

// User All Avaliable Routes
Object.keys(routes).forEach((scope) => {
  router.use(`/${scope}`, routes[scope].router);
});

// Default Not Found Route
router.use((_req, res) => {
  return responseError(res, 404);
});

// Server Listener
const httpServer = http.createServer(router);
const PORT = process.env.PORT ?? 6060;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);
