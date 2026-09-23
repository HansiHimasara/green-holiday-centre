import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSearchBar from "@/components/admin/AdminSearchBar";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminTable from "@/components/admin/AdminTable";

const customers = [
  {
    name: "Kasun Jayasena",
    passport: "N1234567",
    nationality: "Sri Lankan",
    email: "kasun@email.com",
    contact: "+94 77 123 4567",
  },
  {
    name: "Emma Miller",
    passport: "UK908122",
    nationality: "British",
    email: "emma@email.com",
    contact: "+44 7700 900123",
  },
  {
    name: "Robert Thomas",
    passport: "US667892",
    nationality: "American",
    email: "robert@email.com",
    contact: "+1 202 555 0182",
  },
  {
    name: "Kelly Watson",
    passport: "AU448912",
    nationality: "Australian",
    email: "kelly@email.com",
    contact: "+61 412 345 678",
  },
];

export default function AdminCustomersPage() {
  return (
    <AdminPageLayout sectionTitle="Customer Directory">
      {/* ==========================================
          PAGE HEADER
      ========================================== */}
      <AdminPageHeader
        title="Our Customers"
        description="View and manage registered customers and contact information."
      />

      {/* ==========================================
          SEARCH + ACTION
      ========================================== */}
      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <AdminSearchBar placeholder="Search customer by name..." />

        <AdminActionButton>
          Export CSV
        </AdminActionButton>
      </div>

      {/* ==========================================
          CUSTOMER TABLE
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
              Directory
            </p>

            <h2 className="mt-1 font-serif text-[21px] font-semibold text-[var(--green-dark)]">
              Customer Records
            </h2>
          </div>

          <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-[10px] font-bold text-[var(--text-secondary)]">
            {customers.length} Customers
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <AdminTable>
            <thead>
              <tr className="border-b border-[var(--border-light)] bg-[var(--surface-soft)]">
                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Full Name
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Passport Number
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Nationality
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Email Address
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Contact
                </th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.passport}
                  className="
                    border-b
                    border-[var(--border-light)]
                    last:border-0
                    transition-colors
                    duration-200
                    hover:bg-[var(--surface-soft)]
                  "
                >
                  <td className="px-5 py-4 text-[13px] font-semibold text-[var(--text-primary)]">
                    {customer.name}
                  </td>

                  <td className="px-5 py-4 text-[12px] font-medium text-[var(--green-dark)]">
                    {customer.passport}
                  </td>

                  <td className="px-5 py-4 text-[12px] text-[var(--text-secondary)]">
                    {customer.nationality}
                  </td>

                  <td className="px-5 py-4 text-[12px] text-[var(--text-secondary)]">
                    {customer.email}
                  </td>

                  <td className="px-5 py-4 text-[12px] text-[var(--text-secondary)]">
                    {customer.contact}
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