import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { Account } from "@prisma/client";
import services from "../services";
import { OK } from "http-status";

export const postSubscribePremium = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { aId } = req.user as Account;
    //TODO: check if premium subscribed

    const customer = await services.payment.createCustomer(aId);
    const intent = await services.payment.createPaymentIntent(customer, 1200);

    return res.status(OK).json({ secret: intent.client_secret });
  }
);
