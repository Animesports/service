import express from "express";
import {
  getAllPaymentWithId,
  insertNewPayment,
} from "../database/functions.js";
import responseError from "../utils/errors.js";
import { generatePaymentId } from "../utils/token.js";

const router = express();

router.get("/", async (req, res) => {
  const id = res.locals.id;

  await getAllPaymentWithId({ id }).then((payments) => {
    if (!Array.isArray(payments)) return responseError(res, 510);
    res.json(payments);
  });
});

router.post("/", async (req, res) => {
  const id = res.locals.id;
  const { value, identifier } = req.body;

  if (!value) return responseError(res, 400);

  await generatePaymentId({ identifier }).then(
    async (paymentId) => {
      await insertNewPayment({ value, paymentId, id }).then(
        ({ acknowledged }) => {
          if (!acknowledged) return responseError(res, 501);
          res.json({
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
