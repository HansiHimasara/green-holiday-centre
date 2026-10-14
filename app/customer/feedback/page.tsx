import { db } from "@/src/prisma/db";
import PublicFeedbackClient from "./PublicFeedbackClient";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function FeedbackPage() {
  // Visibility filtering happens at the database, not in a public client bundle.
  const rows = await db.orm.public.Feedback.where({ visibility: "VISIBLE" }).all();
  const initialReviews = rows.map(row => ({
    id: row.id,
    fullName: row.fullName,
    rating: row.rating,
    message: row.message,
  }));
  return <PublicFeedbackClient initialReviews={initialReviews} />;
}
