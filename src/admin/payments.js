import express from "express";
import {
  deletePayment,
  getAllPayments,
  updatePayment,
  getAllPaymentWithId,
} from "../../database/functions.js";
import { ObjToArr, ArrToObj } from "../../utils/converter.js";
import responseError from "../../utils/errors.js";
import schemas from "../../schemas.json" assert { type: "json" };
import Response from "../../utils/response.js";

const router = express();

router.get("/all", async (req, res) => {
  await getAllPayments({
    projection: {
      _id: 0,
      expireAt: 0,
      logEvent: 0,
      logMessage: 0,
    },
  }).then(
    (payments) => {
      if (!Array.isArray(payments)) return responseError(res, 501);
      Response(req, res, payments);
    },
    () => {
      responseError(res, 501);
    }
  );
});

router.patch("/:paymentId", async (req, res) => {
  const paymentId = req.params.paymentId;
  const props = req.body.props;
  const reference = req.body.reference;

  if (!paymentId || !reference) return responseError(res, 400);

  if (props.verified === true) {
    const payments = await getAllPaymentWithId({ id: reference });

    const filteredPayments =
      payments
        ?.sort((a, b) => {
          return a.expireAt - b.expireAt;
        })
        .filter((payment) => {
          return payment.id !== paymentId && payment.verified === true;
        }) ?? [];

    const lastExpire =
      filteredPayments[filteredPayments.length - 1]?.expireAt ?? null;

    if (lastExpire) {
      lastExpire.setMonth(lastExpire.getMonth() + 1);
      props.expireAt = lastExpire;
    }

    const payExpire = new Date(
      props.expireAt ??
        payments?.filter((payment) => payment.id === paymentId)[0].expireAt
    );

    if (props.verified === true) {
      const paySeason = payExpire.setMonth(payExpire.getMonth() - 1) && {
        month: payExpire.getUTCMonth() + 1,
        year: payExpire.getUTCFullYear(),
      };

      props.season = `${paySeason.month}/${paySeason.year}`;
    }

    res.locals.payments = payments;
  }

  const acceptProps = ObjToArr(props).filter(([key, value]) => {
    return schemas.payment[key] && typeof value === schemas.payment[key];
  });

  if (acceptProps.length <= 0) return responseError(res, 400);

  await updatePayment({ paymentId, props: ArrToObj(acceptProps) }).then(
    ({ acknowledged, modifiedCount }) => {
      Response(req, res, { acknowledged, modifiedCount });
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
      Response(req, res, { paymentId, deleted: !!deletedCount });
    },
    () => {
      responseError(res, 501);
    }
  );
});

const adminPayments = { router, methods: "" };
export default adminPayments;
