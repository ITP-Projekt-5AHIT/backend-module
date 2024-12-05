import { Request } from "express";
import catchAsync from "../../utils/catchAsync";
import { subscribeType, tourType } from "../../types/tour";
import services from "../../services";
import { Account } from "@prisma/client";
import { CREATED, OK } from "http-status";

export const postCreateTour = catchAsync(
  async (req: Request<object, object, tourType>, res, next) => {
    const account = req.user as Account;
    const tour = await services.tour.createTour(req.body, account.aId);
    return res.status(CREATED).json(tour);
  }
);

export const postSubscribeTour = catchAsync(
  async (req: Request<object, object, subscribeType>, res, next) => {
    const { accessCode } = req.body;
    const user = req.user as Account;
    const tour = await services.tour.subscribeTour(
      String(accessCode),
      user.aId
    );
    return res.status(OK).json({ tour });
  }
);
