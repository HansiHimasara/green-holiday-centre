"use client";

import { useState } from "react";

import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSearchBar from "@/components/admin/AdminSearchBar";
import AdminTable from "@/components/admin/AdminTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

type FeedbackStatus = "visible" | "hidden";

type Feedback = {
  id: number;
  customer: string;
  rating: number;
  feedback: string;
  status: FeedbackStatus;
};

const initialFeedbacks: Feedback[] = [
  {
    id: 1,
    customer: "Nimasha Perera",
    rating: 5,
    feedback:
      "Our driver was professional and friendly. The journey was comfortable.",
    status: "visible",
  },
  {
    id: 2,
    customer: "David Miller",
    rating: 5,
    feedback:
      "Excellent transportation service. Everything was arranged perfectly.",
    status: "visible",
  },
  {
    id: 3,
    customer: "Michael Thomas",
    rating: 4,
    feedback:
      "Good experience overall. The vehicle was clean and comfortable.",
    status: "hidden",
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

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] =
    useState<Feedback[]>(initialFeedbacks);

  const [searchTerm, setSearchTerm] = useState("");

  const [ratingFilter, setRatingFilter] =
    useState("all");

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editingFeedback, setEditingFeedback] =
    useState<Feedback | null>(null);

  const filteredFeedbacks = feedbacks.filter(
    (feedback) => {
      const search = searchTerm
        .toLowerCase()
        .trim();

      const matchesSearch =
        feedback.customer
          .toLowerCase()
          .includes(search) ||
        feedback.feedback
          .toLowerCase()
          .includes(search);

      const matchesRating =
        ratingFilter === "all" ||
        feedback.rating === Number(ratingFilter);

      return matchesSearch && matchesRating;
    },
  );

  const handleEdit = (feedback: Feedback) => {
    setEditingId(feedback.id);
    setEditingFeedback({ ...feedback });
  };

  const updateEditingField = (
    field: keyof Feedback,
    value: string | number,
  ) => {
    if (!editingFeedback) return;

    setEditingFeedback({
      ...editingFeedback,
      [field]: value,
    });
  };

  const handleSave = () => {
    if (!editingFeedback) return;

    if (
      !editingFeedback.customer.trim() ||
      !editingFeedback.feedback.trim() ||
      editingFeedback.rating < 1 ||
      editingFeedback.rating > 5
    ) {
      return;
    }

    setFeedbacks((currentFeedbacks) =>
      currentFeedbacks.map((feedback) =>
        feedback.id === editingId
          ? editingFeedback
          : feedback,
      ),
    );

    setEditingId(null);
    setEditingFeedback(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingFeedback(null);
  };

  const handleDelete = (id: number) => {
    setFeedbacks((currentFeedbacks) =>
      currentFeedbacks.filter(
        (feedback) => feedback.id !== id,
      ),
    );

    if (editingId === id) {
      setEditingId(null);
      setEditingFeedback(null);
    }
  };

  const handleAddFeedback = () => {
    const newId =
      feedbacks.length > 0
        ? Math.max(
            ...feedbacks.map(
              (feedback) => feedback.id,
            ),
          ) + 1
        : 1;

    const newFeedback: Feedback = {
      id: newId,
      customer: "",
      rating: 5,
      feedback: "",
      status: "visible",
    };

    setFeedbacks((currentFeedbacks) => [
      newFeedback,
      ...currentFeedbacks,
    ]);

    setEditingId(newId);
    setEditingFeedback({ ...newFeedback });
  };

  return (
    <AdminPageLayout sectionTitle="Feedback Review">
      {/* ==========================================
          PAGE HEADER
      ========================================== */}
      <AdminPageHeader
        title="Our Feedbacks"
        description="Review customer ratings and manage feedback visibility."
      />

      {/* ==========================================
          SEARCH + FILTER + ACTION
      ========================================== */}
      <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 lg:max-w-[500px]">
          <AdminSearchBar
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Rating Filter */}
          <div className="relative">
            <select
              value={ratingFilter}
              onChange={(event) =>
                setRatingFilter(event.target.value)
              }
              className="
                h-9
                min-w-[150px]
                appearance-none
                rounded-lg
                border
                border-[var(--green-primary)]/20
                bg-white
                px-4
                pr-9
                text-[10px]
                font-extrabold
                uppercase
                tracking-[0.08em]
                text-[var(--green-dark)]
                outline-none
                transition-colors
                duration-200
                focus:border-[var(--green-primary)]
                focus:ring-2
                focus:ring-[var(--green-primary)]/10
              "
              aria-label="Filter by rating"
            >
              <option value="all">
                All Ratings
              </option>
              <option value="5">
                5 Stars
              </option>
              <option value="4">
                4 Stars
              </option>
              <option value="3">
                3 Stars
              </option>
              <option value="2">
                2 Stars
              </option>
              <option value="1">
                1 Star
              </option>
            </select>

            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--green-primary)]">
              <ChevronDownIcon />
            </span>
          </div>

          {/* Add Feedback */}
          <button
            type="button"
            onClick={handleAddFeedback}
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
            + Add Feedback
          </button>
        </div>
      </div>

      {/* ==========================================
          FEEDBACK TABLE
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
              Customer Experience
            </p>

            <h2 className="mt-1 font-serif text-[21px] font-semibold text-[var(--green-dark)]">
              Feedback Records
            </h2>
          </div>

          <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-[10px] font-bold text-[var(--text-secondary)]">
            {feedbacks.length} Reviews
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <AdminTable>
            <thead>
              <tr className="border-b border-[var(--border-light)] bg-[var(--surface-soft)]">
                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Customer Name
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Rating
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Feedback Text
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Visibility
                </th>

                <th className="whitespace-nowrap px-5 py-3 text-center text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredFeedbacks.length > 0 ? (
                filteredFeedbacks.map((feedback) => {
                  const isEditing =
                    editingId === feedback.id;

                  return (
                    <tr
                      key={feedback.id}
                      className="
                        border-b
                        border-[var(--border-light)]
                        last:border-0
                        transition-colors
                        duration-200
                        hover:bg-[var(--surface-soft)]
                      "
                    >
                      {/* Customer */}
                      <td className="px-5 py-4">
                        {isEditing &&
                        editingFeedback ? (
                          <input
                            type="text"
                            value={
                              editingFeedback.customer
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
                          <p className="text-[13px] font-semibold text-[var(--text-primary)]">
                            {feedback.customer}
                          </p>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="px-5 py-4">
                        {isEditing &&
                        editingFeedback ? (
                          <div className="relative">
                            <select
                              value={
                                editingFeedback.rating
                              }
                              onChange={(event) =>
                                updateEditingField(
                                  "rating",
                                  Number(
                                    event.target.value,
                                  ),
                                )
                              }
                              className="
                                h-9
                                min-w-[110px]
                                appearance-none
                                rounded-lg
                                border
                                border-[var(--green-primary)]/20
                                bg-white
                                px-3
                                pr-8
                                text-[11px]
                                font-semibold
                                text-[var(--text-primary)]
                                outline-none
                                focus:border-[var(--green-primary)]
                              "
                              aria-label="Rating"
                            >
                              <option value={5}>
                                5 Stars
                              </option>
                              <option value={4}>
                                4 Stars
                              </option>
                              <option value={3}>
                                3 Stars
                              </option>
                              <option value={2}>
                                2 Stars
                              </option>
                              <option value={1}>
                                1 Star
                              </option>
                            </select>

                            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--green-primary)]">
                              <ChevronDownIcon />
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="text-[15px] tracking-[1px] text-[var(--yellow-golden)]">
                              {"★".repeat(
                                feedback.rating,
                              )}
                            </span>

                            <span className="ml-1 text-[11px] font-semibold text-[var(--text-muted)]">
                              {feedback.rating}.0
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Feedback */}
                      <td className="max-w-[520px] px-5 py-4">
                        {isEditing &&
                        editingFeedback ? (
                          <textarea
                            value={
                              editingFeedback.feedback
                            }
                            onChange={(event) =>
                              updateEditingField(
                                "feedback",
                                event.target.value,
                              )
                            }
                            placeholder="Feedback text"
                            rows={3}
                            className={`${inputClasses} h-auto min-w-[300px] resize-none py-2 leading-5`}
                          />
                        ) : (
                          <p className="text-[12px] leading-5 text-[var(--text-secondary)]">
                            {feedback.feedback}
                          </p>
                        )}
                      </td>

                      {/* Visibility */}
                      <td className="px-5 py-4">
                        {isEditing &&
                        editingFeedback ? (
                          <div className="relative">
                            <select
                              value={
                                editingFeedback.status
                              }
                              onChange={(event) =>
                                updateEditingField(
                                  "status",
                                  event.target.value as FeedbackStatus,
                                )
                              }
                              className="
                                h-9
                                min-w-[110px]
                                appearance-none
                                rounded-lg
                                border
                                border-[var(--green-primary)]/20
                                bg-white
                                px-3
                                pr-8
                                text-[10px]
                                font-extrabold
                                uppercase
                                tracking-[0.06em]
                                text-[var(--text-primary)]
                                outline-none
                                focus:border-[var(--green-primary)]
                              "
                              aria-label="Feedback visibility"
                            >
                              <option value="visible">
                                Visible
                              </option>
                              <option value="hidden">
                                Hidden
                              </option>
                            </select>

                            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--green-primary)]">
                              <ChevronDownIcon />
                            </span>
                          </div>
                        ) : (
                          <AdminStatusBadge
                            status={feedback.status}
                          />
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
                                  handleEdit(feedback)
                                }
                                aria-label={`Edit feedback from ${feedback.customer}`}
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
                                  handleDelete(
                                    feedback.id,
                                  )
                                }
                                aria-label={`Delete feedback from ${feedback.customer}`}
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
                      No feedback found
                    </p>

                    <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                      Try a different search or rating
                      filter.
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

function ChevronDownIcon() {
  return (
    <svg
      width="13"
      height="13"
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