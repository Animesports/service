import express from "express";
import {
  getAllClientDataWithId,
  updateClient,
  updateSession,
} from "../database/functions.js";
import responseError from "../utils/errors.js";
import schemas from "../schemas.json" assert { type: "json" };
import { ArrToObj, ObjToArr } from "../utils/converter.js";
import { v2 as cloudinary } from "cloudinary";

const router = express();

router.get("/", async (req, res) => {
  const id = res.locals.id;

  await getAllClientDataWithId({ id }).then((user) => {
    if (!user?.id) return responseError(res, 400);
    res.json(user);
  });
});

router.post("/profile", (req, res) => {
  const image64 = req.body.image64;
  const id = res.locals.id;

  if (typeof image64 !== "string") return responseError(res, 400);

  cloudinary.config({
    cloud_name: "hugorodriguesqw",
    api_key: String(process.env.CLOUDINARY_KEY),
    api_secret: String(process.env.CLOUDINARY_SECRET),
  });

  cloudinary.uploader
    .upload(image64, {
      overwrite: true,
      invalidate: true,
      public_id: "animesports/" + id,
      transformation: [
        { height: 120, width: 120, crop: "limit" },
        { gravity: "center", height: 120, width: 120, crop: "crop" },
        { fetch_format: "webp" },
      ],
    })
    .then(
      (response) => {
        if (response?.public_id) return res.json(response);
        responseError(res, 501);
      },
      () => {
        responseError(res, 501);
      }
    );
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
