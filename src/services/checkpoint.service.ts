import assert from "assert";
import { catchPrisma } from "../middlewares/error";
import { checkPointType } from "../types/checkpoint";
import db from "../utils/db";
import dayjs from "dayjs";
import ApiError from "../utils/apiError";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status";
import queries from "../query";

export const deleteCheckpoint = async (cId: number) => {
  await db.checkpoint.delete({
    where: {
      cId,
    },
  });
};

export const findCheckPointByCId = async (cId: number) => {
  const checkpoint = await db.checkpoint.findUnique({
    where: {
      cId,
    },
    include: {
      tour: true,
    },
  });
  assert(checkpoint != null, new ApiError(NOT_FOUND, "Checkpoint not found!"));
  return checkpoint;
};

export const isOnTour = async (tourId: number, aId: number) => {
  const tour = await db.tour.findFirst({
    where: {
      tId: Number(tourId),
    },
    include: {
      participants: true,
      createdBy: true,
    },
  });
  return (
    tour &&
    (tour?.createdBy.aId == aId || tour.participants.find((p) => p.aId == aId))
  );
};

export const loadCheckPoints = async (tourId: number, limit: number) => {
  const tour = await db.tour.findFirst({
    where: {
      tId: Number(tourId),
    },
  });
  if (dayjs(tour?.endDate).isBefore(dayjs())) {
    throw new ApiError(
      BAD_REQUEST,
      "Es können keine Checkpoints von abgelaufenen Touren angezeit werden"
    );
  }
  const checkpoints = await db.checkpoint.findMany({
    where: {
      tourId: Number(tourId),
      time: {
        gte: dayjs().toDate(),
      },
    },
    take: limit,
    orderBy: {
      time: "asc",
    },
    select: queries.cp.checkpointBaseFormat,
  });
  return checkpoints;
};

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
    (!dayjs(tour.startDate).isBefore(checkpoint.time) ||
      !dayjs(tour.endDate).isAfter(checkpoint.time))
  ) {
    throw new ApiError(
      BAD_REQUEST,
      "Der Treffpunkt muss zeitlich innerhalb der Tour liegen"
    );
  }

  const getLocationId = async () => {
    if (checkpoint.location) {
      const {
        country,
        houseNumber,
        latitude,
        longtitude,
        postCode,
        street,
        city,
      } = checkpoint.location;
      return (
        await db.location.create({
          data: {
            city,
            country,
            houseNumber,
            latitude,
            longtitude,
            postCode,
            street,
          },
        })
      ).lId;
    }
    return checkpoint.locationId;
  };

  const lId = await getLocationId();

  assert(
    lId,
    new ApiError(INTERNAL_SERVER_ERROR, "LId turned out as undefined!")
  );

  return await catchPrisma(
    async () =>
      await db.checkpoint.create({
        data: {
          isMeetingPoint: checkpoint.isMeetingPoint ?? true,
          name: checkpoint.name,
          time: dayjs(checkpoint.time!).toDate(),
          tourId: checkpoint.tourId,
          description: checkpoint.description,
          lId: lId!,
        },
        select: queries.cp.checkpointBaseFormat,
      })
  );
};
