import express from "express";
import res from "express/lib/response";

const router = express();

router.post("/close", () => {
  res.send("Close season");
});

router.post("/open", () => {
  res.send("Open season");
});

const appSeasons = { router, methods: "" };
export default appSeasons;
