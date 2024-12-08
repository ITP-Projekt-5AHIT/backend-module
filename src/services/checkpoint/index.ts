import assert from "assert";
import { catchPrisma } from "../../middlewares/error";
import { checkPointType } from "../../types/checkpoint";
import db from "../../utils/db";
import dayjs from "dayjs";
import ApiError from "../../utils/apiError";
import { BAD_REQUEST, NOT_FOUND } from "http-status";

export const createCheckPoint = async (checkpoint: checkPointType) => {
  const tour = await db.tour.findFirst({
    where: {
      tId: checkpoint.tourId,
    },
  });

  assert(
    tour != null,
    new ApiError(NOT_FOUND, "Tour mit dieser ID konnte nicht gefunden werden")
  );

  if (
    checkpoint.isMeetingPoint &&
    dayjs(tour.startDate).isBefore(checkpoint.time) &&
    dayjs(tour.endDate).isAfter(checkpoint.time)
  ) {
    throw new ApiError(
      BAD_REQUEST,
      "Der Treffpunkt muss zeitlich innerhalb der Tour liegen"
    );
  }

  return await catchPrisma(
    async () =>
      await db.checkpoint.create({
        data: {
          isMeetingPoint: checkpoint.isMeetingPoint ?? true,
          name: checkpoint.name,
          time: dayjs(checkpoint.time!).toDate(),
          tourId: checkpoint.tourId,
          lId: checkpoint.locationId,
        },
        include: {
          location: true,
          tour: true,
        },
      })
  );
};
