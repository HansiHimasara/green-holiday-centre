"use client";

import { useState } from "react";

import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSearchBar from "@/components/admin/AdminSearchBar";
import AdminTable from "@/components/admin/AdminTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

type BookingStatus = "confirmed" | "pending" | "cancelled";

type Booking = {
  id: string;
  customer: string;
  date: string;
  vehicle: string;
  status: BookingStatus;
};

const initialBookings: Booking[] = [
  {
    id: "GH-2026-1045",
    customer: "Kasun Silva",
    date: "2026-06-22",
    vehicle: "Mercedes Benz",
    status: "confirmed",
  },
  {
    id: "GH-2026-1044",
    customer: "Nimali Jayasuriya",
    date: "2026-06-21",
    vehicle: "Toyota Hiace",
    status: "pending",
  },
  {
    id: "GH-2026-1043",
    customer: "Dilshan Perera",
    date: "2026-06-20",
    vehicle: "Toyota Prius",
    status: "cancelled",
  },
  {
    id: "GH-2026-1042",
    customer: "Shan Wijekoon",
    date: "2026-06-19",
    vehicle: "Suzuki Wagon R",
    status: "confirmed",
  },
];

const vehicleOptions = [
  "Mercedes Benz",
  "Toyota Hiace",
  "Toyota Prius",
  "Suzuki Wagon R",
  "Toyota KDH",
  "Toyota Alphard",
  "Mercedes Sprinter",
  "Executive Minivan",
  "Luxury SUV",
  "Premium Hybrid Sedan",
];

const inputClasses = `
  h-9
  w-full
  rounded-lg
  border
  border-[var(--green-primary)]/20
  bg-white
  px-3
  text-[11px]
  font-semibold
  text-[var(--text-primary)]
  outline-none
  transition-colors
  duration-200
  placeholder:text-[var(--text-muted)]
  focus:border-[var(--green-primary)]
  focus:ring-2
  focus:ring-[var(--green-primary)]/10
`;

const selectClasses = `
  h-9
  w-full
  appearance-none
  rounded-lg
  border
  border-[var(--green-primary)]/20
  bg-white
  px-3
  pr-9
  text-[11px]
  font-semibold
  text-[var(--text-primary)]
  outline-none
  transition-colors
  duration-200
  focus:border-[var(--green-primary)]
  focus:ring-2
  focus:ring-[var(--green-primary)]/10
`;

export default function AdminBookingsPage() {
  const [bookings, setBookings] =
    useState<Booking[]>(initialBookings);

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | BookingStatus
  >("all");

  const [editingId, setEditingId] = useState<string | null>(
    null,
  );

  const [editingBooking, setEditingBooking] =
    useState<Booking | null>(null);

  /* ==========================================
     FILTER BOOKINGS
  ========================================== */

  const filteredBookings = bookings.filter((booking) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      booking.id.toLowerCase().includes(search) ||
      booking.customer.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "all" ||
      booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  /* ==========================================
     EDIT BOOKING
  ========================================== */

  const handleEdit = (booking: Booking) => {
    setEditingId(booking.id);
    setEditingBooking({ ...booking });
  };

  /* ==========================================
     UPDATE EDITING FIELD
  ========================================== */

  const updateEditingField = (
    field: keyof Booking,
    value: string,
  ) => {
    if (!editingBooking) return;

    setEditingBooking({
      ...editingBooking,
      [field]: value,
    });
  };

  /* ==========================================
     SAVE BOOKING
  ========================================== */

  const handleSave = () => {
    if (!editingBooking) return;

    if (
      !editingBooking.id.trim() ||
      !editingBooking.customer.trim() ||
      !editingBooking.date.trim() ||
      !editingBooking.vehicle.trim()
    ) {
      return;
    }

    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === editingId
          ? editingBooking
          : booking,
      ),
    );

    setEditingId(null);
    setEditingBooking(null);
  };

  /* ==========================================
     CANCEL EDITING
  ========================================== */

  const handleCancel = () => {
    setEditingId(null);
    setEditingBooking(null);
  };

  /* ==========================================
     DELETE BOOKING
  ========================================== */

  const handleDelete = (id: string) => {
    setBookings((currentBookings) =>
      currentBookings.filter(
        (booking) => booking.id !== id,
      ),
    );

    if (editingId === id) {
      setEditingId(null);
      setEditingBooking(null);
    }
  };

  /* ==========================================
     MANUAL ENTRY
  ========================================== */

  const handleManualEntry = () => {
    const newBooking: Booking = {
      id: `GH-2026-${Math.floor(
        1000 + Math.random() * 9000,
      )}`,
      customer: "",
      date: "",
      vehicle: "",
      status: "pending",
    };

    setBookings((currentBookings) => [
      newBooking,
      ...currentBookings,
    ]);

    setEditingId(newBooking.id);
    setEditingBooking({ ...newBooking });
  };

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
        <div className="flex flex-1 flex-col gap-3 md:flex-row">
          {/* Search */}
          <div className="flex-1">
            <AdminSearchBar
              placeholder="Search booking by ID or customer..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          {/* Status Filter */}
          <div className="relative w-full md:w-[170px]">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | "all"
                    | BookingStatus,
                )
              }
              className={selectClasses}
              aria-label="Filter bookings by status"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <span
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-[var(--green-primary)]
              "
            >
              <ChevronDownIcon />
            </span>
          </div>
        </div>

        {/* Manual Entry */}
        <button
          type="button"
          onClick={handleManualEntry}
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
          + Manual Entry
        </button>
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

        {/* Table Heading */}
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

        {/* ==========================================
            TABLE
        ========================================== */}
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
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => {
                  const isEditing =
                    editingId === booking.id;

                  return (
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
                      {/* ==================================
                          BOOKING ID
                      ================================== */}
                      <td className="px-5 py-4">
                        {isEditing && editingBooking ? (
                          <input
                            type="text"
                            value={editingBooking.id}
                            onChange={(event) =>
                              updateEditingField(
                                "id",
                                event.target.value,
                              )
                            }
                            className={`${inputClasses} min-w-[145px]`}
                          />
                        ) : (
                          <span className="text-[12px] font-bold text-[var(--green-dark)]">
                            {booking.id}
                          </span>
                        )}
                      </td>

                      {/* ==================================
                          CUSTOMER
                      ================================== */}
                      <td className="px-5 py-4">
                        {isEditing && editingBooking ? (
                          <input
                            type="text"
                            value={
                              editingBooking.customer
                            }
                            onChange={(event) =>
                              updateEditingField(
                                "customer",
                                event.target.value,
                              )
                            }
                            placeholder="Customer name"
                            className={`${inputClasses} min-w-[160px]`}
                          />
                        ) : (
                          <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                            {booking.customer || "—"}
                          </span>
                        )}
                      </td>

                      {/* ==================================
                          TRAVEL DATE
                      ================================== */}
                      <td className="px-5 py-4">
                        {isEditing && editingBooking ? (
                          <input
                            type="date"
                            value={editingBooking.date}
                            onChange={(event) =>
                              updateEditingField(
                                "date",
                                event.target.value,
                              )
                            }
                            className={`${inputClasses} min-w-[145px]`}
                          />
                        ) : (
                          <span className="text-[12px] text-[var(--text-secondary)]">
                            {formatDate(booking.date)}
                          </span>
                        )}
                      </td>

                      {/* ==================================
                          VEHICLE
                      ================================== */}
                      <td className="px-5 py-4">
                        {isEditing && editingBooking ? (
                          <input
                            type="text"
                            list="vehicle-options"
                            value={
                              editingBooking.vehicle
                            }
                            onChange={(event) =>
                              updateEditingField(
                                "vehicle",
                                event.target.value,
                              )
                            }
                            placeholder="Type or select vehicle"
                            className={`${inputClasses} min-w-[190px]`}
                          />
                        ) : (
                          <span className="text-[12px] text-[var(--text-secondary)]">
                            {booking.vehicle || "—"}
                          </span>
                        )}
                      </td>

                      {/* ==================================
                          STATUS
                      ================================== */}
                      <td className="px-5 py-4">
                        {isEditing && editingBooking ? (
                          <div className="relative w-[125px]">
                            <select
                              value={
                                editingBooking.status
                              }
                              onChange={(event) =>
                                updateEditingField(
                                  "status",
                                  event.target.value,
                                )
                              }
                              className={selectClasses}
                            >
                              <option value="confirmed">
                                Confirmed
                              </option>

                              <option value="pending">
                                Pending
                              </option>

                              <option value="cancelled">
                                Cancelled
                              </option>
                            </select>

                            <span
                              className="
                                pointer-events-none
                                absolute
                                right-3
                                top-1/2
                                -translate-y-1/2
                                text-[var(--green-primary)]
                              "
                            >
                              <ChevronDownIcon />
                            </span>
                          </div>
                        ) : (
                          <AdminStatusBadge
                            status={booking.status}
                          />
                        )}
                      </td>

                      {/* ==================================
                          ACTIONS
                      ================================== */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {isEditing ? (
                            <>
                              {/* SAVE */}
                              <button
                                type="button"
                                onClick={handleSave}
                                className="
                                  inline-flex
                                  h-9
                                  items-center
                                  justify-center
                                  rounded-lg
                                  bg-[var(--green-dark)]
                                  px-4
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
                                Save
                              </button>

                              {/* CANCEL */}
                              <button
                                type="button"
                                onClick={handleCancel}
                                className="
                                  inline-flex
                                  h-9
                                  items-center
                                  justify-center
                                  rounded-lg
                                  border
                                  border-[var(--border)]
                                  bg-white
                                  px-4
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
                                "
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              {/* EDIT */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(booking)
                                }
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
                                  transition-colors
                                  duration-200
                                  hover:border-[var(--green-primary)]/40
                                  hover:bg-[var(--green-primary)]
                                  hover:text-white
                                "
                              >
                                <EditIcon />
                              </button>

                              {/* DELETE */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    booking.id,
                                  )
                                }
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
                                  transition-colors
                                  duration-200
                                  hover:border-red-300
                                  hover:bg-red-500
                                  hover:text-white
                                "
                              >
                                <DeleteIcon />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center"
                  >
                    <p className="text-[13px] font-semibold text-[var(--green-dark)]">
                      No bookings found
                    </p>

                    <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                      Try a different booking ID, customer
                      name or status.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </AdminTable>
        </div>
      </div>

      {/* ==========================================
          VEHICLE OPTIONS
      ========================================== */}
      <datalist id="vehicle-options">
        {vehicleOptions.map((vehicle) => (
          <option key={vehicle} value={vehicle} />
        ))}
      </datalist>
    </AdminPageLayout>
  );
}

/* ==========================================
   DATE FORMAT
========================================== */

function formatDate(date: string) {
  if (!date) return "—";

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${month}/${day}/${year}`;
}

/* ==========================================
   CHEVRON ICON
========================================== */

function ChevronDownIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
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