"use client";

import { useState } from "react";

import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSearchBar from "@/components/admin/AdminSearchBar";
import AdminTable from "@/components/admin/AdminTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

type VehicleStatus = "active" | "inactive";

type Vehicle = {
  id: string;
  model: string;
  passengers: number;
  luggage: number;
  transmission: string;
  fuelType: string;
  description: string;
  rate: string;
  status: VehicleStatus;
};

const initialVehicles: Vehicle[] = [
  {
    id: "VH-001",
    model: "Mercedes Benz",
    passengers: 4,
    luggage: 2,
    transmission: "Automatic",
    fuelType: "Hybrid",
    description: "Premium luxury sedan",
    rate: "Rs. 180/km",
    status: "active",
  },
  {
    id: "VH-002",
    model: "Suzuki Wagon R",
    passengers: 4,
    luggage: 2,
    transmission: "Automatic",
    fuelType: "Petrol",
    description: "Ideal economy city vehicle",
    rate: "Rs. 100/km",
    status: "active",
  },
  {
    id: "VH-003",
    model: "Toyota Hiace",
    passengers: 14,
    luggage: 10,
    transmission: "Automatic",
    fuelType: "Diesel",
    description: "Comfortable vehicle for groups",
    rate: "Rs. 220/km",
    status: "active",
  },
  {
    id: "VH-004",
    model: "Mitsubishi Montero",
    passengers: 6,
    luggage: 4,
    transmission: "Automatic",
    fuelType: "Diesel",
    description: "Premium SUV",
    rate: "Rs. 250/km",
    status: "inactive",
  },
];

const transmissionOptions = [
  "Automatic",
  "Manual",
];

const fuelTypeOptions = [
  "Hybrid",
  "Petrol",
  "Diesel",
  "Electric",
];

const categoryOptions = [
  "All Categories",
  "Sedan",
  "SUV",
  "Minivan",
  "Bus",
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

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] =
    useState<Vehicle[]>(initialVehicles);

  const [searchTerm, setSearchTerm] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");

  const [editingId, setEditingId] = useState<string | null>(
    null,
  );

  const [editingVehicle, setEditingVehicle] =
    useState<Vehicle | null>(null);

  /* ==========================================
     FILTER VEHICLES
  ========================================== */

  const filteredVehicles = vehicles.filter((vehicle) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      vehicle.id.toLowerCase().includes(search) ||
      vehicle.model.toLowerCase().includes(search);

    const matchesCategory =
      categoryFilter === "All Categories" ||
      getVehicleCategory(vehicle.model) === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  /* ==========================================
     EDIT VEHICLE
  ========================================== */

  const handleEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setEditingVehicle({ ...vehicle });
  };

  /* ==========================================
     UPDATE EDITING FIELD
  ========================================== */

  const updateEditingField = (
    field: keyof Vehicle,
    value: string | number,
  ) => {
    if (!editingVehicle) return;

    setEditingVehicle({
      ...editingVehicle,
      [field]: value,
    });
  };

  /* ==========================================
     SAVE VEHICLE
  ========================================== */

  const handleSave = () => {
    if (!editingVehicle) return;

    if (
      !editingVehicle.id.trim() ||
      !editingVehicle.model.trim() ||
      editingVehicle.passengers < 1 ||
      editingVehicle.luggage < 0 ||
      !editingVehicle.transmission.trim() ||
      !editingVehicle.fuelType.trim() ||
      !editingVehicle.description.trim() ||
      !editingVehicle.rate.trim()
    ) {
      return;
    }

    setVehicles((currentVehicles) =>
      currentVehicles.map((vehicle) =>
        vehicle.id === editingId
          ? editingVehicle
          : vehicle,
      ),
    );

    setEditingId(null);
    setEditingVehicle(null);
  };

  /* ==========================================
     CANCEL EDIT
  ========================================== */

  const handleCancel = () => {
    setEditingId(null);
    setEditingVehicle(null);
  };

  /* ==========================================
     DELETE VEHICLE
  ========================================== */

  const handleDelete = (id: string) => {
    setVehicles((currentVehicles) =>
      currentVehicles.filter(
        (vehicle) => vehicle.id !== id,
      ),
    );

    if (editingId === id) {
      setEditingId(null);
      setEditingVehicle(null);
    }
  };

  /* ==========================================
     ADD VEHICLE
  ========================================== */

  const handleAddVehicle = () => {
    const newVehicle: Vehicle = {
      id: `VH-${String(vehicles.length + 1).padStart(
        3,
        "0",
      )}`,
      model: "",
      passengers: 4,
      luggage: 2,
      transmission: "Automatic",
      fuelType: "Hybrid",
      description: "",
      rate: "",
      status: "active",
    };

    setVehicles((currentVehicles) => [
      newVehicle,
      ...currentVehicles,
    ]);

    setEditingId(newVehicle.id);
    setEditingVehicle({ ...newVehicle });
  };

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
        <div className="flex flex-1 flex-col gap-3 md:flex-row">
          {/* Search */}

          <div className="flex-1">
            <AdminSearchBar
              placeholder="Search vehicle by ID or name..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          {/* Category */}

          <div className="relative w-full md:w-[175px]">
            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
              className={selectClasses}
              aria-label="Filter vehicles by category"
            >
              {categoryOptions.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
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

        {/* Add Vehicle */}

        <button
          type="button"
          onClick={handleAddVehicle}
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
          + Add Vehicle
        </button>
      </div>

      {/* ==========================================
          VEHICLES TABLE
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

        {/* ==========================================
            TABLE
        ========================================== */}

        <div className="overflow-x-auto">
          <AdminTable>
            <thead>
              <tr className="border-b border-[var(--border-light)] bg-[var(--surface-soft)]">
                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Vehicle ID
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Vehicle Name
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Passengers
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Luggage
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Transmission
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Fuel Type
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Description
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Base Rate
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
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => {
                  const isEditing =
                    editingId === vehicle.id;

                  return (
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
                      {/* ==================================
                          VEHICLE ID
                      ================================== */}

                      <td className="px-5 py-4">
                        {isEditing &&
                        editingVehicle ? (
                          <input
                            type="text"
                            value={editingVehicle.id}
                            onChange={(event) =>
                              updateEditingField(
                                "id",
                                event.target.value,
                              )
                            }
                            className={`${inputClasses} min-w-[105px]`}
                          />
                        ) : (
                          <span className="text-[12px] font-bold text-[var(--green-dark)]">
                            {vehicle.id}
                          </span>
                        )}
                      </td>

                      {/* ==================================
                          VEHICLE NAME
                      ================================== */}

                      <td className="px-5 py-4">
                        {isEditing &&
                        editingVehicle ? (
                          <input
                            type="text"
                            value={
                              editingVehicle.model
                            }
                            onChange={(event) =>
                              updateEditingField(
                                "model",
                                event.target.value,
                              )
                            }
                            placeholder="Vehicle name"
                            className={`${inputClasses} min-w-[160px]`}
                          />
                        ) : (
                          <p className="text-[13px] font-semibold text-[var(--text-primary)]">
                            {vehicle.model || "—"}
                          </p>
                        )}
                      </td>

                      {/* ==================================
                          PASSENGERS
                      ================================== */}

                      <td className="px-5 py-4">
                        {isEditing &&
                        editingVehicle ? (
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={
                              editingVehicle.passengers
                            }
                            onChange={(event) =>
                              updateEditingField(
                                "passengers",
                                Number(
                                  event.target.value,
                                ),
                              )
                            }
                            className={`${inputClasses} min-w-[90px]`}
                            aria-label="Passenger count"
                          />
                        ) : (
                          <span className="text-[12px] text-[var(--text-secondary)]">
                            {vehicle.passengers}
                          </span>
                        )}
                      </td>

                      {/* ==================================
                          LUGGAGE
                      ================================== */}

                      <td className="px-5 py-4">
                        {isEditing &&
                        editingVehicle ? (
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={
                              editingVehicle.luggage
                            }
                            onChange={(event) =>
                              updateEditingField(
                                "luggage",
                                Number(
                                  event.target.value,
                                ),
                              )
                            }
                            className={`${inputClasses} min-w-[90px]`}
                            aria-label="Luggage count"
                          />
                        ) : (
                          <span className="text-[12px] text-[var(--text-secondary)]">
                            {vehicle.luggage}
                          </span>
                        )}
                      </td>

                      {/* ==================================
                          TRANSMISSION
                      ================================== */}

                      <td className="px-5 py-4">
                        {isEditing &&
                        editingVehicle ? (
                          <StyledSelect
                            value={
                              editingVehicle.transmission
                            }
                            options={
                              transmissionOptions
                            }
                            onChange={(value) =>
                              updateEditingField(
                                "transmission",
                                value,
                              )
                            }
                          />
                        ) : (
                          <span className="text-[12px] text-[var(--text-secondary)]">
                            {vehicle.transmission}
                          </span>
                        )}
                      </td>

                      {/* ==================================
                          FUEL TYPE
                      ================================== */}

                      <td className="px-5 py-4">
                        {isEditing &&
                        editingVehicle ? (
                          <StyledSelect
                            value={
                              editingVehicle.fuelType
                            }
                            options={
                              fuelTypeOptions
                            }
                            onChange={(value) =>
                              updateEditingField(
                                "fuelType",
                                value,
                              )
                            }
                          />
                        ) : (
                          <span className="text-[12px] text-[var(--text-secondary)]">
                            {vehicle.fuelType}
                          </span>
                        )}
                      </td>

                      {/* ==================================
                          DESCRIPTION
                      ================================== */}

                      <td className="px-5 py-4">
                        {isEditing &&
                        editingVehicle ? (
                          <input
                            type="text"
                            value={
                              editingVehicle.description
                            }
                            onChange={(event) =>
                              updateEditingField(
                                "description",
                                event.target.value,
                              )
                            }
                            placeholder="Description"
                            className={`${inputClasses} min-w-[190px]`}
                          />
                        ) : (
                          <span className="text-[12px] text-[var(--text-secondary)]">
                            {vehicle.description ||
                              "—"}
                          </span>
                        )}
                      </td>

                      {/* ==================================
                          BASE RATE
                      ================================== */}

                      <td className="px-5 py-4">
                        {isEditing &&
                        editingVehicle ? (
                          <input
                            type="text"
                            value={
                              editingVehicle.rate
                            }
                            onChange={(event) =>
                              updateEditingField(
                                "rate",
                                event.target.value,
                              )
                            }
                            placeholder="Rs. 180/km"
                            className={`${inputClasses} min-w-[115px]`}
                          />
                        ) : (
                          <span className="text-[12px] font-bold text-[var(--green-dark)]">
                            {vehicle.rate || "—"}
                          </span>
                        )}
                      </td>

                      {/* ==================================
                          STATUS
                      ================================== */}

                      <td className="px-5 py-4">
                        {isEditing &&
                        editingVehicle ? (
                          <StyledSelect
                            value={
                              editingVehicle.status
                            }
                            options={[
                              "active",
                              "inactive",
                            ]}
                            onChange={(value) =>
                              updateEditingField(
                                "status",
                                value,
                              )
                            }
                          />
                        ) : (
                          <AdminStatusBadge
                            status={vehicle.status}
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
                                  handleEdit(
                                    vehicle,
                                  )
                                }
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
                                    vehicle.id,
                                  )
                                }
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
                    colSpan={10}
                    className="px-5 py-12 text-center"
                  >
                    <p className="text-[13px] font-semibold text-[var(--green-dark)]">
                      No vehicles found
                    </p>

                    <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                      Try a different vehicle name,
                      ID or category.
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
   STYLED SELECT
========================================== */

interface StyledSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function StyledSelect({
  value,
  options,
  onChange,
}: StyledSelectProps) {
  return (
    <div className="relative min-w-[125px]">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={selectClasses}
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {formatOption(option)}
          </option>
        ))}
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
  );
}

/* ==========================================
   OPTION LABEL
========================================== */

function formatOption(option: string) {
  if (
    option === "active" ||
    option === "inactive"
  ) {
    return (
      option.charAt(0).toUpperCase() +
      option.slice(1)
    );
  }

  return option;
}

/* ==========================================
   VEHICLE CATEGORY
========================================== */

function getVehicleCategory(model: string) {
  const name = model.toLowerCase();

  if (
    name.includes("hiace") ||
    name.includes("sprinter") ||
    name.includes("kdh")
  ) {
    return "Minivan";
  }

  if (
    name.includes("montero") ||
    name.includes("suv") ||
    name.includes("alphard")
  ) {
    return "SUV";
  }

  if (
    name.includes("bus") ||
    name.includes("coach")
  ) {
    return "Bus";
  }

  return "Sedan";
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