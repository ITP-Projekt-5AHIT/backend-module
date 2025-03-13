import { Account } from "@prisma/client";
import { NextFunction, Request } from "express";
import services from "../services";
import ApiError from "../utils/apiError";
import { CONFLICT, FORBIDDEN } from "http-status";

export const isPremium =
  (assertation: boolean) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { aId } = req.user as Account;
    const account = await services.auth.findAccountByPk(aId);
    if (!(account && aId)) next(new ApiError(FORBIDDEN, ""));
    const failed = assertation ? account?.customer : !account?.customer;
    if (failed)
      next(new ApiError(CONFLICT, "Already subscribed to premium plan"));
    next();
  };
