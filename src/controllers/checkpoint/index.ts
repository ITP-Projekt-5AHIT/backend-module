import { BAD_REQUEST, CREATED, UNAUTHORIZED } from "http-status";
import ApiError from "../../utils/apiError";
import catchAsync from "../../utils/catchAsync";
import assert from "assert";
import { Tour } from "@prisma/client";
import { checkPointType } from "../../types/checkpoint";
import { Request } from "express";
import services from "../../services";

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
