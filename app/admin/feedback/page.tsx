import { db } from "@/src/prisma/db";
import { requireAdminUser } from "@/src/server/auth/requireAdmin";
import { redirect } from "next/navigation";
import AdminFeedbackClient from "./FeedbackClient";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminFeedbackPage() {
  if (!(await requireAdminUser())) redirect("/admin/login");
  const rows = await db.orm.public.Feedback.all();
  const initialFeedback = rows.map(row => ({
    id: row.id,
    customer: row.fullName,
    rating: row.rating,
    feedback: row.message,
    status: row.visibility === "VISIBLE" ? "visible" as const : "hidden" as const,
  })).sort((a, b) => b.id - a.id);
  return <AdminFeedbackClient initialFeedback={initialFeedback} />;
}
