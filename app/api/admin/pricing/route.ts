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

    const pricingRecords =
      await db.orm.public.Pricing.all();

    const pricing =
      pricingRecords
        .map((item) => ({
          id:
            item.id,

          from:
            item.fromLocation,

          to:
            item.toLocation,

          distance:
            Number(
              item.kilometres
            ),

          baseCharge:
            item.baseCharge ===
            null
              ? 0
              : Number(
                  item.baseCharge
                ),

          extraKilometreCharge:
            Number(
              item.extraKilometreCharge
            ),

          currency:
            item.currency,

          active:
            item.active,
        }))
        .sort(
          (a, b) =>
            a.id - b.id
        );

    return NextResponse.json({
      pricing,
    });
  } catch (error) {
    console.error(
      "ADMIN PRICING GET ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load pricing records.",
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

    const fromLocation =
      String(
        body.from ?? ""
      ).trim();

    const toLocation =
      String(
        body.to ?? ""
      ).trim();

    const kilometres =
      Number(
        body.distance
      );

    const baseCharge =
      Number(
        body.baseCharge
      );

    const extraKilometreCharge =
      Number(
        body.extraKilometreCharge
      );

    const currency =
      String(
        body.currency ??
          "LKR"
      )
        .trim()
        .toUpperCase();

    const active =
      body.active !==
      false;

    if (
      !fromLocation ||
      !toLocation
    ) {
      return NextResponse.json(
        {
          error:
            "From location and to location are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(
        kilometres
      ) ||
      kilometres <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Distance must be greater than 0.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(
        baseCharge
      ) ||
      baseCharge < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Base charge cannot be negative.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(
        extraKilometreCharge
      ) ||
      extraKilometreCharge <
        0
    ) {
      return NextResponse.json(
        {
          error:
            "Extra kilometre charge cannot be negative.",
        },
        {
          status: 400,
        }
      );
    }

    if (!currency) {
      return NextResponse.json(
        {
          error:
            "Currency is required.",
        },
        {
          status: 400,
        }
      );
    }

    const allPricing =
      await db.orm.public.Pricing.all();

    const duplicate =
      allPricing.find(
        (item) =>
          item.fromLocation
            .trim()
            .toLowerCase() ===
            fromLocation.toLowerCase() &&
          item.toLocation
            .trim()
            .toLowerCase() ===
            toLocation.toLowerCase()
      );

    if (duplicate) {
      return NextResponse.json(
        {
          error:
            "A pricing record for this route already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const created =
      await db.orm.public.Pricing.create(
        {
          fromLocation,
          toLocation,

          kilometres:
            kilometres.toFixed(
              1
            ),

          baseCharge:
            baseCharge.toFixed(
              2
            ),

          extraKilometreCharge:
            extraKilometreCharge.toFixed(
              2
            ),

          currency,

          active,
        }
      );

    if (!created) {
      return NextResponse.json(
        {
          error:
            "Unable to create pricing record.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        message:
          "Pricing record created successfully.",

        pricing: {
          id:
            created.id,

          from:
            created.fromLocation,

          to:
            created.toLocation,

          distance:
            Number(
              created.kilometres
            ),

          baseCharge:
            created.baseCharge ===
            null
              ? 0
              : Number(
                  created.baseCharge
                ),

          extraKilometreCharge:
            Number(
              created.extraKilometreCharge
            ),

          currency:
            created.currency,

          active:
            created.active,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "ADMIN PRICING CREATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create pricing record.",
      },
      {
        status: 500,
      }
    );
  }
}