import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";

export const runtime = "nodejs";

<<<<<<< HEAD
export async function GET() {
  try {
    const pricingRecords =
      await db.orm.public.Pricing
        .where({
          active: true,
        })
        .all();

    const routes =
      pricingRecords
        .map((item) => {
          const distance =
            Number(item.kilometres);

          const baseCharge =
            item.baseCharge === null
              ? null
              : Number(item.baseCharge);

          const extraKilometreCharge =
            Number(
              item.extraKilometreCharge
            );

          const currency =
            String(
              item.currency ?? "LKR"
            )
              .trim()
              .toUpperCase() || "LKR";

          return {
            id:
              item.id,

            fromLocation:
              item.fromLocation,

            toLocation:
              item.toLocation,

            distance,

            baseCharge,

            extraKilometreCharge,

            currency,
          };
        })
        .filter((item) => {
          return (
            Number.isFinite(
              item.distance
            ) &&
            item.distance > 0 &&
            item.baseCharge !== null &&
            Number.isFinite(
              item.baseCharge
            ) &&
            item.baseCharge >= 0 &&
            Number.isFinite(
              item.extraKilometreCharge
            ) &&
            item.extraKilometreCharge >= 0
          );
        });
=======
type PricingRecord = {
  id: string;
  fromLocation: string;
  toLocation: string;
  kilometres: number | string;
  baseCharge: number | string | null;
  extraKilometreCharge: number | string;
  currency: string | null;
  active: boolean;
};

export async function GET() {
  try {
    const pricingRecords =
      (await db.orm.public.Pricing
        .where({
          active: true,
        })
        .all()) as PricingRecord[];

    const routes = pricingRecords
      .map((item) => {
        const distance = Number(item.kilometres);

        const baseCharge =
          item.baseCharge === null
            ? null
            : Number(item.baseCharge);

        const extraKilometreCharge = Number(
          item.extraKilometreCharge
        );

        const currency =
          String(item.currency ?? "LKR")
            .trim()
            .toUpperCase() || "LKR";

        return {
          id: item.id,
          fromLocation: item.fromLocation,
          toLocation: item.toLocation,
          distance,
          baseCharge,
          extraKilometreCharge,
          currency,
        };
      })
      .filter((item) => {
        return (
          Number.isFinite(item.distance) &&
          item.distance > 0 &&
          item.baseCharge !== null &&
          Number.isFinite(item.baseCharge) &&
          item.baseCharge >= 0 &&
          Number.isFinite(item.extraKilometreCharge) &&
          item.extraKilometreCharge >= 0
        );
      });
>>>>>>> origin/dev

    return NextResponse.json({
      routes,
    });
  } catch (error) {
    console.error(
      "LOAD PUBLIC PRICING ROUTES ERROR:",
      error
    );

    return NextResponse.json(
      {
<<<<<<< HEAD
        error:
          "Unable to load pricing routes.",
=======
        error: "Unable to load pricing routes.",
>>>>>>> origin/dev
      },
      {
        status: 500,
      }
    );
  }
}