import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { getAlbumType, postImageType } from "../types/album";
import services from "../services";
import assert from "assert";
import { Account } from "@prisma/client";
import ApiError from "../utils/apiError";
import { OK, UNAUTHORIZED } from "http-status";

export const getAlbum = catchAsync(
  async (req: Request<getAlbumType>, res: Response, next: NextFunction) => {
    const { alId } = req.params;
    const { aId } = req.user as Account;

    const album = await services.album.findAlbumById(Number(alId));
    const tour = await services.tour.loadTourById(album.tId);

    const isMember =
      tour.tourGuide == aId || tour.participants.some((p) => p.aId == aId);
    assert(
      isMember,
      new ApiError(
        UNAUTHORIZED,
        "Only members of this tour are allowed to upload images"
      )
    );

    return res.status(OK).json(album);
  }
);

export const postAddImage = catchAsync(
  async (
    req: Request<object, object, postImageType>,
    res: Response,
    next: NextFunction
  ) => {
    const { aId } = req.user as Account;
    const { fileName, tId } = req.body;
    const tour = await services.tour.loadTourById(tId);

    const isMember =
      tour.tourGuide == aId || tour.participants.some((p) => p.aId == aId);
    assert(
      isMember,
      new ApiError(
        UNAUTHORIZED,
        "Only members of this tour are allowed to upload images"
      )
    );

    const isAlbumPresent = tour.album?.alId != null;
    if (!isAlbumPresent) await services.album.createTourAlbum(tId);

    const albId = tour.album?.alId!;

    await services.album.findAlbumById(albId);
    const updated = await services.album.addImage(albId, fileName);

    return res.status(OK).json(updated);
  }
);
