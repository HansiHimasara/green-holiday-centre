import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Coordinates = [
  number,
  number
];

type GeocodeFeature = {
  geometry?: {
    coordinates?: number[];
  };

  properties?: {
    label?: string;
  };
};

type GeocodeResponse = {
  features?: GeocodeFeature[];
};

type DirectionsResponse = {
  routes?: Array<{
    summary?: {
      distance?: number;
      duration?: number;
    };
  }>;
};

async function geocodeLocation(
  location: string,
  apiKey: string
) {
  const searchParams =
    new URLSearchParams({
      text: location,
      "boundary.country":
        "LK",
      size: "1",
    });

  const response =
    await fetch(
      `https://api.heigit.org/pelias/v1/search?${searchParams.toString()}`,
      {
        method: "GET",

        headers: {
          Authorization:
            apiKey,

          Accept:
            "application/json",
        },

        cache:
          "no-store",
      }
    );

  if (!response.ok) {
    const errorText =
      await response.text();

    console.error(
      "OPENROUTESERVICE GEOCODE ERROR:",
      response.status,
      errorText
    );

    throw new Error(
      "Unable to find the location."
    );
  }

  const data =
    (await response.json()) as GeocodeResponse;

  const feature =
    data.features?.[0];

  const coordinates =
    feature?.geometry
      ?.coordinates;

  if (
    !coordinates ||
    coordinates.length < 2
  ) {
    throw new Error(
      `Location not found: ${location}`
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
    throw new Error(
      `Invalid coordinates for: ${location}`
    );
  }

  return {
    coordinates: [
      longitude,
      latitude,
    ] as Coordinates,

    label:
      feature?.properties
        ?.label ??
      location,
  };
}

export async function POST(
  request: Request
) {
  try {
    const apiKey =
      process.env[
        "OPENROUTESERVICE_API_KEY"
      ];

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OpenRouteService API key is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const body =
      await request.json();

    const origin =
      String(
        body.origin ?? ""
      ).trim();

    const destination =
      String(
        body.destination ??
          ""
      ).trim();

    if (
      !origin ||
      !destination
    ) {
      return NextResponse.json(
        {
          error:
            "Origin and destination are required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
      Convert place names
      into coordinates.
    */

    const [
      originResult,
      destinationResult,
    ] =
      await Promise.all([
        geocodeLocation(
          origin,
          apiKey
        ),

        geocodeLocation(
          destination,
          apiKey
        ),
      ]);

    /*
      Calculate driving route.

      OpenRouteService coordinate format:
      [longitude, latitude]

      radiuses:
      Allow ORS to search for a nearby
      routable road within 2 km.

      This is useful for airports,
      hotels and large properties where
      the geocoded centre point may be
      away from the actual road.
    */

    const routeResponse =
      await fetch(
        "https://api.heigit.org/openrouteservice/v2/directions/driving-car",
        {
          method:
            "POST",

          headers: {
            Authorization:
              apiKey,

            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body:
            JSON.stringify({
              coordinates: [
                originResult.coordinates,
                destinationResult.coordinates,
              ],

              radiuses: [
                2000,
                2000,
              ],

              instructions:
                false,
            }),

          cache:
            "no-store",
        }
      );

    if (
      !routeResponse.ok
    ) {
      const errorText =
        await routeResponse.text();

      console.error(
        "OPENROUTESERVICE DIRECTIONS ERROR:",
        routeResponse.status,
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Unable to calculate the driving route.",
        },
        {
          status: 502,
        }
      );
    }

    const routeData =
      (await routeResponse.json()) as DirectionsResponse;

    const summary =
      routeData.routes?.[0]
        ?.summary;

    const distanceMeters =
      Number(
        summary?.distance
      );

    const durationSeconds =
      Number(
        summary?.duration
      );

    if (
      !Number.isFinite(
        distanceMeters
      ) ||
      distanceMeters <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "A valid driving distance could not be calculated.",
        },
        {
          status: 502,
        }
      );
    }

    const distanceKilometres =
      Math.round(
        (
          distanceMeters /
          1000
        ) *
          100
      ) / 100;

    const durationMinutes =
      Number.isFinite(
        durationSeconds
      )
        ? Math.round(
            durationSeconds /
              60
          )
        : null;

    return NextResponse.json({
      origin: {
        input:
          origin,

        resolved:
          originResult.label,

        coordinates:
          originResult.coordinates,
      },

      destination: {
        input:
          destination,

        resolved:
          destinationResult.label,

        coordinates:
          destinationResult.coordinates,
      },

      distanceMeters,

      distanceKilometres,

      durationSeconds:
        Number.isFinite(
          durationSeconds
        )
          ? durationSeconds
          : null,

      durationMinutes,
    });
  } catch (error) {
    console.error(
      "ROUTE DISTANCE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof
          Error
            ? error.message
            : "Unable to calculate route distance.",
      },
      {
        status: 500,
      }
    );
  }
}