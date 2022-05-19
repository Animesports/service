import http from "http";
import express from "express";
import dotenv from "dotenv";
import responseError from "../utils/errors.js";
import { validateClient } from "../database/functions.js";
import routes, { adminRoutes, appRoutes } from "./routes.js";
import { Connection } from "../database/connection.js";
import override from "./override.js";
import cors from "cors";
import crypto from "./crypto.js";
import session from "./session.js";

import { Server } from "socket.io";

dotenv.config();
const router = express();

router.use(
  cors({
    origin: [
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://animesports.cf",
    ],
  })
);
router.use(express.json());

// Default Routes
router.use(override.router);
router.use(crypto.router);

// Connect Database (check && connect)
router.use(async (req, res, next) => {
  const conn = await Connection.check();
  if (conn?.db && conn?.current) {
    return next();
  }

  responseError(res, 500);
});

// Session Control
router.use(session.router);

// Season Control
router.use((req, res, next) => {
  const date = new Date();
  res.locals.season = {
    day: date.getUTCDate(),
    month: date.getUTCMonth() + 1,
    year: date.getUTCFullYear(),
  };

  date.setMonth(date.getMonth() + 1);

  res.locals.nxtSeason = {
    day: date.getUTCDate(),
    month: date.getUTCMonth() + 1,
    year: date.getUTCFullYear(),
  };

  next();
});

// Authentication (app && user)
router.use((req, res, next) => {
  if (res.locals.onlyapp) return next();

  const { id, email, password } = res.locals.session;

  validateClient({ id, email, password }).then(
    ({ id, admin }) => {
      if (!id) return responseError(res, 401);
      res.locals.id = id;
      res.locals.admin = admin;
      next();
    },
    () => responseError(res, 500)
  );
});

// Validate App Route
router.use("/app*", (req, res, next) => {
  if (res.locals.onlyapp !== true) return responseError(res, 401);
  next();
});

// Validate Admin Route
router.use("/admin*", (req, res, next) => {
  if (res.locals.admin !== true) return responseError(res, 401);
  next();
});

// Use App Routes
Object.keys(appRoutes).forEach((scope) => {
  const address = scope.toLowerCase().replace("app", "");
  router.use(`/app/${address}`, appRoutes[scope].router);
});

// Use Admin Routes
Object.keys(adminRoutes).forEach((scope) => {
  const address = scope.toLowerCase().replace("admin", "");
  router.use(`/admin/${address}`, adminRoutes[scope].router);
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

const io = new Server(httpServer);

Connection.subscribeEmitter(io);

io.on("connection", (socket) => {
  Connection.subscribeListener(socket);

  socket.on("disconnect", () => {
    Connection.removeListener(socket);
  });
});

const PORT = process.env.PORT ?? 6060;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);
