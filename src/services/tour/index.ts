import dayjs from "dayjs";
import { tourType } from "../../types/tour";
import db from "../../utils/db";

export const createTour = async (tour: tourType, aId: number) => {
  return await db.tour.create({
    data: {
      tourGuide: aId,
      startDate: dayjs(tour.startDate).toDate(),
      endDate: dayjs(tour.endDate).toDate(),
      description: tour.description,
      name: tour.name,
    },
  });
};
