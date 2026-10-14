import { db } from "@/src/prisma/db";
import { requireSuperAdmin } from "@/src/server/auth/session";
import { redirect } from "next/navigation";
import AdminAccountsClient from "./AccountsClient";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminAccountsPage() {
  if (!(await requireSuperAdmin())) redirect("/admin/dashboard");
  const rows = await db.orm.public.User.where({ role: "ADMIN" }).all();
  // Deliberately exclude passwordHash, reset tokens, or session data from RSC props.
  const initialAdmins = rows.map(row => ({
    id: row.id,
    fullName: row.fullName,
    username: row.username,
    email: row.email,
    status: row.status,
    createdAt: String(row.createdAt),
  })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return <AdminAccountsClient initialAdmins={initialAdmins} />;
}
