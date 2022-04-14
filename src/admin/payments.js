import express from "express";
import {
  deletePayment,
  getAllPayments,
  updatePayment,
} from "../../database/functions.js";
import { ObjToArr, ArrToObj } from "../../utils/converter.js";
import responseError from "../../utils/errors.js";
import schemas from "../../schemas.json" assert { type: "json" };

const router = express();

router.get("/all", async (req, res) => {
  await getAllPayments().then(
    (payments) => {
      if (!Array.isArray(payments)) return responseError(res, 501);
      res.json(payments);
    },
    () => {
      responseError(res, 501);
    }
  );
});

router.patch("/:paymentId", async (req, res) => {
  const paymentId = req.params.paymentId;
  const props = req.body;

  console.info(props);

  if (!paymentId) return responseError(res, 400);

  const acceptProps = ObjToArr(props).filter(([key, value]) => {
    return schemas.payment[key] && typeof value === schemas.payment[key];
  });

  if (acceptProps.length <= 0) return responseError(res, 400);

  await updatePayment({ paymentId, props: ArrToObj(acceptProps) }).then(
    ({ acknowledged, modifiedCount }) => {
      res.json({ acknowledged, modifiedCount });
      console.info(acknowledged, modifiedCount);
    },
    () => {
      responseError(res, 501);
    }
  );
});

router.delete("/:paymentId", async (req, res) => {
  const paymentId = req.params.paymentId;

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

const adminPayments = { router, methods: "" };
export default adminPayments;
