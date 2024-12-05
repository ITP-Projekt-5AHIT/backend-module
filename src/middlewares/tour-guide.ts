import { Account } from "@prisma/client";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";
import { UNAUTHORIZED } from "http-status";
import services from "../services";

const isTourGuide = catchAsync(async (req, res, next) => {
  const user = req.user as Account;
  if (!user)
    next(
      new ApiError(
        UNAUTHORIZED,
        "Bitte melde dich an",
        "Die middleware is tour guide wurde eingesetzt und kann nur" +
          " funktionieren, wenn der User angemeldet ist -> wird benötigt, um beispielsweise herauszufinden, ob der User ein Teilnehmer" +
          " oder Tourguide ist!"
      )
    );
  const tourGuideTours = await services.tour.getToursOfTourGuide(user.aId);
  res.locals.tours = tourGuideTours;
  next();
});

export default isTourGuide;