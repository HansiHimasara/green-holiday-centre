import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSearchBar from "@/components/admin/AdminSearchBar";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminTable from "@/components/admin/AdminTable";

const mileages = [
  {
    from: "Colombo Airport (CMB)",
    to: "Colombo Fort",
    distance: "34.0 km",
    rate: "Rs. 4,500",
  },
  {
    from: "Colombo Airport (CMB)",
    to: "Colombo City Centre",
    distance: "35.5 km",
    rate: "Rs. 5,000",
  },
  {
    from: "Colombo Airport (CMB)",
    to: "Kandy Lake Round",
    distance: "103.0 km",
    rate: "Rs. 12,500",
  },
  {
    from: "Colombo Fort",
    to: "Sigiriya Rock",
    distance: "171.0 km",
    rate: "Rs. 18,000",
  },
];

export default function AdminPricingPage() {
  return (
    <AdminPageLayout sectionTitle="Pricing & Mileage">
      {/* ==========================================
          PAGE HEADER
      ========================================== */}
      <AdminPageHeader
        title="Our Mileages"
        description="Configure destination mileage and transportation pricing."
      />

      {/* ==========================================
          SEARCH + ACTION
      ========================================== */}
      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AdminSearchBar placeholder="Search locations..." />

        <AdminActionButton variant="primary">
          + Add Mileage Rate
        </AdminActionButton>
      </div>

      {/* ==========================================
          MILEAGE TABLE
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
              Pricing
            </p>

            <h2 className="mt-1 font-serif text-[21px] font-semibold text-[var(--green-dark)]">
              Mileage &amp; Rate Records
            </h2>
          </div>

          <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-[10px] font-bold text-[var(--text-secondary)]">
            {mileages.length} Routes
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <AdminTable>
            <thead>
              <tr className="border-b border-[var(--border-light)] bg-[var(--surface-soft)]">
                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  From Location
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  To Location
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Distance
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Estimated Base Charge
                </th>

                <th className="px-5 py-3 text-center text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {mileages.map((item, index) => (
                <tr
                  key={index}
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
                      {item.from}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-[13px] text-[var(--text-secondary)]">
                      {item.to}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-[var(--sky-blue)]/[0.08] px-3 py-1 text-[11px] font-semibold text-[var(--sky-blue)]">
                      {item.distance}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-[13px] font-bold text-[var(--green-dark)]">
                      {item.rate}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Edit */}
                      <button
                        type="button"
                        aria-label={`Edit mileage from ${item.from} to ${item.to}`}
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

                      {/* Delete */}
                      <button
                        type="button"
                        aria-label={`Delete mileage from ${item.from} to ${item.to}`}
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