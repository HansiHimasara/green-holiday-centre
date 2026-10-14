import { getCurrentUser } from "./session";

export async function requireAdminUser() {
  const user = await getCurrentUser();
  return user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN")
    ? user
    : null;
}