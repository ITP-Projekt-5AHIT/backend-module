import assert from "assert";
import db from "../utils/db";
import ApiError from "../utils/apiError";
import { CONFLICT, NOT_FOUND } from "http-status";

export const findAlbumById = async (alId: number) => {
  const album = await db.album.findUnique({
    where: {
      alId,
    },
  });
  assert(album != null, new ApiError(NOT_FOUND, "Album wurde nicht gefunden"));
  return album;
};

export const addImage = async (alId: number, fileName: string) => {
  const album = await db.album.update({
    where: {
      alId,
    },
    data: {
      photos: {
        push: fileName,
      },
    },
  });
  return album;
};

export const createTourAlbum = async (tId: number) => {
  const tour = await db.tour.findFirst({
    where: {
      tId,
    },
    include: {
      album: true,
    },
  });
  assert(tour != null, new ApiError(NOT_FOUND, "Tour wurde nicht gefunden"));
  assert(
    tour.album == null,
    new ApiError(CONFLICT, "Tour besitzt bereits ein Album")
  );
  await db.album.create({
    data: {
      tour: {
        connect: {
          tId,
        },
      },
    },
  });
};
