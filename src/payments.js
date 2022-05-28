import express from "express";
import {
  getAllPaymentWithId,
  getSeasonById,
  insertNewPayment,
} from "../database/functions.js";
import responseError from "../utils/errors.js";
import { generatePaymentId } from "../utils/token.js";
import Response from "../utils/response.js";
import { temporally } from "../utils/projections.js";

const router = express();

router.get("/", async (req, res) => {
  const id = res.locals.id;

  await getAllPaymentWithId(
    { id },
    {
      projection: temporally(),
    }
  ).then((payments) => {
    if (!Array.isArray(payments)) return responseError(res, 510);
    Response(req, res, payments);
  });
});

router.post("/", async (req, res) => {
  const season = res.locals.season;
  const id = res.locals.id;
  const verified = res.locals.verified;

  const { identifier } = req.body;

  const value = (await getSeasonById({ id: `${season.month}/${season.year}` }))
    ?.ticket;

  if (!identifier || !value) return responseError(res, 400);
  if (!verified) return responseError(res, 403);

  await generatePaymentId({ identifier }).then(
    async (paymentId) => {
      await insertNewPayment({ value, paymentId, id }).then(
        ({ acknowledged }) => {
          if (!acknowledged) return responseError(res, 501);
          Response(req, res, {
            success: acknowledged,
            payment: {
              value,
              id: paymentId,
              verified: false,
              reference: id,
            },
          });
        },
        () => {
          responseError(res, 501);
        }
      );
    },
    () => {
      responseError(res, 501);
    }
  );
});

const payments = { router, methods: "" };
export default payments;
