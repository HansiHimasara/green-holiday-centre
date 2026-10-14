export function readRating(value: unknown): number | null {
  const rating = Number(value);
  return Number.isInteger(rating) && rating >= 1 && rating <= 5
    ? rating
    : null;
}

export function toAdminFeedback(row: {
  id: number;
  fullName: string;
  rating: number;
  message: string;
  visibility: string;
}) {
  return {
    id: row.id,
    customer: row.fullName,
    rating: row.rating,
    feedback: row.message,
    status: row.visibility === "VISIBLE" ? "visible" : "hidden",
  };
}