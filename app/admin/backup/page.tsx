import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminActionButton from "@/components/admin/AdminActionButton";
import AdminTable from "@/components/admin/AdminTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

const backups = [
  {
    date: "Jun 22, 2026 - 03:00 AM",
    size: "412 MB",
    type: "Automatic Backup",
  },
  {
    date: "Jun 21, 2026 - 03:00 AM",
    size: "410 MB",
    type: "Automatic Backup",
  },
  {
    date: "Jun 20, 2026 - 03:00 AM",
    size: "408 MB",
    type: "Automatic Backup",
  },
];

export default function AdminBackupPage() {
  return (
    <AdminPageLayout sectionTitle="System Backups">
      {/* ==========================================
          PAGE HEADER
      ========================================== */}
      <AdminPageHeader
        title="Backup and Restore"
        description="Manage system backups, database recovery and restore points."
      />

      {/* ==========================================
          LAST BACKUP
      ========================================== */}
      <div className="mt-7 overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-[0_10px_30px_rgba(7,91,69,0.05)]">
        {/* Top accent */}
        <div className="flex h-1.5 w-full">
          <span className="flex-1 bg-[var(--green-primary)]" />
          <span className="flex-1 bg-[var(--yellow-golden)]" />
          <span className="flex-1 bg-[var(--sky-blue)]" />
        </div>

        <div className="px-5 py-5 md:px-6 md:py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--green-primary)]">
                System Status
              </p>

              <h2 className="mt-1 font-serif text-[22px] font-semibold text-[var(--green-dark)]">
                Last Backup
              </h2>

              <p className="mt-2 text-[13px] font-semibold text-[var(--text-primary)]">
                June 22, 2026 - 03:00 AM
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--green-primary)]/[0.10] text-[10px] font-bold text-[var(--green-primary)]">
                  ✓
                </span>

                <p className="text-[11px] font-semibold text-[var(--green-primary)]">
                  Automatic backup completed successfully
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <AdminActionButton variant="primary">
                Create Backup
              </AdminActionButton>

              <AdminActionButton>
                Restore Data
              </AdminActionButton>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          BACKUP LOGS
      ========================================== */}
      <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-[0_10px_30px_rgba(7,91,69,0.05)]">
        {/* Table heading */}
        <div className="border-b border-[var(--border-light)] px-5 py-4 md:px-6">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--green-primary)]">
            Backup History
          </p>

          <h2 className="mt-1 font-serif text-[21px] font-semibold text-[var(--green-dark)]">
            Backup Logs
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <AdminTable>
            <thead>
              <tr className="border-b border-[var(--border-light)] bg-[var(--surface-soft)]">
                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Backup Time
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  File Size
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Type
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {backups.map((backup) => (
                <tr
                  key={backup.date}
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
                    {backup.date}
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-[var(--sky-blue)]/[0.08] px-3 py-1 text-[11px] font-semibold text-[var(--sky-blue)]">
                      {backup.size}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-[12px] text-[var(--text-secondary)]">
                    {backup.type}
                  </td>

                  <td className="px-5 py-4">
                    <AdminStatusBadge status="successful" />
                  </td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        </div>
      </div>

      {/* ==========================================
          SECURITY NOTE
      ========================================== */}
      <div className="mt-5 rounded-xl border border-[var(--green-primary)]/15 bg-[var(--green-primary)]/[0.04] px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--green-primary)] text-[11px] font-bold text-white">
            ✓
          </div>

          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--green-dark)]">
              Backup Protection
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[var(--text-secondary)]">
              Regular backups help protect booking, customer, vehicle and
              pricing information from unexpected data loss.
            </p>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}