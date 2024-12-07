import { Request } from "express";
import catchAsync from "../../utils/catchAsync";
import {
  loadedTourGuideTours,
  subscribeType,
  tourType,
} from "../../types/tour";
import services from "../../services";
import { Account } from "@prisma/client";
import { CONFLICT, CREATED, NOT_FOUND, OK } from "http-status";
import ApiError from "../../utils/apiError";
import assert from "assert";

export const getTourDetails = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const tour = await services.tour.loadTourById(tourId);
  assert(
    tour != null,
    new ApiError(NOT_FOUND, "Tour wurde leider nicht gefunden")
  );
  const tours = res.locals.tours as loadedTourGuideTours[];
  console.log(tours);
  const isTourGuide = tours && tours?.some((t) => t?.tId == tour.tId);
  const loadedData = await services.tour.pickTourData(tour, isTourGuide);
  return res.status(OK).json({ tour: { ...loadedData } });
});

export const postCreateTour = catchAsync(
  async (req: Request<object, object, tourType>, res, next) => {
    const account = req.user as Account;
    if (await services.tour.hasStartingTours(account.aId))
      return next(
        new ApiError(
          CONFLICT,
          "Du darfst nicht mehrere Tours gleichzeitig anlegen"
        )
      );
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
