import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const vehicles =
      await db.orm.public.VehicleType
        .where({
          status: "ACTIVE",
        })
        .all();

    const vehicleList = vehicles
      .map((vehicle) => ({
        id: vehicle.id,
        name: vehicle.name,
        description:
          vehicle.description,
        passengerCapacity:
          vehicle.passengerCapacity,
        luggageCapacity:
          vehicle.luggageCapacity,
        transmission:
          vehicle.transmission,
        fuelType:
          vehicle.fuelType,
        airConditioning:
          vehicle.airConditioning,
        chauffeurIncluded:
          vehicle.chauffeurIncluded,
        chauffeurLanguage:
          vehicle.chauffeurLanguage,
        imageUrl:
          vehicle.imageUrl,
        status:
          vehicle.status,
      }))
      .sort(
        (a, b) =>
          a.id - b.id
      );

    return NextResponse.json({
      vehicles: vehicleList,
    });
  } catch (error) {
    console.error(
      "GET VEHICLES ERROR:",
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