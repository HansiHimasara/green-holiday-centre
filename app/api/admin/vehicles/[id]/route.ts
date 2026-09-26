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

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
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

    const params =
      await context.params;

    const vehicleId =
      Number(params.id);

    if (
      !Number.isInteger(
        vehicleId
      ) ||
      vehicleId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid vehicle ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existingVehicle =
      await db.orm.public.VehicleType
        .where({
          id: vehicleId,
        })
        .first();

    if (!existingVehicle) {
      return NextResponse.json(
        {
          error:
            "Vehicle not found.",
        },
        {
          status: 404,
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

    const status =
      String(
        body.status ?? ""
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

    const allVehicles =
      await db.orm.public.VehicleType.all();

    const duplicateName =
      allVehicles.find(
        (vehicle) =>
          vehicle.id !==
            vehicleId &&
          vehicle.name
            .toLowerCase() ===
            name.toLowerCase()
      );

    if (duplicateName) {
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

    const updatedVehicle =
      await db.orm.public.VehicleType
        .where({
          id: vehicleId,
        })
        .update({
          name,

          passengerCapacity,

          luggageCapacity,

          transmission:
            optionalText(
              body.transmission
            ),

          fuelType:
            optionalText(
              body.fuelType
            ),

          description:
            optionalText(
              body.description
            ),

          status,
        });

    if (!updatedVehicle) {
      return NextResponse.json(
        {
          error:
            "Unable to update vehicle.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      message:
        "Vehicle updated successfully.",

      vehicle: {
        dbId:
          updatedVehicle.id,

        id:
          `VH-${String(
            updatedVehicle.id
          ).padStart(3, "0")}`,

        model:
          updatedVehicle.name,

        passengers:
          updatedVehicle
            .passengerCapacity,

        luggage:
          updatedVehicle
            .luggageCapacity,

        transmission:
          updatedVehicle
            .transmission ??
          "",

        fuelType:
          updatedVehicle
            .fuelType ??
          "",

        description:
          updatedVehicle
            .description ??
          "",

        rate:
          "",

        status:
          updatedVehicle.status
            .toLowerCase(),
      },
    });
  } catch (error) {
    console.error(
      "ADMIN VEHICLE UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to update vehicle.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
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

    const params =
      await context.params;

    const vehicleId =
      Number(params.id);

    if (
      !Number.isInteger(
        vehicleId
      ) ||
      vehicleId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid vehicle ID.",
        },
        {
          status: 400,
        }
      );
    }

    const vehicle =
      await db.orm.public.VehicleType
        .where({
          id: vehicleId,
        })
        .first();

    if (!vehicle) {
      return NextResponse.json(
        {
          error:
            "Vehicle not found.",
        },
        {
          status: 404,
        }
      );
    }

    const bookings =
      await db.orm.public.Booking
        .where({
          vehicleTypeId:
            vehicleId,
        })
        .all();

    if (
      bookings.length > 0
    ) {
      return NextResponse.json(
        {
          error:
            "This vehicle has booking records. Set it to Inactive instead of deleting it.",
        },
        {
          status: 409,
        }
      );
    }

    const deletedCount =
      await db.orm.public.VehicleType
        .where({
          id: vehicleId,
        })
        .deleteAndCount();

    if (
      deletedCount === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Unable to delete vehicle.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      message:
        "Vehicle deleted successfully.",
    });
  } catch (error) {
    console.error(
      "ADMIN VEHICLE DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to delete vehicle.",
      },
      {
        status: 500,
      }
    );
  }
}