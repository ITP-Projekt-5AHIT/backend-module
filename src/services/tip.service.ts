import assert from "assert";
import stripe from "../config/stripe";
import ApiError from "../utils/apiError";
import { BAD_REQUEST, NOT_FOUND } from "http-status";
import db from "../utils/db";
import { PaymentMetadata } from "../types/payment";
import services from ".";

const getPaymentById = async (id: string) => {
  const payment = await stripe.paymentIntents.retrieve(id);
  assert(payment, new ApiError(NOT_FOUND, "Payment not found"));

  return payment;
};

export const verifyTipPlaced = async (
  id: string,
  fromCustomerId: string
): Promise<void> => {
  const payment = await getPaymentById(id);

  const payed = payment.status === "succeeded";
  assert(payed, new ApiError(BAD_REQUEST, "Payment still outstanding"));

  const debtorCorrect = payment.customer === fromCustomerId;
  assert(debtorCorrect, new ApiError(BAD_REQUEST, "Not your payment"));

  const createdYet = db.tip.findFirst({
    where: { paymentId: id },
  });
  assert(!createdYet, new ApiError(BAD_REQUEST, "Payment already processed"));
};

export const createTip = async (fromAId: number, paymentId: string) => {
  const payment = await getPaymentById(paymentId);

  const metadata = payment.metadata;
  const isMetadataValid =
    metadata &&
    typeof metadata === "object" &&
    typeof metadata?.recipient === "string" &&
    typeof metadata?.reason === "string" &&
    typeof metadata?.title === "string";

  assert(isMetadataValid, new ApiError(BAD_REQUEST, "Metadata invalid"));

  const decimalAmount = payment.amount / 100.0;

  const toAId = Number.parseInt(metadata?.recipient);
  const recipientValid = await services.auth.findAccountByPk(toAId);
  assert(
    recipientValid,
    new ApiError(NOT_FOUND, "Recipient couldn't be found")
  );
  console.log(1);

  return db.tip.create({
    data: {
      amount: decimalAmount,
      fromAId,
      toAId,
      text: metadata.reason,
      paymentId,
    },
  });
};
