import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSearchBar from "@/components/admin/AdminSearchBar";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminTable from "@/components/admin/AdminTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

const vehicles = [
  {
    id: "VH-001",
    model: "Mercedes Benz",
    capacity: "4 Passengers",
    description: "Premium luxury sedan",
    rate: "Rs. 180/km",
    status: "active" as const,
  },
  {
    id: "VH-002",
    model: "Suzuki Wagon R",
    capacity: "4 Passengers",
    description: "Ideal economy city vehicle",
    rate: "Rs. 100/km",
    status: "active" as const,
  },
  {
    id: "VH-003",
    model: "Toyota Hiace",
    capacity: "14 Passengers",
    description: "Comfortable vehicle for groups",
    rate: "Rs. 220/km",
    status: "active" as const,
  },
  {
    id: "VH-004",
    model: "Mitsubishi Montero",
    capacity: "6 Passengers",
    description: "Premium SUV",
    rate: "Rs. 250/km",
    status: "inactive" as const,
  },
];

export default function AdminVehiclesPage() {
  return (
    <AdminPageLayout sectionTitle="Fleet Manager">
      {/* ==========================================
          PAGE HEADER
      ========================================== */}
      <AdminPageHeader
        title="Our Vehicles"
        description="Configure vehicles, passenger capacity, rates and availability."
      />

      {/* ==========================================
          SEARCH + ACTIONS
      ========================================== */}
      <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <AdminSearchBar placeholder="Search vehicles..." />

        <div className="flex flex-wrap gap-3">
          <AdminActionButton>
            Category
          </AdminActionButton>

          <AdminActionButton variant="primary">
            + Add Vehicle
          </AdminActionButton>
        </div>
      </div>

      {/* ==========================================
          VEHICLES TABLE
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
              Fleet
            </p>

            <h2 className="mt-1 font-serif text-[21px] font-semibold text-[var(--green-dark)]">
              Vehicle Records
            </h2>
          </div>

          <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-[10px] font-bold text-[var(--text-secondary)]">
            {vehicles.length} Vehicles
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <AdminTable>
            <thead>
              <tr className="border-b border-[var(--border-light)] bg-[var(--surface-soft)]">
                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Vehicle ID
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Vehicle Name
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Capacity
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Description
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Base Rate
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
              {vehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
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
                    {vehicle.id}
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-[13px] font-semibold text-[var(--text-primary)]">
                      {vehicle.model}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-[12px] text-[var(--text-secondary)]">
                    {vehicle.capacity}
                  </td>

                  <td className="px-5 py-4 text-[12px] text-[var(--text-secondary)]">
                    {vehicle.description}
                  </td>

                  <td className="px-5 py-4 text-[12px] font-bold text-[var(--green-dark)]">
                    {vehicle.rate}
                  </td>

                  <td className="px-5 py-4">
                    <AdminStatusBadge status={vehicle.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* Edit */}
                      <button
                        type="button"
                        aria-label={`Edit ${vehicle.model}`}
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
                        aria-label={`Delete ${vehicle.model}`}
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