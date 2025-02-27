import assert from "assert";
import db from "../utils/db";
import ApiError from "../utils/apiError";
import { NOT_FOUND } from "http-status";
import Stripe from "stripe";
import stripeProvider from "../config/stripe";

export const createCustomer = async (aId: number) => {
  const account = await db.account.findFirst({
    where: { aId },
  });

  assert(account, new ApiError(NOT_FOUND, "Account not found"));

  const params: Stripe.CustomerCreateParams = {
    email: account.email,
    name: `${account.firstName} ${account.lastName}`,
  };

  const customer = await stripeProvider.customers.create(params);

  return { account, customer };
};

export const createPaymentIntent = async (
  customerId: string,
  amount: number
) => {
  const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
    customer: customerId,
    amount,
    currency: "EUR",
  };

  const paymentIntent = await stripeProvider.paymentIntents.create(
    paymentIntentParams
  );

  return paymentIntent;
};
