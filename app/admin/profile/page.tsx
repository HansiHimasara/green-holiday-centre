import { getCurrentUser } from "@/src/server/auth/session";
import { redirect } from "next/navigation";
import AdminProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminProfilePage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) redirect("/admin/login");
  // Never expose a profile belonging to another authenticated user.
  const initialProfile = {
    fullName: user.fullName,
    username: user.username ?? "",
    email: user.email,
    phone: user.phone ?? "",
    role: user.role,
    lastLogin: user.lastLoginAt ? new Date(user.lastLoginAt).toISOString() : "",
    status: "Active" as const,
    photo: user.profileImageUrl ?? null,
  };
  return <AdminProfileClient initialProfile={initialProfile} />;
}
