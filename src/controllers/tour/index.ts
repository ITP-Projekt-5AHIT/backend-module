import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import {
  deleteSubscriptionType,
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

export const deleteTourSubscription = catchAsync(
  async (
    req: Request<deleteSubscriptionType>,
    res: Response,
    _next: NextFunction
  ) => {
    const { tId } = req.params;
    const { aId } = req.user as Account;
    const tour = await services.tour.loadTourById(tId);
    assert(tour != null, new ApiError(NOT_FOUND, "Tour nicht gefunden"));
    assert(
      tour.participants.some((p) => p.aId == aId),
      new ApiError(CONFLICT, "Kein Teilnehmer dieser Tour")
    );
    await services.tour.unsubscribeTour(aId, tId);
    return res.status(OK).json({});
  }
);

export const getUserTour = catchAsync(async (req, res, next) => {
  const { aId } = req.user as Account;
  const activeTour = await services.tour.findActiveTour(aId);
  const status = activeTour ? OK : NOT_FOUND;
  const isTourGuide = activeTour && activeTour.tourGuide == aId;
  return res.status(status).json({ tour: { ...activeTour, isTourGuide } });
});

export const deleteTour = catchAsync(
  async (req: Request<deleteTourType>, res, next) => {
    const { tId } = req.params;
    const user = req.user as Account;
    const deleted = await services.tour.deleteTour(tId, user.aId);
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
    const { endDate, startDate } = req.body;
    const { startingTours, tours } = await services.tour.hasStartingTours(
      account.aId,
      startDate,
      endDate
    );
    if (startingTours)
      throw new ApiError(
        CONFLICT,
        "Du darfst nicht Touren überlappende Touren anlegen",
        JSON.stringify({ tours })
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
