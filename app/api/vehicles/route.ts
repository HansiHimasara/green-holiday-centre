import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";

export const runtime = "nodejs";

<<<<<<< HEAD
export async function GET() {
  try {
    const vehicles =
      await db.orm.public.VehicleType
        .where({
          status: "ACTIVE",
        })
        .all();
=======
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
>>>>>>> origin/dev

    const vehicleList = vehicles
      .map((vehicle) => ({
        id: vehicle.id,
        name: vehicle.name,
<<<<<<< HEAD
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
=======
        passengerCapacity: vehicle.passengerCapacity,
        luggageCapacity: vehicle.luggageCapacity,
        imageUrl: vehicle.imageUrl,
        status: vehicle.status,
      }))
      .sort((a, b) => a.id - b.id);
>>>>>>> origin/dev

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
<<<<<<< HEAD
        error:
          "Unable to load vehicles.",
=======
        error: "Unable to load vehicles.",
>>>>>>> origin/dev
      },
      {
        status: 500,
      }
    );
  }
}