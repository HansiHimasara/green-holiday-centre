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
      connectionTimeoutMillis: 10000,
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

// Instantiate on the first query, so builds do not require production credentials.
export const db = new Proxy({} as Database, {
  get(_target, property) {
    const instance = globalForDb.__greenHolidayDb ??= createDb();
    const value = Reflect.get(instance, property);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
