import express from "express";
import expressContentTypeOverride from "express-content-type-override";

const router = express();

router.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Allow-Credentials, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "https://animesports.cf/");
    res.setHeader("Access-Control-Allow-Methods", `POST,DELETE,GET,PATCH`);
    return res.status(200).json({
      methods: "POST,DELETE,GET,PATCH",
    });
  }
  next();
});

router.use(
  "*",
  expressContentTypeOverride({ contentType: "application/json" })
);
router.use(express.json({ type: "application/json" }));
router.use(express.urlencoded({ extended: true }));

const override = { router, methods: "" };
export default override;
