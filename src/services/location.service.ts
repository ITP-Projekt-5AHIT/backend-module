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
import { Place } from "../types/location";
const client = new Client({});

export const getNearbyAttractions = async (
  lat: number,
  lng: number
): Promise<Place[]> => {
  const response = await client.placesNearby({
    params: {
      location: { lat, lng },
      radius: 5000,
      type: "tourist_attraction",
      key: config.MAPS_API,
    },
  });

  return response.data.results.slice(0, 20).map((place) => ({
    name: place.name,
    address: place.vicinity,
    rating: place.rating,
    types: place.types,
    userRatingsTotal: place.user_ratings_total,
    openingHours: place.opening_hours?.open_now,
    latitude: place?.geometry?.location.lat,
    longitude: place?.geometry?.location.lng,
    image: place.photos?.[0]
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${config.MAPS_API}`
      : null,
  })) as Place[];
};

export const getCoordinates = async ({
  postCode,
  country,
  city,
  houseNumber,
  street,
}: {
  postCode: number;
  country: string;
  city: string;
  houseNumber: string;
  street: string;
}) => {
  const address = `${street} ${houseNumber}, ${postCode}, ${country}`;
  const response = await client.geocode({
    params: {
      address,
      key: config.MAPS_API,
    },
  });

  assert(
    response.data?.results?.length > 0,
    new ApiError(NOT_FOUND, "Keine passende Adresse gefunden")
  );

  const location = response.data.results[0].geometry.location;
  return {
    latitude: location.lat,
    longitude: location.lng,
  };
};

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
