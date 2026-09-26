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

    const pricingId =
      Number(
        params.id
      );

    if (
      !Number.isInteger(
        pricingId
      ) ||
      pricingId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid pricing ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existing =
      await db.orm.public.Pricing
        .where({
          id: pricingId,
        })
        .first();

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Pricing record not found.",
        },
        {
          status: 404,
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
          existing.currency
      )
        .trim()
        .toUpperCase();

    const active =
      typeof body.active ===
      "boolean"
        ? body.active
        : existing.active;

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
          item.id !==
            pricingId &&
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

    const updated =
      await db.orm.public.Pricing
        .where({
          id: pricingId,
        })
        .update({
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
        });

    if (!updated) {
      return NextResponse.json(
        {
          error:
            "Unable to update pricing record.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      message:
        "Pricing record updated successfully.",

      pricing: {
        id:
          updated.id,

        from:
          updated.fromLocation,

        to:
          updated.toLocation,

        distance:
          Number(
            updated.kilometres
          ),

        baseCharge:
          updated.baseCharge ===
          null
            ? 0
            : Number(
                updated.baseCharge
              ),

        extraKilometreCharge:
          Number(
            updated.extraKilometreCharge
          ),

        currency:
          updated.currency,

        active:
          updated.active,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN PRICING UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to update pricing record.",
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

    const pricingId =
      Number(
        params.id
      );

    if (
      !Number.isInteger(
        pricingId
      ) ||
      pricingId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid pricing ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existing =
      await db.orm.public.Pricing
        .where({
          id: pricingId,
        })
        .first();

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Pricing record not found.",
        },
        {
          status: 404,
        }
      );
    }

    const deletedCount =
      await db.orm.public.Pricing
        .where({
          id: pricingId,
        })
        .deleteAndCount();

    if (
      deletedCount === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Unable to delete pricing record.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      message:
        "Pricing record deleted successfully.",
    });
  } catch (error) {
    console.error(
      "ADMIN PRICING DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to delete pricing record.",
      },
      {
        status: 500,
      }
    );
  }
}