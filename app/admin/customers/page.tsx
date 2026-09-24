"use client";

import { useState } from "react";

import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSearchBar from "@/components/admin/AdminSearchBar";
import AdminTable from "@/components/admin/AdminTable";

type Customer = {
  id: number;
  name: string;
  passport: string;
  nationality: string;
  email: string;
  contact: string;
};

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Kasun Jayasena",
    passport: "N1234567",
    nationality: "Sri Lankan",
    email: "kasun@email.com",
    contact: "+94 77 123 4567",
  },
  {
    id: 2,
    name: "Emma Miller",
    passport: "UK908122",
    nationality: "British",
    email: "emma@email.com",
    contact: "+44 7700 900123",
  },
  {
    id: 3,
    name: "Robert Thomas",
    passport: "US667892",
    nationality: "American",
    email: "robert@email.com",
    contact: "+1 202 555 0182",
  },
  {
    id: 4,
    name: "Kelly Watson",
    passport: "AU448912",
    nationality: "Australian",
    email: "kelly@email.com",
    contact: "+61 412 345 678",
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

export default function AdminCustomersPage() {
  const [customers, setCustomers] =
    useState<Customer[]>(initialCustomers);

  const [searchTerm, setSearchTerm] = useState("");

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.toLowerCase().trim();

    return (
      customer.name.toLowerCase().includes(search) ||
      customer.passport.toLowerCase().includes(search) ||
      customer.nationality.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      customer.contact.toLowerCase().includes(search)
    );
  });

  const handleEdit = (customer: Customer) => {
    setEditingId(customer.id);
    setEditingCustomer({ ...customer });
  };

  const updateEditingField = (
    field: keyof Customer,
    value: string | number,
  ) => {
    if (!editingCustomer) return;

    setEditingCustomer({
      ...editingCustomer,
      [field]: value,
    });
  };

  const handleSave = () => {
    if (!editingCustomer) return;

    if (
      !editingCustomer.name.trim() ||
      !editingCustomer.passport.trim() ||
      !editingCustomer.nationality.trim() ||
      !editingCustomer.email.trim() ||
      !editingCustomer.contact.trim()
    ) {
      return;
    }

    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) =>
        customer.id === editingId
          ? editingCustomer
          : customer,
      ),
    );

    setEditingId(null);
    setEditingCustomer(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingCustomer(null);
  };

  const handleDelete = (id: number) => {
    setCustomers((currentCustomers) =>
      currentCustomers.filter(
        (customer) => customer.id !== id,
      ),
    );

    if (editingId === id) {
      setEditingId(null);
      setEditingCustomer(null);
    }
  };

  const handleAddCustomer = () => {
    const newId =
      customers.length > 0
        ? Math.max(
            ...customers.map((customer) => customer.id),
          ) + 1
        : 1;

    const newCustomer: Customer = {
      id: newId,
      name: "",
      passport: "",
      nationality: "",
      email: "",
      contact: "",
    };

    setCustomers((currentCustomers) => [
      newCustomer,
      ...currentCustomers,
    ]);

    setEditingId(newId);
    setEditingCustomer({ ...newCustomer });
  };

  const handleExportCSV = () => {
    const headers = [
      "Full Name",
      "Passport Number",
      "Nationality",
      "Email Address",
      "Contact",
    ];

    const rows = customers.map((customer) => [
      customer.name,
      customer.passport,
      customer.nationality,
      customer.email,
      customer.contact,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`,
          )
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "customers.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

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
          SEARCH + ACTIONS
      ========================================== */}
      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 sm:max-w-[500px]">
          <AdminSearchBar
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Export CSV - FILTER FONT STYLE */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="
              inline-flex
              h-9
              items-center
              justify-center
              rounded-lg
              border
              border-[var(--green-primary)]/20
              bg-white
              px-5
              text-[11px]
              font-semibold
              text-black
              transition-colors
              duration-200
              hover:border-[var(--green-primary)]
              hover:bg-[var(--surface-soft)]
            "
          >
            Export CSV
          </button>

          {/* Add Customer - PREVIOUS GREEN BUTTON STYLE */}
          <button
            type="button"
            onClick={handleAddCustomer}
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
            + Add Customer
          </button>
        </div>
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
                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Full Name
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Passport Number
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Nationality
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Email Address
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Contact
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-center text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => {
                  const isEditing =
                    editingId === customer.id;

                  return (
                    <tr
                      key={customer.id}
                      className="
                        border-b
                        border-[var(--border-light)]
                        last:border-0
                        transition-colors
                        duration-200
                        hover:bg-[var(--surface-soft)]
                      "
                    >
                      {/* Full Name */}
                      <td className="px-5 py-4">
                        {isEditing &&
                        editingCustomer ? (
                          <input
                            type="text"
                            value={editingCustomer.name}
                            onChange={(event) =>
                              updateEditingField(
                                "name",
                                event.target.value,
                              )
                            }
                            placeholder="Full name"
                            className={`${inputClasses} min-w-[170px]`}
                          />
                        ) : (
                          <p className="text-[13px] font-semibold text-[var(--text-primary)]">
                            {customer.name}
                          </p>
                        )}
                      </td>

                      {/* Passport */}
                      <td className="px-5 py-4">
                        {isEditing &&
                        editingCustomer ? (
                          <input
                            type="text"
                            value={editingCustomer.passport}
                            onChange={(event) =>
                              updateEditingField(
                                "passport",
                                event.target.value,
                              )
                            }
                            placeholder="Passport number"
                            className={`${inputClasses} min-w-[130px]`}
                          />
                        ) : (
                          <p className="text-[12px] font-medium text-[var(--green-dark)]">
                            {customer.passport}
                          </p>
                        )}
                      </td>

                      {/* Nationality */}
                      <td className="px-5 py-4">
                        {isEditing &&
                        editingCustomer ? (
                          <input
                            type="text"
                            value={
                              editingCustomer.nationality
                            }
                            onChange={(event) =>
                              updateEditingField(
                                "nationality",
                                event.target.value,
                              )
                            }
                            placeholder="Nationality"
                            className={`${inputClasses} min-w-[130px]`}
                          />
                        ) : (
                          <p className="text-[12px] text-[var(--text-secondary)]">
                            {customer.nationality}
                          </p>
                        )}
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4">
                        {isEditing &&
                        editingCustomer ? (
                          <input
                            type="email"
                            value={editingCustomer.email}
                            onChange={(event) =>
                              updateEditingField(
                                "email",
                                event.target.value,
                              )
                            }
                            placeholder="Email address"
                            className={`${inputClasses} min-w-[190px]`}
                          />
                        ) : (
                          <p className="text-[12px] text-[var(--text-secondary)]">
                            {customer.email}
                          </p>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">
                        {isEditing &&
                        editingCustomer ? (
                          <input
                            type="text"
                            value={editingCustomer.contact}
                            onChange={(event) =>
                              updateEditingField(
                                "contact",
                                event.target.value,
                              )
                            }
                            placeholder="Contact number"
                            className={`${inputClasses} min-w-[150px]`}
                          />
                        ) : (
                          <p className="text-[12px] text-[var(--text-secondary)]">
                            {customer.contact}
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {isEditing ? (
                            <>
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
                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(customer)
                                }
                                aria-label={`Edit ${customer.name}`}
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

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(customer.id)
                                }
                                aria-label={`Delete ${customer.name}`}
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
                      No customers found
                    </p>

                    <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                      Try a different search term.
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