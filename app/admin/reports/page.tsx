"use client";

import { useState } from "react";

import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTable from "@/components/admin/AdminTable";

type ReportType =
  | "performance"
  | "booking"
  | "revenue";

type Report = {
  name: string;
  current: string;
  previous: string;
  variance: string;
};

const performanceReports: Report[] = [
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

const bookingReports: Report[] = [
  {
    name: "Total Bookings",
    current: "1,245 bookings",
    previous: "1,083 bookings",
    variance: "+15.0% Increased",
  },
  {
    name: "Completed Bookings",
    current: "1,128 bookings",
    previous: "982 bookings",
    variance: "+14.9% Increased",
  },
  {
    name: "Cancelled Bookings",
    current: "117 bookings",
    previous: "101 bookings",
    variance: "+15.8% Increased",
  },
];

const revenueReports: Report[] = [
  {
    name: "Total Revenue",
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
  {
    name: "Pending Payments",
    current: "Rs. 425,000",
    previous: "Rs. 380,000",
    variance: "+11.8% Increased",
  },
];

export default function AdminReportsPage() {
  const [reportType, setReportType] =
    useState<ReportType>("performance");

  const [period, setPeriod] =
    useState("august");

  const [generatedReports, setGeneratedReports] =
    useState<Report[]>(performanceReports);

  const [generatedPeriod, setGeneratedPeriod] =
    useState("August 2026");

  const handleGenerateReport = () => {
    let reports: Report[] = [];

    if (reportType === "booking") {
      reports = bookingReports;
    } else if (reportType === "revenue") {
      reports = revenueReports;
    } else {
      reports = performanceReports;
    }

    const periodNames: Record<string, string> = {
      august: "August 2026",
      july: "July 2026",
      june: "June 2026",
    };

    setGeneratedReports(reports);
    setGeneratedPeriod(
      periodNames[period] ?? "August 2026",
    );
  };

  const handleDownloadPDF = () => {
    window.print();
  };

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
          {/* Report Type */}
          <select
            value={reportType}
            onChange={(event) =>
              setReportType(
                event.target.value as ReportType,
              )
            }
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

          {/* Period */}
          <select
            value={period}
            onChange={(event) =>
              setPeriod(event.target.value)
            }
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
          >
            <option value="august">
              From: August 2026
            </option>

            <option value="july">
              From: July 2026
            </option>

            <option value="june">
              From: June 2026
            </option>
          </select>

          {/* Generate */}
          <button
            type="button"
            onClick={handleGenerateReport}
            className="
              inline-flex
              h-[44px]
              items-center
              justify-center
              rounded-lg
              bg-[var(--green-dark)]
              px-6
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
            Generate Report
          </button>
        </div>
      </div>

      {/* ==========================================
          PERFORMANCE TABLE
      ========================================== */}
      <div
        id="report-content"
        className="mt-6 overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-[0_10px_30px_rgba(7,91,69,0.05)]"
      >
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

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-serif text-[21px] font-semibold text-[var(--green-dark)]">
              Business Performance Overview
            </h2>

            <span className="text-[11px] font-semibold text-[var(--text-muted)]">
              {generatedPeriod}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <AdminTable>
            <thead>
              <tr className="border-b border-[var(--border-light)] bg-[var(--surface-soft)]">
                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Report Metric
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Current Period
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Previous Period
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Variance
                </th>
              </tr>
            </thead>

            <tbody>
              {generatedReports.map((report) => (
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
      <div className="mt-5 flex justify-end print:hidden">
        <button
          type="button"
          onClick={handleDownloadPDF}
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
          Download Report as PDF
        </button>
      </div>
    </AdminPageLayout>
  );
}