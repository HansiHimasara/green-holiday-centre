import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";
import { getCurrentUser } from "@/src/server/auth/session";

export const runtime = "nodejs";

async function requireAdminUser() {
  const user =
    await getCurrentUser();

  if (
    !user ||
    (
      user.role !== "ADMIN" &&
      user.role !== "SUPER_ADMIN"
    )
  ) {
    return null;
  }

  return user;
}

function optionalText(
  value: unknown
) {
  const text =
    String(value ?? "").trim();

  return text || null;
}

export async function GET() {
  try {
    const user =
      await requireAdminUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const vehicles =
      await db.orm.public.VehicleType.all();

    const vehicleList =
      vehicles
        .map((vehicle) => ({
          dbId:
            vehicle.id,

          id:
            `VH-${String(
              vehicle.id
            ).padStart(3, "0")}`,

          model:
            vehicle.name,

          passengers:
            vehicle.passengerCapacity,

          luggage:
            vehicle.luggageCapacity,

          transmission:
            vehicle.transmission ??
            "",

          fuelType:
            vehicle.fuelType ??
            "",

          description:
            vehicle.description ??
            "",

          status:
            vehicle.status
              .toLowerCase(),

          rate:
            "",
        }))
        .sort(
          (a, b) =>
            a.dbId - b.dbId
        );

    return NextResponse.json({
      vehicles:
        vehicleList,
    });
  } catch (error) {
    console.error(
      "ADMIN VEHICLES GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load vehicles.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const user =
      await requireAdminUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const name =
      String(
        body.model ?? ""
      ).trim();

    const passengerCapacity =
      Number(
        body.passengers
      );

    const luggageCapacity =
      Number(
        body.luggage
      );

    const transmission =
      optionalText(
        body.transmission
      );

    const fuelType =
      optionalText(
        body.fuelType
      );

    const description =
      optionalText(
        body.description
      );

    const status =
      String(
        body.status ?? "active"
      ).toUpperCase();

    if (!name) {
      return NextResponse.json(
        {
          error:
            "Vehicle name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isInteger(
        passengerCapacity
      ) ||
      passengerCapacity < 1
    ) {
      return NextResponse.json(
        {
          error:
            "Passenger capacity must be at least 1.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isInteger(
        luggageCapacity
      ) ||
      luggageCapacity < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Luggage capacity cannot be negative.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      status !== "ACTIVE" &&
      status !== "INACTIVE"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid vehicle status.",
        },
        {
          status: 400,
        }
      );
    }

    const existingVehicle =
      await db.orm.public.VehicleType
        .where({
          name,
        })
        .first();

    if (existingVehicle) {
      return NextResponse.json(
        {
          error:
            "A vehicle with this name already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const vehicle =
      await db.orm.public.VehicleType.create(
        {
          name,
          description,
          passengerCapacity,
          luggageCapacity,
          transmission,
          fuelType,

          airConditioning:
            true,

          chauffeurIncluded:
            true,

          chauffeurLanguage:
            null,

          imageUrl:
            null,

          status,
        }
      );

    if (!vehicle) {
      return NextResponse.json(
        {
          error:
            "Unable to create vehicle.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        message:
          "Vehicle created successfully.",

        vehicle: {
          dbId:
            vehicle.id,

          id:
            `VH-${String(
              vehicle.id
            ).padStart(3, "0")}`,

          model:
            vehicle.name,

          passengers:
            vehicle.passengerCapacity,

          luggage:
            vehicle.luggageCapacity,

          transmission:
            vehicle.transmission ??
            "",

          fuelType:
            vehicle.fuelType ??
            "",

          description:
            vehicle.description ??
            "",

          rate:
            "",

          status:
            vehicle.status
              .toLowerCase(),
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "ADMIN VEHICLE CREATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create vehicle.",
      },
      {
        status: 500,
      }
    );
  }
}