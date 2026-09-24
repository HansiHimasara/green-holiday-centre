import "dotenv/config";

import { db } from "../src/prisma/db";
import { hashPassword } from "../src/server/auth/password";

async function main() {
  const fullName =
    process.env.BOOTSTRAP_SUPER_ADMIN_NAME?.trim();

  const username =
    process.env.BOOTSTRAP_SUPER_ADMIN_USERNAME
      ?.trim()
      .toLowerCase();

  const email =
    process.env.BOOTSTRAP_SUPER_ADMIN_EMAIL
      ?.trim()
      .toLowerCase();

  const password =
    process.env.BOOTSTRAP_SUPER_ADMIN_PASSWORD;

  // Check required details
  if (
    !fullName ||
    !username ||
    !email ||
    !password
  ) {
    throw new Error(
      "Super Admin details are missing in .env."
    );
  }

  if (password.length < 8) {
    throw new Error(
      "Password must contain at least 8 characters."
    );
  }

  // Allow only one Super Admin
  const existingSuperAdmin =
    await db.orm.public.User
      .where({
        role: "SUPER_ADMIN",
      })
      .first();

  if (existingSuperAdmin) {
    console.log(
      "A Super Admin account already exists."
    );

    process.exit(0);
  }

  // Check email
  const existingEmail =
    await db.orm.public.User
      .where({
        email,
      })
      .first();

  if (existingEmail) {
    throw new Error(
      "This email address already exists."
    );
  }

  // Check username
  const existingUsername =
    await db.orm.public.User
      .where({
        username,
      })
      .first();

  if (existingUsername) {
    throw new Error(
      "This username already exists."
    );
  }

  // Hash password
  const passwordHash =
    await hashPassword(password);

  // Create Super Admin
  const user =
    await db.orm.public.User.create({
      fullName,
      username,
      email,
      passwordHash,
      phone: null,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      profileImageUrl: null,
      lastLoginAt: null,
    });

  console.log("");
  console.log(
    "✅ Super Admin created successfully."
  );
  console.log(`Name: ${user.fullName}`);
  console.log(`Email: ${user.email}`);
  console.log(`Role: ${user.role}`);
  console.log("");
}

main().catch((error) => {
  console.error("");
  console.error(
    "❌ Failed to create Super Admin:"
  );
  console.error(error);

  process.exit(1);
});