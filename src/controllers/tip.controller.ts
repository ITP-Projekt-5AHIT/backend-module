import { NextFunction, Request, Response } from "express";
import { tipType, verifyTipType } from "../types/tip";
import catchAsync from "../utils/catchAsync";
import { Account } from "@prisma/client";
import services from "../services";
import { PaymentMetadata } from "../types/payment";
import { CREATED, OK } from "http-status";

export const postTip = catchAsync(
  async (
    req: Request<object, object, tipType>,
    res: Response,
    _next: NextFunction
  ) => {
    const { amount, userName, text } = req.body;
    const { aId } = req.user as Account;

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
