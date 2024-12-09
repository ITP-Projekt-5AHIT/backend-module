import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from "http-status";
import ApiError from "../../utils/apiError";
import catchAsync from "../../utils/catchAsync";
import assert from "assert";
import { Account, Tour } from "@prisma/client";
import { checkPointType } from "../../types/checkpoint";
import { Request } from "express";
import services from "../../services";
import { isOnTour } from "../../services/checkpoint";

export const postCreateCheckPoint = catchAsync(
  async (req: Request<object, object, checkPointType>, res, next) => {
    const tours = res.locals.tours as Tour[];
    const { tourId } = req.body;

    assert(
      tours.some((t) => t.tId == tourId),
      new ApiError(
        UNAUTHORIZED,
        "Du musst Tourguide sein, um diese Aktion durchführen zu können"
      )
    );

    const checkpoint = await services.cp.createCheckPoint(req.body);
    return res.status(CREATED).json({ checkpoint });
  }
);

export const getCheckPoints = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  assert(tourId, new ApiError(BAD_REQUEST, "Bitte gib eine Tour-ID mit"));

  const user = req.user as Account;

  if (!isOnTour(tourId, user.aId)) {
    throw new ApiError(
      UNAUTHORIZED,
      "Du musst Mitglied der Tour sein, um Informationen darüber erhalten zu können"
    );
  }
  const checkpoints = await services.cp.loadCheckPoints(tourId, 1000);
  return res.status(OK).json({ checkpoints });
});
