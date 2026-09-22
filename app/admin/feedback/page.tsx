import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSearchBar from "@/components/admin/AdminSearchBar";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminTable from "@/components/admin/AdminTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

const feedbacks = [
  {
    customer: "Nimasha Perera",
    rating: 5,
    feedback:
      "Our driver was professional and friendly. The journey was comfortable.",
    status: "visible" as const,
  },
  {
    customer: "David Miller",
    rating: 5,
    feedback:
      "Excellent transportation service. Everything was arranged perfectly.",
    status: "visible" as const,
  },
  {
    customer: "Michael Thomas",
    rating: 4,
    feedback:
      "Good experience overall. The vehicle was clean and comfortable.",
    status: "hidden" as const,
  },
];

export default function AdminFeedbackPage() {
  return (
    <AdminPageLayout sectionTitle="Feedback Review">
      {/* ==========================================
          PAGE HEADER
      ========================================== */}
      <AdminPageHeader
        title="Our Feedbacks"
        description="Review customer ratings and manage feedback visibility."
      />

      {/* ==========================================
          SEARCH + FILTER
      ========================================== */}
      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AdminSearchBar placeholder="Search feedback by customer..." />

        <AdminActionButton>
          Filter Ratings
        </AdminActionButton>
      </div>

      {/* ==========================================
          FEEDBACK TABLE
      ========================================== */}
      <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-[0_10px_30px_rgba(7,91,69,0.05)]">
        {/* Top accent */}
        <div className="flex h-1.5 w-full">
          <span className="flex-1 bg-[var(--green-primary)]" />
          <span className="flex-1 bg-[var(--yellow-golden)]" />
          <span className="flex-1 bg-[var(--sky-blue)]" />
        </div>

        {/* Table heading */}
        <div className="flex items-center justify-between border-b border-[var(--border-light)] px-5 py-4 md:px-6">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--green-primary)]">
              Customer Experience
            </p>

            <h2 className="mt-1 font-serif text-[21px] font-semibold text-[var(--green-dark)]">
              Feedback Records
            </h2>
          </div>

          <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-[10px] font-bold text-[var(--text-secondary)]">
            {feedbacks.length} Reviews
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <AdminTable>
            <thead>
              <tr className="border-b border-[var(--border-light)] bg-[var(--surface-soft)]">
                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Customer Name
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Rating
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Feedback Text
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Visibility
                </th>
              </tr>
            </thead>

            <tbody>
              {feedbacks.map((feedback) => (
                <tr
                  key={feedback.customer}
                  className="
                    border-b
                    border-[var(--border-light)]
                    last:border-0
                    transition-colors
                    duration-200
                    hover:bg-[var(--surface-soft)]
                  "
                >
                  <td className="px-5 py-4">
                    <p className="text-[13px] font-semibold text-[var(--text-primary)]">
                      {feedback.customer}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-[15px] tracking-[1px] text-[var(--yellow-golden)]">
                        {"★".repeat(feedback.rating)}
                      </span>

                      <span className="ml-1 text-[11px] font-semibold text-[var(--text-muted)]">
                        {feedback.rating}.0
                      </span>
                    </div>
                  </td>

                  <td className="max-w-[520px] px-5 py-4">
                    <p className="text-[12px] leading-5 text-[var(--text-secondary)]">
                      {feedback.feedback}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <AdminStatusBadge status={feedback.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        </div>
      </div>
    </AdminPageLayout>
  );
}