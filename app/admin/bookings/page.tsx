import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSearchBar from "@/components/admin/AdminSearchBar";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminTable from "@/components/admin/AdminTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

const bookings = [
  {
    id: "GH-2026-1045",
    customer: "Kasun Silva",
    date: "Jun 22, 2026",
    vehicle: "Mercedes Benz",
    status: "confirmed" as const,
  },
  {
    id: "GH-2026-1044",
    customer: "Nimali Jayasuriya",
    date: "Jun 21, 2026",
    vehicle: "Toyota Hiace",
    status: "pending" as const,
  },
  {
    id: "GH-2026-1043",
    customer: "Dilshan Perera",
    date: "Jun 20, 2026",
    vehicle: "Toyota Prius",
    status: "cancelled" as const,
  },
  {
    id: "GH-2026-1042",
    customer: "Shan Wijekoon",
    date: "Jun 19, 2026",
    vehicle: "Suzuki Wagon R",
    status: "confirmed" as const,
  },
];

export default function AdminBookingsPage() {
  return (
    <AdminPageLayout sectionTitle="Booking Management">
      {/* ==========================================
          PAGE HEADER
      ========================================== */}
      <AdminPageHeader
        title="Our Bookings"
        description="Manage all customer bookings, travel dates and booking status."
      />

      {/* ==========================================
          SEARCH + ACTIONS
      ========================================== */}
      <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <AdminSearchBar placeholder="Search booking by ID or customer..." />

        <div className="flex flex-wrap gap-3">
          <AdminActionButton>
            Filter Bookings
          </AdminActionButton>

          <AdminActionButton variant="primary">
            + Manual Entry
          </AdminActionButton>
        </div>
      </div>

      {/* ==========================================
          BOOKINGS TABLE
      ========================================== */}
      <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-[0_10px_30px_rgba(7,91,69,0.05)]">
        {/* Table top accent */}
        <div className="flex h-1.5 w-full">
          <span className="flex-1 bg-[var(--green-primary)]" />
          <span className="flex-1 bg-[var(--yellow-golden)]" />
          <span className="flex-1 bg-[var(--sky-blue)]" />
        </div>

        <div className="flex items-center justify-between border-b border-[var(--border-light)] px-5 py-4 md:px-6">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--green-primary)]">
              Reservations
            </p>

            <h2 className="mt-1 font-serif text-[21px] font-semibold text-[var(--green-dark)]">
              Booking Records
            </h2>
          </div>

          <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-[10px] font-bold text-[var(--text-secondary)]">
            {bookings.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <AdminTable>
            <thead>
              <tr className="border-b border-[var(--border-light)] bg-[var(--surface-soft)]">
                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Booking ID
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Customer
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Travel Date
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Vehicle Class
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Status
                </th>

                <th className="px-5 py-3 text-center text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="
                    border-b
                    border-[var(--border-light)]
                    last:border-0
                    transition-colors
                    duration-200
                    hover:bg-[var(--surface-soft)]
                  "
                >
                  <td className="px-5 py-4 text-[12px] font-bold text-[var(--green-dark)]">
                    {booking.id}
                  </td>

                  <td className="px-5 py-4 text-[13px] font-semibold text-[var(--text-primary)]">
                    {booking.customer}
                  </td>

                  <td className="px-5 py-4 text-[12px] text-[var(--text-secondary)]">
                    {booking.date}
                  </td>

                  <td className="px-5 py-4 text-[12px] text-[var(--text-secondary)]">
                    {booking.vehicle}
                  </td>

                  <td className="px-5 py-4">
                    <AdminStatusBadge status={booking.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        aria-label={`Edit ${booking.id}`}
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-[var(--green-primary)]/20
                          bg-[var(--green-primary)]/[0.05]
                          text-[var(--green-primary)]
                          transition-all
                          duration-200
                          hover:-translate-y-0.5
                          hover:border-[var(--green-primary)]/40
                          hover:bg-[var(--green-primary)]
                          hover:text-white
                        "
                      >
                        <EditIcon />
                      </button>

                      <button
                        type="button"
                        aria-label={`Delete ${booking.id}`}
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-red-200
                          bg-red-50
                          text-red-500
                          transition-all
                          duration-200
                          hover:-translate-y-0.5
                          hover:border-red-300
                          hover:bg-red-500
                          hover:text-white
                        "
                      >
                        <DeleteIcon />
                      </button>
                    </div>
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

/* ==========================================
   EDIT ICON
========================================== */

function EditIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

/* ==========================================
   DELETE ICON
========================================== */

function DeleteIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}