"use client";

import { useEffect, useState } from "react";

import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

type BackupStatus = "successful" | "restored";

type Backup = {
  id: number;
  date: string;
  size: string;
  type: string;
  status: BackupStatus;
};

const initialBackups: Backup[] = [
  {
    id: 1,
    date: "Jun 22, 2026 - 03:00 AM",
    size: "412 MB",
    type: "Automatic Backup",
    status: "successful",
  },
  {
    id: 2,
    date: "Jun 21, 2026 - 03:00 AM",
    size: "410 MB",
    type: "Automatic Backup",
    status: "successful",
  },
  {
    id: 3,
    date: "Jun 20, 2026 - 03:00 AM",
    size: "408 MB",
    type: "Automatic Backup",
    status: "successful",
  },
];

export default function AdminBackupPage() {
  const [backups, setBackups] =
    useState<Backup[]>(initialBackups);

  const [message, setMessage] =
    useState("");

  const [isLoaded, setIsLoaded] =
    useState(false);

  /*
   * Load saved backups
   */
  useEffect(() => {
    const savedBackups =
      localStorage.getItem(
        "green-holiday-backups",
      );

    if (savedBackups) {
      try {
        const parsedBackups =
          JSON.parse(savedBackups) as Backup[];

        setBackups(parsedBackups);
      } catch {
        localStorage.removeItem(
          "green-holiday-backups",
        );
      }
    }

    setIsLoaded(true);
  }, []);

  /*
   * Save backups
   */
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(
      "green-holiday-backups",
      JSON.stringify(backups),
    );
  }, [backups, isLoaded]);

  const latestBackup = backups[0];

  /*
   * Format date
   */
  const formatDate = (date: Date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /*
   * Create Backup
   */
  const handleCreateBackup = () => {
    const now = new Date();

    const newId =
      backups.length > 0
        ? Math.max(
            ...backups.map(
              (backup) => backup.id,
            ),
          ) + 1
        : 1;

    const newBackup: Backup = {
      id: newId,
      date: formatDate(now),
      size: "415 MB",
      type: "Manual Backup",
      status: "successful",
    };

    setBackups((currentBackups) => [
      newBackup,
      ...currentBackups,
    ]);

    setMessage(
      "Backup created successfully.",
    );
  };

  /*
   * Restore Backup
   */
  const handleRestore = (id: number) => {
    const backup = backups.find(
      (item) => item.id === id,
    );

    if (!backup) return;

    setBackups((currentBackups) =>
      currentBackups.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "restored",
            }
          : item,
      ),
    );

    setMessage(
      `Data restored from ${backup.date}.`,
    );
  };

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
                {latestBackup?.date ??
                  "No backups available"}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--green-primary)]/[0.10] text-[10px] font-bold text-[var(--green-primary)]">
                  ✓
                </span>

                <p className="text-[11px] font-semibold text-[var(--green-primary)]">
                  {latestBackup?.status ===
                  "restored"
                    ? "Backup restored successfully"
                    : "Automatic backup completed successfully"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Create Backup */}
              <button
                type="button"
                onClick={handleCreateBackup}
                className="
                  inline-flex
                  h-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-[var(--green-dark)]
                  px-5
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[0.08em]
                  !text-white
                  transition-colors
                  duration-200
                  hover:bg-[var(--green-primary)]
                "
              >
                Create Backup
              </button>

              {/* Restore Latest */}
              <button
                type="button"
                onClick={() =>
                  latestBackup &&
                  handleRestore(
                    latestBackup.id,
                  )
                }
                disabled={!latestBackup}
                className="
                  inline-flex
                  h-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-[var(--border)]
                  bg-white
                  px-5
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[0.08em]
                  text-[var(--text-secondary)]
                  transition-colors
                  duration-200
                  hover:border-[var(--green-primary)]/30
                  hover:bg-[var(--surface-soft)]
                  hover:text-[var(--green-dark)]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Restore Latest
              </button>
            </div>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mt-5 rounded-lg border border-[var(--green-primary)]/15 bg-[var(--green-primary)]/[0.04] px-4 py-3">
              <p className="text-[11px] font-semibold text-[var(--green-primary)]">
                {message}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ==========================================
          BACKUP LOGS
      ========================================== */}
      <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-[0_10px_30px_rgba(7,91,69,0.05)]">
        {/* Table heading */}
        <div className="flex items-center justify-between border-b border-[var(--border-light)] px-5 py-4 md:px-6">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--green-primary)]">
              Backup History
            </p>

            <h2 className="mt-1 font-serif text-[21px] font-semibold text-[var(--green-dark)]">
              Backup Logs
            </h2>
          </div>

          <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-[10px] font-bold text-[var(--text-secondary)]">
            {backups.length} Backups
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <AdminTable>
            <thead>
              <tr className="border-b border-[var(--border-light)] bg-[var(--surface-soft)]">
                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Backup Time
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  File Size
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Type
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Status
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-center text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {backups.length > 0 ? (
                backups.map((backup) => (
                  <tr
                    key={backup.id}
                    className="
                      border-b
                      border-[var(--border-light)]
                      last:border-0
                      transition-colors
                      duration-200
                      hover:bg-[var(--surface-soft)]
                    "
                  >
                    {/* Backup Time */}
                    <td className="px-5 py-4 text-[13px] font-semibold text-[var(--text-primary)]">
                      {backup.date}
                    </td>

                    {/* File Size */}
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-[var(--sky-blue)]/[0.08] px-3 py-1 text-[11px] font-semibold text-[var(--sky-blue)]">
                        {backup.size}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4 text-[12px] text-[var(--text-secondary)]">
                      {backup.type}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <AdminStatusBadge
                        status={backup.status}
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleRestore(
                              backup.id,
                            )
                          }
                          className="
                            inline-flex
                            h-8
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-[var(--green-primary)]/20
                            bg-[var(--green-primary)]/[0.05]
                            px-4
                            text-[10px]
                            font-extrabold
                            uppercase
                            tracking-[0.08em]
                            text-[var(--green-primary)]
                            transition-colors
                            duration-200
                            hover:border-[var(--green-primary)]/40
                            hover:bg-[var(--green-primary)]
                            hover:text-white
                          "
                        >
                          Restore
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center"
                  >
                    <p className="text-[13px] font-semibold text-[var(--green-dark)]">
                      No backups available
                    </p>

                    <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                      Create a backup to add a
                      restore point.
                    </p>
                  </td>
                </tr>
              )}
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
              Regular backups help protect booking,
              customer, vehicle and pricing information
              from unexpected data loss.
            </p>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}