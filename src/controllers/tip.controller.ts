import { NextFunction, Request, Response } from "express";
import { tipType } from "../types/tip";
import catchAsync from "../utils/catchAsync";
import { Account } from "@prisma/client";
import services from "../services";
import { PaymentMetadata } from "../types/payment";
import { randomUUID } from "crypto";
import { CREATED } from "http-status";

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
      amount,
      metadata
    );

    return res
      .status(CREATED)
      .json({ secret: payment.client_secret, id: payment.id });
  }
);
