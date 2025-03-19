import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { Account } from "@prisma/client";
import services from "../services";
import { CONFLICT, NOT_FOUND, OK } from "http-status";
import { PaymentMetadata, premiumMetadata } from "../types/payment";
import assert from "assert";
import ApiError from "../utils/apiError";

export const getSubscribePremium = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { aId, hasPremium } = req.user as Account;
    assert(!hasPremium, new ApiError(CONFLICT, "Premium already purchased"));

    const customer = await services.payment.createCustomer(aId);

    const intent = await services.payment.createPaymentIntent(
      customer,
      1200,
      premiumMetadata
    );

    return res.status(OK).json({ secret: intent.client_secret });
  }
);

export const postVerifyPremium = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { aId, customer, hasPremium } = req.user as Account;
    assert(!hasPremium, new ApiError(CONFLICT, "Premium already purchased"));

    if (!customer || typeof customer !== "string") {
      await services.payment.createCustomer(aId);
      return res.status(NOT_FOUND).json({});
    }

    const success = await services.premium.verifyPremiumPayment(customer);
    if (success) await services.premium.upgradeAccount(aId);

    const status = success ? OK : NOT_FOUND;
    return res.status(status).json({});
  }
);
