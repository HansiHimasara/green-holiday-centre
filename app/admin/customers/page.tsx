import { db } from "@/src/prisma/db";
import { requireAdminUser } from "@/src/server/auth/requireAdmin";
import { redirect } from "next/navigation";
import AdminCustomersClient from "./CustomersClient";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminCustomersPage() {
  if (!(await requireAdminUser())) redirect("/admin/login");
  const rows = await db.orm.public.Customer.all();
  const initialCustomers = rows.map(row => ({
    id: row.id,
    name: row.fullName,
    passport: row.passportNumber ?? "",
    nationality: row.nationality ?? "",
    email: row.email,
    contact: row.phone,
  })).sort((a, b) => b.id - a.id);
  return <AdminCustomersClient initialCustomers={initialCustomers} />;
}
