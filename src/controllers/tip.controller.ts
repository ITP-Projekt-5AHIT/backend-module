import { NextFunction, Request, Response } from "express";
import { tipType, verifyTipType } from "../types/tip";
import catchAsync from "../utils/catchAsync";
import { Account } from "@prisma/client";
import services from "../services";
import { PaymentMetadata } from "../types/payment";
import { BAD_REQUEST, CREATED, OK } from "http-status";
import ApiError from "../utils/apiError";
import assert from "assert";

export const getPayout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { aId } = req.user as Account;
    const payoutSum = await services.tip.calcPayoutAmount(aId);

    assert(
      payoutSum > 5,
      new ApiError(BAD_REQUEST, "Auszahlungen unter 5 Euro nicht genehmigt")
    );

    const hasStripeAccount = await services.payment.hasStripeConnectAccount(
      aId
    );
    if (!hasStripeAccount) await services.payment.createAccount(aId);

    const payout = await services.payment.createPayout(aId, payoutSum);

    return res.json({ payout });
  }
);

export const postTip = catchAsync(
  async (
    req: Request<object, object, tipType>,
    res: Response,
    _next: NextFunction
  ) => {
    const { amount, userName, text } = req.body;
    const { aId, userName: ownUserName } = req.user as Account;

    assert(
      userName !== ownUserName,
      new ApiError(BAD_REQUEST, "Tipping to yourself not allowed")
    );
    const customerId = await services.payment.createCustomer(aId);

    // simultaneously checks whether the user name is valid
    const target = await services.auth.findAccountByUserName(userName);

    const metadata: PaymentMetadata = {
      title: `Tip for ${userName}`,
      reason: `${text}`,
      recipient: target.aId,
    };
    const payment = await services.payment.createPaymentIntent(
      customerId,
      amount * 100.0,
      metadata
    );

    return res
      .status(CREATED)
      .json({ secret: payment.client_secret, id: payment.id });
  }
);

export const postVerifyTip = catchAsync(
  async (
    req: Request<object, object, verifyTipType>,
    res: Response,
    _next: NextFunction
  ) => {
    const { id } = req.body;
    const { aId } = req.user as Account;

    const customerId = await services.payment.createCustomer(aId);
    // if payment was not successful, error is thrown
    await services.tip.verifyTipPlaced(id, customerId);

    const tip = await services.tip.createTip(aId, id);

    return res
      .status(CREATED)
      .json({ message: "Thank you for your generosity", tip });
  }
);

export const getTips = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { aId } = req.user as Account;
    const tips = await services.tip.getTipsByCId(aId);

    return res.status(OK).json(tips);
  }
);
