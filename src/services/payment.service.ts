import assert from "assert";
import db from "../utils/db";
import ApiError from "../utils/apiError";
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status";
import Stripe from "stripe";
import stripe from "../config/stripe";
import { PaymentMetadata } from "../types/payment";

export const createPayout = async (aId: number, amount: number) => {
  const account = await db.account.findFirst({ where: { aId } });
  assert(
    account?.stripeAccId,
    new ApiError(
      INTERNAL_SERVER_ERROR,
      "Kein existierender Stripe Connect Account gefunden"
    )
  );
  const stripeAccount = await stripe.accounts.retrieve(account?.stripeAccId);
  // create payout for 'stripeAccount'
  const payout = await stripe.payouts.create(
    {
      amount: amount * 100,
      currency: "EUR",
    },
    { stripeAccount: stripeAccount.id }
  );

  await db.payout.create({
    data: {
      amount,
      paymentId: payout.id,
      aId,
    },
  });

  return payout;
};

export const hasStripeConnectAccount = async (aId: number) => {
  const account = await db.account.findFirst({ where: { aId } });
  return account && account.stripeAccId !== null;
};

/**
 * Stripe connect account for payouts
 * @param aId user id
 * @returns Stripe connect account
 */
export const createAccount = async (aId: number) => {
  const account = await db.account.findUnique({ where: { aId } });
  assert(account, new ApiError(NOT_FOUND, "Account wurde nicht gefunden"));

  if (account.stripeAccId) return account.stripeAccId;

  const stripeAccount = await stripe.accounts.create({
    email: account.email,
    default_currency: "EUR",
    type: "express",
    capabilities: { transfers: { requested: true } },
  });

  await db.account.update({
    where: {
      aId,
    },
    data: {
      stripeAccId: stripeAccount.id,
    },
  });

  return stripeAccount;
};

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
