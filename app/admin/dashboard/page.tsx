import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

const bookings = [
  {
    id: "GH-2026-1021",
    customer: "Kasun Silva",
    date: "Jun 21, 2026",
    vehicle: "Toyota Prius",
    status: "confirmed" as const,
  },
  {
    id: "GH-2026-1022",
    customer: "Dinithi Perera",
    date: "Jun 21, 2026",
    vehicle: "Suzuki Wagon R",
    status: "pending" as const,
  },
  {
    id: "GH-2026-1023",
    customer: "Nimal Fernando",
    date: "Jun 20, 2026",
    vehicle: "Toyota Hiace",
    status: "cancelled" as const,
  },
];

export default function AdminDashboardPage() {
  return (
    <AdminPageLayout sectionTitle="Dashboard Overview">
      {/* ==========================================
          PAGE HEADER
      ========================================== */}
      <AdminPageHeader
        title="Welcome Back, Admin"
        description="Here is the latest overview of Green Holiday transportation services."
      />

      {/* ==========================================
          STAT CARDS
      ========================================== */}
      <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Total Customers */}
        <div className="group relative overflow-hidden rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-[0_8px_25px_rgba(7,91,69,0.05)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(7,91,69,0.08)]">
          <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-[var(--green-primary)]/[0.05]" />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Total Customers
              </p>

              <p className="mt-2 font-serif text-[30px] font-semibold leading-none text-[var(--green-dark)]">
                1,284
              </p>
              <br></br>

              <p className="mt-2 text-[11px] font-semibold text-[var(--green-primary)]">
                +12 this month
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--green-primary)]/[0.10] text-[var(--green-primary)]">
              <CustomerIcon />
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="group relative overflow-hidden rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-[0_8px_25px_rgba(7,91,69,0.05)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(7,91,69,0.08)]">
          <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-[var(--yellow-golden)]/[0.07]" />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Pending Approvals
              </p>

              <p className="mt-2 font-serif text-[30px] font-semibold leading-none text-[var(--green-dark)]">
                42
              </p>
              <br></br>

              <p className="mt-2 text-[11px] font-semibold text-[var(--gold-mustard)]">
                Require attention
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--yellow-golden)]/[0.14] text-[var(--gold-mustard)]">
              <PendingIcon />
            </div>
          </div>
        </div>

        {/* Completed Trips */}
        <div className="group relative overflow-hidden rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-[0_8px_25px_rgba(7,91,69,0.05)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(7,91,69,0.08)]">
          <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-[var(--sky-blue)]/[0.06]" />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Completed Trips
              </p>

              <p className="mt-2 font-serif text-[30px] font-semibold leading-none text-[var(--green-dark)]">
                984
              </p>
              <br></br>

              <p className="mt-2 text-[11px] font-semibold text-[var(--sky-blue)]">
                +18 this month
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--sky-blue)]/[0.10] text-[var(--sky-blue)]">
              <VehicleIcon />
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          RECENT BOOKINGS
      ========================================== */}
      <div className="mt-8 overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-[0_10px_30px_rgba(7,91,69,0.05)]">
        {/* Table Header */}
        <div className="flex flex-col gap-3 border-b border-[var(--border-light)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--green-primary)]">
              Activity
            </p>

            <h2 className="mt-1 font-serif text-[22px] font-semibold text-[var(--green-dark)]">
              Recent Bookings
            </h2>
          </div>

          <button
            type="button"
            className="
              w-fit
              text-[12px]
              font-bold
              text-[var(--green-primary)]
              transition-colors
              duration-200
              hover:text-[var(--green-dark)]
            "
          >
            View All Bookings →
          </button>
        </div>

        {/* Table */}
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
                  Date
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Vehicle
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Status
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

                  <td className="px-5 py-4 text-[13px] font-medium text-[var(--text-primary)]">
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
   ICONS
========================================== */

function CustomerIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M4 19c0-3 2-5 5-5s5 2 5 5" />
      <path d="M15 8h5M17.5 5.5v5" />
    </svg>
  );
}

function PendingIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function VehicleIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 16h14l-1.5-6h-11L5 16z" />
      <circle cx="8" cy="17" r="1.5" />
      <circle cx="16" cy="17" r="1.5" />
    </svg>
  );
}