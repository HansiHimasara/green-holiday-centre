import { redirect } from "next/navigation";
import { requireAdminUser } from "@/src/server/auth/requireAdmin";
export const dynamic = "force-dynamic";
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!(await requireAdminUser())) redirect("/admin/login");
  return children;
}
