import "dotenv/config";

import postgres from "@prisma/orm-postgres/runtime";

import type { Contract } from "./contract.d";

import contractJson from "./contract.json" with {
  type: "json",
};

function createDb() {
  const databaseUrl =
    process.env["DATABASE_URL"];

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not configured."
    );
  }

  return postgres<Contract>({
    contractJson,

    url: databaseUrl,

    poolOptions: {
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 10000,
    },
  });
}

type Database =
  ReturnType<typeof createDb>;

const globalForDb =
  globalThis as typeof globalThis & {
    __greenHolidayDb?: Database;
  };

export const db =
  globalForDb.__greenHolidayDb ??
  createDb();

if (
  process.env.NODE_ENV !==
  "production"
) {
  globalForDb.__greenHolidayDb =
    db;
}