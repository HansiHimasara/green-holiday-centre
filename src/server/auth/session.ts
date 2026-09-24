import {
  createHash,
  randomBytes,
} from "node:crypto";

import { cookies } from "next/headers";

import { db } from "@/src/prisma/db";

const SESSION_COOKIE =
  "greenholiday_session";

function hashToken(token: string) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function createSession(
  userId: number,
  remember = false
) {
  const rawToken =
    randomBytes(32).toString("base64url");

  const tokenHash =
    hashToken(rawToken);

  const duration =
    remember
      ? 30 * 24 * 60 * 60 * 1000
      : 24 * 60 * 60 * 1000;

  const expiresAt =
    new Date(Date.now() + duration);

  await db.orm.public.Session.create({
    userId,
    tokenHash,
    expiresAt: expiresAt.toISOString(),
  });

  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE,
    rawToken,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    }
  );
}

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const rawToken =
    cookieStore.get(
      SESSION_COOKIE
    )?.value;

  if (!rawToken) {
    return null;
  }

  const tokenHash =
    hashToken(rawToken);

  const session =
    await db.orm.public.Session
      .where({
        tokenHash,
      })
      .first();

  if (!session) {
    return null;
  }

  const expired =
    new Date(
      session.expiresAt
    ).getTime() <= Date.now();

  if (expired) {
    await db.orm.public.Session
      .where({
        id: session.id,
      })
      .delete();

    cookieStore.delete(
      SESSION_COOKIE
    );

    return null;
  }

  const user =
    await db.orm.public.User
      .where({
        id: session.userId,
      })
      .first();

  if (
    !user ||
    user.status !== "ACTIVE"
  ) {
    return null;
  }

  return user;
}

export async function requireSuperAdmin() {
  const user =
    await getCurrentUser();

  if (
    !user ||
    user.role !== "SUPER_ADMIN"
  ) {
    return null;
  }

  return user;
}

export async function logoutCurrentUser() {
  const cookieStore = await cookies();

  const rawToken =
    cookieStore.get(
      SESSION_COOKIE
    )?.value;

  if (rawToken) {
    const tokenHash =
      hashToken(rawToken);

    const session =
      await db.orm.public.Session
        .where({
          tokenHash,
        })
        .first();

    if (session) {
      await db.orm.public.Session
        .where({
          id: session.id,
        })
        .delete();
    }
  }

  cookieStore.delete(
    SESSION_COOKIE
  );
}