import dayjs from "dayjs";
import { tourDetails, tourType } from "../../types/tour";
import db, { generateAccessCode } from "../../utils/db";
import { catchPrisma } from "../../middlewares/error";
import assert from "assert";
import ApiError from "../../utils/apiError";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status";
import { Tour } from "@prisma/client";

export const hasStartingTours = async (aId: number): Promise<boolean> => {
  return (
    (await db.tour.findMany({
      where: {
        endDate: {
          gt: dayjs().toDate(),
        },
      },
    })) != null
  );
};

export const loadTourById = async (tId: number) => {
  assert(
    tId,
    new ApiError(
      BAD_REQUEST,
      "Tour-id muss als Parameter mitgegeben werden",
      "Bitte gib bei der URL /tId hinten mit!"
    )
  );
  const tour = await db.tour.findFirst({
    where: { tId: Number(tId) },
    include: { participants: true },
  });
  assert(tour != null, new ApiError(NOT_FOUND, "Tour konnte nicht gefunden"));
  return tour;
};

export const getToursOfTourGuide = async (aId: number) => {
  return await db.tour.findMany({
    where: {
      createdBy: {
        aId,
      },
    },
    select: {
      tId: true,
      accessCode: true,
      name: true,
      startDate: true,
      endDate: true,
    },
  });
};

export const pickTourData = async (tour: Tour, isTourGuide: boolean) => {
  const nullableValues = {
    accessCode: null,
    participants: null,
  };
  const participants = await db.account.findMany({
    where: {
      joined: {
        some: {
          tId: tour.tId,
        },
      },
    },
    select: {
      firstName: true,
      lastName: true,
    },
  });
  const tourGuide = await db.account.findFirst({
    where: {
      created: {
        every: {
          tId: tour.tId,
        },
      },
    },
  });

  const participantCount = participants?.length ?? 0;
  let loadedTour: tourDetails = {
    ...tour,
    participantCount,
    tourGuide: `${tourGuide?.lastName} ${tourGuide?.firstName}`,
    participants: participants as tourDetails["participants"],
  };
  if (!isTourGuide) loadedTour = { ...loadedTour, ...nullableValues };
  return loadedTour;
};

export const createTour = async (tour: tourType, aId: number) => {
  const tourCode = await generateAccessCode();
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
      }),
    new ApiError(
      INTERNAL_SERVER_ERROR,
      "Bitte probiere es erneut",
      "Beim generien des Codes ist ein Fehler aufgetreten, da der Code bereits" +
        " bei einer anderen Tour verwendet wird"
    )
  );
};

export const deleteTour = async (
  tourId: number,
  aId: number
): Promise<boolean> => {
  const foundTour = await catchPrisma(
    async () =>
      await db.tour.delete({
        where: {
          tId: Number(tourId),
          createdBy: {
            aId,
          },
        },
      })
  );
  return foundTour != null;
};

export const subscribeTour = async (accessCode: string, aId: number) => {
  const foundTour = await catchPrisma(
    async () =>
      await db.tour.findFirst({
        where: { accessCode },
        include: {
          participants: true,
        },
      })
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
    !foundTour.participants.some((p) => p.aId == aId),
    new ApiError(BAD_REQUEST, "Du bisd bereits bei der Tour")
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
          joined: {
            connect: {
              tId: foundTour.tId,
            },
          },
        },
      })
  );
  assert(
    account,
    new ApiError(INTERNAL_SERVER_ERROR, "Bitte probiere es erneut")
  );
  return foundTour;
};
