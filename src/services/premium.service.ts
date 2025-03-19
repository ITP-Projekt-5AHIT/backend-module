import logger from "../config/logger";
import stripe from "../config/stripe";
import db from "../utils/db";
import { PaymentMetadata, premiumMetadata } from "../types/payment";

export const verifyPremiumPayment = async (customerId: string) => {
  if (!customerId) return false;

  const paymentIntents = await stripe.paymentIntents.list({
    customer: customerId,
    limit: 1000,
  });

  logger.info("verify premium for customer id ", customerId);

  const successfulPayments = paymentIntents.data
    .filter((paymentIntent) => paymentIntent.status === "succeeded")
    .filter((data) => {
      const meta = data.metadata;
      if (!(meta && meta?.title && meta?.reason)) return false;
      const payment = meta as PaymentMetadata;
      return (
        payment.title === premiumMetadata.title &&
        payment.reason === premiumMetadata.reason
      );
    });

  // Log metadata for each successful payment
  successfulPayments.forEach((payment) => {
    logger.debug("Payment ID: " + payment.id);
    logger.debug("Title: " + payment.metadata.title);
    logger.debug("Reason: " + payment.metadata.reason);
  });

  return successfulPayments.length > 0;
};

export const upgradeAccount = async (aId: number) => {
  return db.account.update({
    where: { aId },
    data: {
      hasPremium: true,
    },
  });
};
