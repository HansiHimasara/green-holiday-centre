import { validAirportTransfer } from "../shared/airports";
import { calculateFare } from "./pricingFormula";
import { getLkrPerUsd } from "./exchangeRate";
export class BookingPricingError extends Error {}

export type BookingPricingServiceType =
  | "AIRPORT_TRANSFER"
  | "DAY_TOUR"
  | "ROUND_TOUR";

type Coordinate = [
  number,
  number,
];

type PhotonFeature = {
  geometry?: {
    coordinates?: [
      number,
      number,
    ];
  };
};

type PhotonResponse = {
  features?: PhotonFeature[];
};

type OpenRouteServiceResponse = {
  features?: Array<{
    properties?: {
      summary?: {
        distance?: number;
        duration?: number;
      };
    };
  }>;
};

export type BookingPriceResult = {
  totalAmount: number;

  currency: string;

  vehicleRatePerKm: number;

  route: {
    actualKilometres: number;

    billableKilometres: number;

    durationMinutes: number;
  };
};

/* =========================================================
   FETCH WITH TIMEOUT
========================================================= */

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 15000
) {
  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () => {
        controller.abort();
      },
      timeoutMs
    );

  try {
    return await fetch(
      url,
      {
        ...options,

        signal:
          controller.signal,
      }
    );
  } finally {
    clearTimeout(
      timeout
    );
  }
}

/* =========================================================
   GEOCODE LOCATION
========================================================= */

async function geocodeWithPhoton(
  location: string
): Promise<Coordinate> {
  const cleanLocation =
    location.trim();

  if (!cleanLocation) {
    throw new BookingPricingError(
      "A route location is missing."
    );
  }

  const params =
    new URLSearchParams({
      q: cleanLocation,

      limit: "1",

      lang: "en",

      countrycode: "LK",

      lat: "7.8731",

      lon: "80.7718",
    });

  let response: Response;

  try {
    response =
      await fetchWithTimeout(
        `https://photon.komoot.io/api/?${params.toString()}`,
        {
          method: "GET",

          cache:
            "no-store",
        },
        8000
      );
  } catch (error) {
    console.error(
      "Photon request error:",
      error
    );

    throw new BookingPricingError(
      `Unable to find coordinates for ${cleanLocation}.`
    );
  }

  if (!response.ok) {
    console.error(
      "Photon status:",
      response.status
    );

    throw new BookingPricingError(
      `Unable to locate "${cleanLocation}".`
    );
  }

  const data =
    (await response.json()) as PhotonResponse;

  const coordinates =
    data.features?.[0]
      ?.geometry
      ?.coordinates;

  if (
    !coordinates ||
    coordinates.length < 2
  ) {
    throw new BookingPricingError(
      `Location not found: ${cleanLocation}`
    );
  }

  const longitude =
    Number(
      coordinates[0]
    );

  const latitude =
    Number(
      coordinates[1]
    );

  if (
    !Number.isFinite(
      longitude
    ) ||
    !Number.isFinite(
      latitude
    )
  ) {
    throw new BookingPricingError(
      `Invalid coordinates for ${cleanLocation}.`
    );
  }

  return [
    longitude,
    latitude,
  ];
}

// Keep quoting available when the public Photon service is unreachable.
// Both quote and booking creation use this same server-side lookup.
async function geocodeLocation(location: string): Promise<Coordinate> {
  const cleanLocation = location.trim();
  if (!cleanLocation) throw new BookingPricingError("A route location is missing.");
  try {
    return await geocodeWithPhoton(cleanLocation);
  } catch {
    const key = process.env.OPENROUTESERVICE_API_KEY?.trim();
    if (key) {
      const params = new URLSearchParams({
        text: cleanLocation,
        "boundary.country": "LKA",
        size: "1",
      });
      try {
        const response = await fetchWithTimeout(
          `https://api.openrouteservice.org/geocode/search?${params}`,
          { headers: { Authorization: key }, cache: "no-store" },
          8000,
        );
        if (response.ok) {
          const data = await response.json() as PhotonResponse;
          const point = data.features?.[0]?.geometry?.coordinates;
          if (point && point.length === 2 &&
              point.every(value => typeof value === "number" && Number.isFinite(value)) &&
              point[0] >= 79.5 && point[0] <= 82 && point[1] >= 5.8 && point[1] <= 10) {
            return point;
          }
        }
        console.warn("Backup geocoder could not resolve location; HTTP status:", response.status);
      } catch {
        // Do not log requests or credentials from the authenticated provider.
        console.warn("Backup geocoder request failed.");
      }
    }
    throw new BookingPricingError(
      `Unable to locate "${cleanLocation}". Please retry or select a more specific Sri Lankan pickup/drop-off location.`,
    );
  }
}

/* =========================================================
   ROAD ROUTE
========================================================= */

async function calculateRoadRoute(
  locations: string[]
) {
  const apiKey =
    process.env
      .OPENROUTESERVICE_API_KEY?.trim();

  if (!apiKey) {
    throw new BookingPricingError(
      "OPENROUTESERVICE_API_KEY is missing from .env."
    );
  }

  const cleanLocations =
    locations
      .map(
        (location) =>
          location.trim()
      )
      .filter(Boolean);

  if (
    cleanLocations.length <
    2
  ) {
    throw new BookingPricingError(
      "At least two locations are required."
    );
  }

  const coordinates =
    await Promise.all(
      cleanLocations.map(
        (location) =>
          geocodeLocation(
            location
          )
      )
    );

  let response: Response;

  try {
    response =
      await fetchWithTimeout(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          method:
            "POST",

          headers: {
            Authorization:
              apiKey,

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              coordinates,

              // Places such as an airport can be mapped to the centre
              // of the site rather than its road entrance.
              radiuses:
                coordinates.map(
                  () => 1500
                ),
            }),

          cache:
            "no-store",
        },
        20000
      );
  } catch (error) {
    console.error(
      "OpenRouteService request error:",
      error
    );

    throw new BookingPricingError(
      "The route service took too long to respond. Please try again."
    );
  }

  if (!response.ok) {
    const errorText =
      await response.text();

    console.error(
      "OpenRouteService error:",
      response.status,
      errorText
    );

    if (response.status === 404) {
      try {
        const serviceError = JSON.parse(errorText) as {
          error?: { code?: number; message?: string };
        };

        if (serviceError.error?.code === 2010) {
          const coordinateIndex = Number(
            serviceError.error.message?.match(
              /coordinate\s+(\d+)/i
            )?.[1]
          );
          const location = Number.isInteger(coordinateIndex)
            ? cleanLocations[coordinateIndex]
            : undefined;

          throw new BookingPricingError(
            location
              ? `No drivable road was found near "${location}". Please select a nearby road entrance or pickup point.`
              : "No drivable road was found near one of the selected locations. Please select a nearby road entrance or pickup point."
          );
        }
      } catch (error) {
        if (error instanceof Error &&
            error.message.startsWith("No drivable road")) {
          throw error;
        }
      }
    }

    throw new BookingPricingError(
      "Unable to calculate the road distance for this route."
    );
  }

  const data =
    (await response.json()) as OpenRouteServiceResponse;

  const summary =
    data.features?.[0]
      ?.properties
      ?.summary;

  const distanceMetres =
    Number(
      summary?.distance
    );

  const durationSeconds =
    Number(
      summary?.duration
    );

  if (
    !Number.isFinite(
      distanceMetres
    ) ||
    distanceMetres <= 0
  ) {
    throw new BookingPricingError(
      "A valid road distance could not be calculated."
    );
  }

  const actualKilometres =
    distanceMetres /
    1000;

  const durationMinutes =
    Number.isFinite(
      durationSeconds
    )
      ? Math.ceil(
          durationSeconds /
            60
        )
      : 0;

  return {
    actualKilometres,

    durationMinutes,
  };
}

/* =========================================================
   PRICE CALCULATION
========================================================= */

export async function calculateBookingPrice({
  serviceType,
  pickupLocation,
  dropoffLocation,
  waypoints = [],
  vehicleRatePerKm,
  driverBattaPerDayLkr,
  numberOfDays = 1,
}: {
  serviceType:
    BookingPricingServiceType;

  pickupLocation:
    string;

  dropoffLocation:
    string;

  waypoints?:
    string[];

  vehicleRatePerKm:
    number;

  driverBattaPerDayLkr: number;
  numberOfDays?: number;
}): Promise<BookingPriceResult> {
  if (serviceType === "AIRPORT_TRANSFER" && !validAirportTransfer(pickupLocation, dropoffLocation)) throw new BookingPricingError("Select a Sri Lankan airport as your pickup or drop location, with a different other endpoint.");
  if (
    !pickupLocation.trim()
  ) {
    throw new BookingPricingError(
      "Pickup location is required."
    );
  }

  if (
    !dropoffLocation.trim()
  ) {
    throw new BookingPricingError(
      "Drop location is required."
    );
  }

  if (
    !Number.isFinite(
      vehicleRatePerKm
    ) ||
    vehicleRatePerKm <= 0
  ) {
    throw new BookingPricingError(
      "The selected vehicle does not have a valid rate per kilometre."
    );
  }

  const cleanWaypoints =
    waypoints
      .map(
        (location) =>
          location.trim()
      )
      .filter(Boolean);

  let routeLocations:
    string[];

  if (
    serviceType ===
    "AIRPORT_TRANSFER"
  ) {
    routeLocations = [
      pickupLocation,
      dropoffLocation,
    ];
  } else if (
    serviceType ===
    "DAY_TOUR"
  ) {
    if (
      cleanWaypoints.length <
      1
    ) {
      throw new BookingPricingError(
        "Day Tour destination is required."
      );
    }

    routeLocations = [
      pickupLocation,
      ...cleanWaypoints,
      dropoffLocation,
    ];
  } else {
    if (
      cleanWaypoints.length <
      1
    ) {
      throw new BookingPricingError(
        "At least one Round Tour destination is required."
      );
    }

    routeLocations = [
      pickupLocation,
      ...cleanWaypoints,
      dropoffLocation,
    ];
  }

  // Resolve USD->LKR on the server. Both quotes and saved bookings use this path.
  let lkrPerUsd: number;
  try {
    lkrPerUsd = await getLkrPerUsd();
  } catch {
    throw new BookingPricingError("The exchange rate is temporarily unavailable. Please try again later.");
  }

  if (!Number.isSafeInteger(driverBattaPerDayLkr) || driverBattaPerDayLkr <= 0) {
    throw new BookingPricingError("Driver batta is not configured for this vehicle. Please contact the travel office.");
  }

  const route = await calculateRoadRoute(routeLocations);
  let price: ReturnType<typeof calculateFare>;
  try {
    price = calculateFare({
      serviceType,
      actualKilometres: route.actualKilometres,
      numberOfDays,
      vehicleRatePerKm,
      driverBattaPerDayLkr,
      lkrPerUsd,
    });
  } catch (error) {
    throw new BookingPricingError(error instanceof Error ? error.message : "Unable to calculate tour price.");
  }
  const { billableKilometres, totalAmount } = price;
  return {
    totalAmount,

    currency:
      "USD",

    vehicleRatePerKm,

    route: {
      actualKilometres:
        Number(
          route.actualKilometres.toFixed(
            2
          )
        ),

      billableKilometres:
        Number(
          billableKilometres.toFixed(
            2
          )
        ),

      durationMinutes:
        route.durationMinutes,
    },
  };
}
