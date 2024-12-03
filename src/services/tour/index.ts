import dayjs from "dayjs";
import { tourType } from "../../types/tour";
import db from "../../utils/db";
import { catchPrisma } from "../../middlewares/error";
import catchAsync from "../../utils/catchAsync";
import assert from "assert";
import ApiError from "../../utils/apiError";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status";

export const createTour = async (tour: tourType, aId: number) => {
  const tourCode = Math.floor(100000000 + Math.random() * 900000000);
  return await catchPrisma(
    async () =>
      await db.tour.create({
        data: {
          tourGuide: aId,
          startDate: dayjs(tour.startDate).toDate(),
          endDate: dayjs(tour.endDate).toDate(),
          description: tour.description,
          accessCode: String(tourCode),
          name: tour.name,
        },
      })
  );
};

export const subscribeTour = async (accessCode: string, aId: number) => {
  const foundTour = await catchPrisma(
    async () => await db.tour.findFirst({ where: { accessCode } })
  );
  assert(
    foundTour,
    new ApiError(
      NOT_FOUND,
      "Access-Code ungültig",
      "Mit diesem Code wurde keine Tour in der DB gefunden"
    )
  );
  assert(
    foundTour.tourGuide != aId,
    new ApiError(BAD_REQUEST, "Du kannst deiner eigenen Tour nicht beitreten")
  );
  const account = await catchPrisma(
    async () =>
      await db.account.update({
        where: { aId },
        data: {
          joined: { connect: foundTour },
        },
      })
  );
  assert(
    account,
    new ApiError(INTERNAL_SERVER_ERROR, "Bitte probiere es erneut")
  );
  return foundTour;
};
