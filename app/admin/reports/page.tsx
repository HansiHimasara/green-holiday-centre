import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminTable from "@/components/admin/AdminTable";

const reports = [
  {
    name: "Total Bookings Completed",
    current: "1,128 trips",
    previous: "982 trips",
    variance: "+14.9% Increased",
  },
  {
    name: "Total Revenue Generated",
    current: "Rs. 8,450,000",
    previous: "Rs. 7,820,000",
    variance: "+8.1% Increased",
  },
  {
    name: "Average Booking Value",
    current: "Rs. 7,490",
    previous: "Rs. 7,180",
    variance: "+4.3% Increased",
  },
];

export default function AdminReportsPage() {
  return (
    <AdminPageLayout sectionTitle="Performance Reports">
      {/* ==========================================
          PAGE HEADER
      ========================================== */}
      <AdminPageHeader
        title="Our Reports"
        description="Generate and review business performance reports."
      />

      {/* ==========================================
          REPORT CONTROLS
      ========================================== */}
      <div className="mt-7 rounded-xl border border-[var(--border-light)] bg-white p-5 shadow-[0_8px_25px_rgba(7,91,69,0.04)] md:p-6">
        <div className="mb-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--green-primary)]">
            Report Configuration
          </p>

          <h2 className="mt-1 font-serif text-[20px] font-semibold text-[var(--green-dark)]">
            Select Report Period
          </h2>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <select
            className="
              h-[44px]
              w-full
              rounded-lg
              border
              border-[var(--border-light)]
              bg-white
              px-4
              text-[12px]
              font-medium
              text-[var(--text-secondary)]
              outline-none
              transition-colors
              duration-200
              focus:border-[var(--green-primary)]
              lg:flex-1
            "
            defaultValue="performance"
          >
            <option value="performance">
              Report Type: Performance Summary
            </option>
            <option value="booking">
              Booking Summary
            </option>
            <option value="revenue">
              Revenue Summary
            </option>
          </select>

          <select
            className="
              h-[44px]
              w-full
              rounded-lg
              border
              border-[var(--border-light)]
              bg-white
              px-4
              text-[12px]
              font-medium
              text-[var(--text-secondary)]
              outline-none
              transition-colors
              duration-200
              focus:border-[var(--green-primary)]
              lg:flex-1
            "
            defaultValue="august"
          >
            <option value="august">From: August 2026</option>
            <option value="july">July 2026</option>
            <option value="june">June 2026</option>
          </select>

          <AdminActionButton variant="primary">
            Generate Report
          </AdminActionButton>
        </div>
      </div>

      {/* ==========================================
          PERFORMANCE TABLE
      ========================================== */}
      <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-[0_10px_30px_rgba(7,91,69,0.05)]">
        {/* Top accent */}
        <div className="flex h-1.5 w-full">
          <span className="flex-1 bg-[var(--green-primary)]" />
          <span className="flex-1 bg-[var(--yellow-golden)]" />
          <span className="flex-1 bg-[var(--sky-blue)]" />
        </div>

        {/* Table heading */}
        <div className="border-b border-[var(--border-light)] px-5 py-4 md:px-6">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--green-primary)]">
            Performance
          </p>

          <h2 className="mt-1 font-serif text-[21px] font-semibold text-[var(--green-dark)]">
            Business Performance Overview
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <AdminTable>
            <thead>
              <tr className="border-b border-[var(--border-light)] bg-[var(--surface-soft)]">
                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Report Metric
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Current Period
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Previous Period
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Variance
                </th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.name}
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
                    {report.name}
                  </td>

                  <td className="px-5 py-4 text-[13px] font-bold text-[var(--green-dark)]">
                    {report.current}
                  </td>

                  <td className="px-5 py-4 text-[12px] text-[var(--text-secondary)]">
                    {report.previous}
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-[var(--green-primary)]/[0.08] px-3 py-1 text-[11px] font-bold text-[var(--green-primary)]">
                      {report.variance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        </div>
      </div>

      {/* ==========================================
          DOWNLOAD
      ========================================== */}
      <div className="mt-5 flex justify-end">
        <AdminActionButton variant="primary">
          Download Report as PDF
        </AdminActionButton>
      </div>
    </AdminPageLayout>
  );
}