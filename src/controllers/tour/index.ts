import { Request } from "express";
import catchAsync from "../../utils/catchAsync";
import {
  deleteTourType,
  loadedTourGuideTours,
  subscribeType,
  tourType,
} from "../../types/tour";
import services from "../../services";
import { Account } from "@prisma/client";
import {
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} from "http-status";
import ApiError from "../../utils/apiError";
import assert from "assert";

export const deleteTour = catchAsync(
  async (req: Request<object, object, deleteTourType>, res, next) => {
    const { tourId } = req.body;
    const user = req.user as Account;
    const deleted = await services.tour.deleteTour(tourId, user.aId);
    const status = deleted ? OK : BAD_REQUEST;
    return res.status(status).json({});
  }
);

export const getTourDetails = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const user = req.user as Account;
  const tour = await services.tour.loadTourById(tourId);
  assert(
    tour != null,
    new ApiError(NOT_FOUND, "Tour wurde leider nicht gefunden")
  );
  const tours = res.locals.tours as loadedTourGuideTours[];
  const isTourGuide = tours && tours?.some((t) => t?.tId == tour.tId);
  assert(
    isTourGuide || tour.participants.some((p) => p.aId == user.aId),
    new ApiError(
      UNAUTHORIZED,
      "Du musst entweder Ersteller oder Teilnehmer sein, um die Daten sehen zu dürfen"
    )
  );
  const loadedData = await services.tour.pickTourData(tour, isTourGuide);
  return res.status(OK).json({ ...loadedData });
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
