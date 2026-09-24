import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";

export const runtime = "nodejs";

type VehicleRecord = {
  id: number;
  name: string;
  passengerCapacity: number;
  luggageCapacity: number;
  imageUrl: string | null;
  status: string;
};

export async function GET() {
  try {
    const vehicles =
      (await db.orm.public.VehicleType
        .where({
          status: "ACTIVE",
        })
        .all()) as VehicleRecord[];

    const vehicleList = vehicles
      .map((vehicle) => ({
        id: vehicle.id,
        name: vehicle.name,
        passengerCapacity: vehicle.passengerCapacity,
        luggageCapacity: vehicle.luggageCapacity,
        imageUrl: vehicle.imageUrl,
        status: vehicle.status,
      }))
      .sort((a, b) => a.id - b.id);

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
        error: "Unable to load vehicles.",
      },
      {
        status: 500,
      }
    );
  }
}