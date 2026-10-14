import { redirect } from "next/navigation";
import { requireSuperAdmin } from "@/src/server/auth/session";
export const dynamic = "force-dynamic";
export default async function AccountsLayout({ children }: { children: React.ReactNode }) {
  if (!(await requireSuperAdmin())) redirect("/admin/dashboard");
  return children;
}
