import express from "express";

const router = express();

router.post("/close", (req, res) => {
  res.send("Close season");
});

router.post("/open", (req, res) => {
  const date = { day: 19, month: 4, year: 2022 } ?? req.body.date;

  res.send("Open season");
});

const appSeasons = { router, methods: "" };
export default appSeasons;
