import { NOT_FOUND } from "http-status";
import ApiError from "../utils/apiError";
import db from "../utils/db";
import assert from "assert";
import {
  Client,
  Distance,
  Duration,
  TravelMode,
} from "@googlemaps/google-maps-services-js";
import { Location } from "@prisma/client";
import config from "../config/config";
const client = new Client({});

export const findLocationByLId = async (lId: number) => {
  const location = await db.location.findFirst({
    where: {
      lId: Number(lId),
    },
  });
  assert(location != null, new ApiError(NOT_FOUND, "Location not found"));
  return location;
};

export const getDistance = async (
  location: Location,
  longtitude: number,
  latitude: number
) => {
  const { latitude: originLat, longtitude: originLong } = location;
  const modes: TravelMode[] = [TravelMode.walking, TravelMode.driving];
  const responses: {
    distance: Distance;
    duration: Duration;
    mode: TravelMode;
  }[] = [];

  for (const mode of modes) {
    const response = await client.directions({
      params: {
        origin: `${originLat},${originLong}`,
        destination: `${latitude},${longtitude}`,
        mode: mode,
        key: config.MAPS_API,
      },
    });

    const route = response.data.routes?.at(0);
    assert(route != null, new ApiError(NOT_FOUND, "No route found"));

    const leg = route.legs?.at(0);
    assert(leg != null, new ApiError(NOT_FOUND, "No leg for route found"));

    const { duration, distance } = leg;
    responses.push({ duration, distance, mode });
  }

  return responses;
};
