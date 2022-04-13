import express from "express";
import {
  deletePayment,
  getAllPaymentWithId,
  insertNewPayment,
  updatePayment,
} from "../database/functions.js";
import responseError from "../utils/errors.js";
import { generatePaymentId } from "../utils/token.js";
import schemas from "../schemas.json" assert { type: "json" };
import { ArrToObj } from "../utils/converter.js";

const router = express();

router.get("/", async (req, res) => {
  const id = res.locals.id;

  await getAllPaymentWithId({ id }).then((payments) => {
    console.info("Get", payments);
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

router.patch("/:paymentId", async (req, res) => {
  const paymentId = req.params.paymentId;
  const props = req.body;

  if (!paymentId) return responseError(res, 400);

  const acceptProps = ObjToArr(props).filter(([key, value]) => {
    return schemas.payment[key] && typeof value === schemas.payment[key];
  });

  if (acceptProps.length <= 0) return responseError(res, 400);

  await updatePayment({ paymentId, props: ArrToObj(acceptProps) }).then(
    (payments) => {
      if (!Array.isArray(payments)) return responseError(res, 510);
      res.json(payments);
    },
    () => {
      responseError(res, 501);
    }
  );
});

router.delete("/:paymentId", async (req, res) => {
  const { paymentId } = req.params.paymentId;
  if (!paymentId) return responseError(res, 400);

  await deletePayment({ paymentId }).then(
    ({ deletedCount }) => {
      res.json({ paymentId, deleted: !!deletedCount });
    },
    () => {
      responseError(res, 501);
    }
  );
});

const payments = { router, methods: "" };
export default payments;
