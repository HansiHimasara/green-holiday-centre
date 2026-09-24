"use client";

import { useState } from "react";

import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSearchBar from "@/components/admin/AdminSearchBar";
import AdminTable from "@/components/admin/AdminTable";

type Mileage = {
  id: number;
  from: string;
  to: string;
  distance: number;
  rate: number;
};

const initialMileages: Mileage[] = [
  {
    id: 1,
    from: "Colombo Airport (CMB)",
    to: "Colombo Fort",
    distance: 34.0,
    rate: 4500,
  },
  {
    id: 2,
    from: "Colombo Airport (CMB)",
    to: "Colombo City Centre",
    distance: 35.5,
    rate: 5000,
  },
  {
    id: 3,
    from: "Colombo Airport (CMB)",
    to: "Kandy Lake Round",
    distance: 103.0,
    rate: 12500,
  },
  {
    id: 4,
    from: "Colombo Fort",
    to: "Sigiriya Rock",
    distance: 171.0,
    rate: 18000,
  },
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

export default function AdminPricingPage() {
  const [mileages, setMileages] =
    useState<Mileage[]>(initialMileages);

  const [searchTerm, setSearchTerm] = useState("");

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editingMileage, setEditingMileage] =
    useState<Mileage | null>(null);

  /* ==========================================
     FILTER MILEAGES
  ========================================== */

  const filteredMileages = mileages.filter((item) => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    return (
      item.from.toLowerCase().includes(search) ||
      item.to.toLowerCase().includes(search)
    );
  });

  /* ==========================================
     EDIT MILEAGE
  ========================================== */

  const handleEdit = (item: Mileage) => {
    setEditingId(item.id);
    setEditingMileage({ ...item });
  };

  /* ==========================================
     UPDATE EDITING FIELD
  ========================================== */

  const updateEditingField = (
    field: keyof Mileage,
    value: string | number,
  ) => {
    if (!editingMileage) return;

    setEditingMileage({
      ...editingMileage,
      [field]: value,
    });
  };

  /* ==========================================
     SAVE MILEAGE
  ========================================== */

  const handleSave = () => {
    if (!editingMileage) return;

    if (
      !editingMileage.from.trim() ||
      !editingMileage.to.trim() ||
      editingMileage.distance <= 0 ||
      editingMileage.rate <= 0
    ) {
      return;
    }

    setMileages((currentMileages) =>
      currentMileages.map((item) =>
        item.id === editingId
          ? editingMileage
          : item,
      ),
    );

    setEditingId(null);
    setEditingMileage(null);
  };

  /* ==========================================
     CANCEL EDIT
  ========================================== */

  const handleCancel = () => {
    setEditingId(null);
    setEditingMileage(null);
  };

  /* ==========================================
     DELETE MILEAGE
  ========================================== */

  const handleDelete = (id: number) => {
    setMileages((currentMileages) =>
      currentMileages.filter(
        (item) => item.id !== id,
      ),
    );

    if (editingId === id) {
      setEditingId(null);
      setEditingMileage(null);
    }
  };

  /* ==========================================
     ADD MILEAGE
  ========================================== */

  const handleAddMileage = () => {
    const newId =
      mileages.length > 0
        ? Math.max(
            ...mileages.map((item) => item.id),
          ) + 1
        : 1;

    const newMileage: Mileage = {
      id: newId,
      from: "",
      to: "",
      distance: 0,
      rate: 0,
    };

    setMileages((currentMileages) => [
      newMileage,
      ...currentMileages,
    ]);

    setEditingId(newId);
    setEditingMileage({ ...newMileage });
  };

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
        <div className="flex-1 sm:max-w-[500px]">
          <AdminSearchBar
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <button
          type="button"
          onClick={handleAddMileage}
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
          + Add Mileage Rate
        </button>
      </div>

      {/* ==========================================
          MILEAGE TABLE
      ========================================== */}

      <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-[0_10px_30px_rgba(7,91,69,0.05)]">
        {/* Top Accent */}

        <div className="flex h-1.5 w-full">
          <span className="flex-1 bg-[var(--green-primary)]" />
          <span className="flex-1 bg-[var(--yellow-golden)]" />
          <span className="flex-1 bg-[var(--sky-blue)]" />
        </div>

        {/* Table Heading */}

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

        {/* ==========================================
            TABLE
        ========================================== */}

        <div className="overflow-x-auto">
          <AdminTable>
            <thead>
              <tr className="border-b border-[var(--border-light)] bg-[var(--surface-soft)]">
                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  From Location
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  To Location
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Distance
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Estimated Base Charge
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-center text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredMileages.length > 0 ? (
                filteredMileages.map((item) => {
                  const isEditing =
                    editingId === item.id;

                  return (
                    <tr
                      key={item.id}
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
                          FROM LOCATION
                      ================================== */}

                      <td className="px-5 py-4">
                        {isEditing &&
                        editingMileage ? (
                          <input
                            type="text"
                            value={
                              editingMileage.from
                            }
                            onChange={(event) =>
                              updateEditingField(
                                "from",
                                event.target.value,
                              )
                            }
                            placeholder="From location"
                            className={`${inputClasses} min-w-[200px]`}
                          />
                        ) : (
                          <p className="text-[13px] font-semibold text-[var(--text-primary)]">
                            {item.from}
                          </p>
                        )}
                      </td>

                      {/* ==================================
                          TO LOCATION
                      ================================== */}

                      <td className="px-5 py-4">
                        {isEditing &&
                        editingMileage ? (
                          <input
                            type="text"
                            value={
                              editingMileage.to
                            }
                            onChange={(event) =>
                              updateEditingField(
                                "to",
                                event.target.value,
                              )
                            }
                            placeholder="To location"
                            className={`${inputClasses} min-w-[200px]`}
                          />
                        ) : (
                          <p className="text-[13px] text-[var(--text-secondary)]">
                            {item.to}
                          </p>
                        )}
                      </td>

                      {/* ==================================
                          DISTANCE
                      ================================== */}

                      <td className="px-5 py-4">
                        {isEditing &&
                        editingMileage ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={
                                editingMileage.distance
                              }
                              onChange={(event) =>
                                updateEditingField(
                                  "distance",
                                  Number(
                                    event.target
                                      .value,
                                  ),
                                )
                              }
                              className={`${inputClasses} min-w-[90px]`}
                              aria-label="Distance in kilometres"
                            />

                            <span className="text-[11px] font-semibold text-[var(--text-muted)]">
                              km
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex rounded-full bg-[var(--sky-blue)]/[0.08] px-3 py-1 text-[11px] font-semibold text-[var(--sky-blue)]">
                            {item.distance.toFixed(1)} km
                          </span>
                        )}
                      </td>

                      {/* ==================================
                          BASE CHARGE
                      ================================== */}

                      <td className="px-5 py-4">
                        {isEditing &&
                        editingMileage ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-[var(--text-muted)]">
                              Rs.
                            </span>

                            <input
                              type="number"
                              min="0"
                              step="100"
                              value={
                                editingMileage.rate
                              }
                              onChange={(event) =>
                                updateEditingField(
                                  "rate",
                                  Number(
                                    event.target
                                      .value,
                                  ),
                                )
                              }
                              className={`${inputClasses} min-w-[120px]`}
                              aria-label="Base charge"
                            />
                          </div>
                        ) : (
                          <span className="text-[13px] font-bold text-[var(--green-dark)]">
                            Rs.{" "}
                            {item.rate.toLocaleString(
                              "en-LK",
                            )}
                          </span>
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
                                  handleEdit(item)
                                }
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
                                    item.id,
                                  )
                                }
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
                    colSpan={5}
                    className="px-5 py-12 text-center"
                  >
                    <p className="text-[13px] font-semibold text-[var(--green-dark)]">
                      No mileage records found
                    </p>

                    <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                      Try a different location.
                    </p>
                  </td>
                </tr>
              )}
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