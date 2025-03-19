import assert from "assert";
import db from "../utils/db";
import ApiError from "../utils/apiError";
import { NOT_FOUND } from "http-status";
import Stripe from "stripe";
import stripe from "../config/stripe";
import { PaymentMetadata } from "../types/payment";

export const createCustomer = async (aId: number) => {
  const account = await db.account.findFirst({
    where: { aId },
  });
  assert(account, new ApiError(NOT_FOUND, "Account not found"));

  const foundId = account.customer;
  if (foundId && typeof foundId === "string") {
    const customerValid = await stripe.customers.retrieve(foundId);
    if (!customerValid.deleted) return foundId;
  }

  const params: Stripe.CustomerCreateParams = {
    email: account.email,
    name: `${account.firstName} ${account.lastName}`,
    balance: 0,
  };

  const { id } = await stripe.customers.create(params);

  updateCustomer(aId, id);

  return id;
};

export const updateCustomer = async (aId: number, customer: string) => {
  return db.account.update({
    where: { aId },
    data: {
      customer,
    },
  });
};

export const createPaymentIntent = async (
  customerId: string,
  amountInCents: number,
  metadata: PaymentMetadata
) => {
  const paymentParams: Stripe.PaymentIntentCreateParams = {
    customer: customerId,
    amount: amountInCents,
    currency: "EUR",
    metadata,
  };

  const paymentIntent = await stripe.paymentIntents.create(paymentParams);

  return paymentIntent;
};
