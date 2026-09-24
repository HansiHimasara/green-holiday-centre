import { db } from "@/src/prisma/db";

export type BookingPricingServiceType =
  | "AIRPORT_TRANSFER"
  | "DAY_TOUR"
  | "ROUND_TOUR";

type GeocodedLocation = {
  input: string;
  resolved: string;
  coordinates: [number, number];
};

type CalculateBookingPriceInput = {
  serviceType: BookingPricingServiceType;
  pricingId: number;
  pickupLocation?: string;
  dropoffLocation?: string;
  waypoints?: string[];
};

export type CalculatedBookingPrice = {
  serviceType: BookingPricingServiceType;
  pricing: {
    id: number;
    fromLocation: string;
    toLocation: string;
    configuredKilometres: number;
    baseCharge: number;
    extraKilometreCharge: number;
    currency: string;
  };
  route: {
    locations: GeocodedLocation[];
    actualKilometres: number;
    distanceMeters: number;
    durationSeconds: number;
    durationMinutes: number;
    extraKilometres: number;
  };
  totalAmount: number;
  currency: string;
};

function getOpenRouteServiceApiKey() {
  const apiKey =
    process.env.OPENROUTESERVICE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENROUTESERVICE_API_KEY is not configured."
    );
  }

  return apiKey;
}

function roundToTwoDecimals(value: number) {
  return Math.round(value * 100) / 100;
}

function normalizeLocation(value?: string) {
  return value?.trim() ?? "";
}

async function geocodeLocation(
  location: string,
  apiKey: string
): Promise<GeocodedLocation> {
  const searchUrl =
    `https://api.heigit.org/pelias/v1/search?text=${encodeURIComponent(
      location
    )}&size=1&boundary.country=LKA`;

  const response = await fetch(searchUrl, {
    method: "GET",
    headers: {
      Authorization: apiKey,
    },
  });

  const data = (await response.json()) as {
    features?: Array<{
      geometry?: {
        coordinates?: [number, number];
      };
      properties?: {
        label?: string;
        name?: string;
      };
    }>;
    error?: string;
    message?: string;
  };

  if (!response.ok) {
    throw new Error(
      data.error ||
        data.message ||
        "Unable to find location."
    );
  }

  const firstResult =
    data.features?.[0];

  const coordinates =
    firstResult?.geometry?.coordinates;

  if (
    !firstResult ||
    !coordinates ||
    coordinates.length < 2
  ) {
    throw new Error(
      `Unable to find coordinates for ${location}.`
    );
  }

  return {
    input: location,
    resolved:
      firstResult.properties?.label ||
      firstResult.properties?.name ||
      location,
    coordinates,
  };
}

async function calculateRoute(
  locations: string[],
  apiKey: string
) {
  const geocodedLocations =
    await Promise.all(
      locations.map((location) =>
        geocodeLocation(location, apiKey)
      )
    );

  const response = await fetch(
    "https://api.heigit.org/openrouteservice/v2/directions/driving-car",
    {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates: geocodedLocations.map(
          (location) => location.coordinates
        ),
        radiuses: geocodedLocations.map(() => 2000),
        instructions: false,
      }),
    }
  );

  const data = (await response.json()) as {
    routes?: Array<{
      summary?: {
        distance?: number;
        duration?: number;
      };
    }>;
    error?: {
      message?: string;
    };
    message?: string;
  };

  if (!response.ok) {
    throw new Error(
      data.error?.message ||
        data.message ||
        "Unable to calculate route distance."
    );
  }

  const summary =
    data.routes?.[0]?.summary;

  const distanceMeters =
    summary?.distance;

  const durationSeconds =
    summary?.duration ?? 0;

  if (
    distanceMeters === undefined ||
    !Number.isFinite(distanceMeters)
  ) {
    throw new Error(
      "A valid distance could not be calculated."
    );
  }

  return {
    locations: geocodedLocations,
    distanceMeters,
    durationSeconds,
    actualKilometres: roundToTwoDecimals(
      distanceMeters / 1000
    ),
    durationMinutes: Math.round(
      durationSeconds / 60
    ),
  };
}

export async function calculateBookingPrice(
  input: CalculateBookingPriceInput
): Promise<CalculatedBookingPrice> {
  const pricing =
    await db.orm.public.Pricing
      .where({
        id: input.pricingId,
      })
      .first();

  if (!pricing) {
    throw new Error(
      "Selected pricing route was not found."
    );
  }

  if (!pricing.active) {
    throw new Error(
      "Selected pricing route is not active."
    );
  }

  const configuredKilometres =
    Number(pricing.kilometres);

  const baseCharge =
    pricing.baseCharge === null
      ? NaN
      : Number(pricing.baseCharge);

  const extraKilometreCharge =
    Number(pricing.extraKilometreCharge);

  if (
    !Number.isFinite(configuredKilometres) ||
    configuredKilometres <= 0
  ) {
    throw new Error(
      "Configured kilometre value is invalid."
    );
  }

  if (
    !Number.isFinite(baseCharge) ||
    baseCharge < 0
  ) {
    throw new Error(
      "Base charge has not been configured for this route."
    );
  }

  if (
    !Number.isFinite(extraKilometreCharge) ||
    extraKilometreCharge < 0
  ) {
    throw new Error(
      "Extra kilometre charge is invalid."
    );
  }

  const apiKey =
    getOpenRouteServiceApiKey();

  const pickupLocation =
    normalizeLocation(input.pickupLocation) ||
    pricing.fromLocation;

  const dropoffLocation =
    normalizeLocation(input.dropoffLocation) ||
    pricing.toLocation;

  const waypoints =
    input.waypoints
      ?.map((waypoint) => waypoint.trim())
      .filter(Boolean) ?? [];

  const routeLocations = [
    pickupLocation,
    ...waypoints,
    dropoffLocation,
  ];

  if (routeLocations.length < 2) {
    throw new Error(
      "At least pickup and dropoff locations are required."
    );
  }

  const route =
    await calculateRoute(
      routeLocations,
      apiKey
    );

  const extraKilometres =
    Math.max(
      0,
      roundToTwoDecimals(
        route.actualKilometres -
          configuredKilometres
      )
    );

  const totalAmount =
    roundToTwoDecimals(
      baseCharge +
        extraKilometres *
          extraKilometreCharge
    );

  const currency =
    String(pricing.currency ?? "LKR")
      .trim()
      .toUpperCase() || "LKR";

  return {
    serviceType: input.serviceType,
    pricing: {
      id: pricing.id,
      fromLocation: pricing.fromLocation,
      toLocation: pricing.toLocation,
      configuredKilometres,
      baseCharge,
      extraKilometreCharge,
      currency,
    },
    route: {
      locations: route.locations,
      actualKilometres:
        route.actualKilometres,
      distanceMeters:
        route.distanceMeters,
      durationSeconds:
        route.durationSeconds,
      durationMinutes:
        route.durationMinutes,
      extraKilometres,
    },
    totalAmount,
    currency,
  };
}