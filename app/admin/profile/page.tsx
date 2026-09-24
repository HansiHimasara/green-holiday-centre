"use client";

import { ChangeEvent, useRef, useState } from "react";

import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminProfileAvatar from "@/components/admin/AdminProfileAvatar";

type Profile = {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  lastLogin: string;
  status: "Active";
  photo: string | null;
};

const initialProfile: Profile = {
  fullName: "Super Admin",
  username: "super_admin_gh",
  email: "admin@greenholiday.lk",
  phone: "+94 77 123 4567",
  role: "System Administrator",
  lastLogin: "22 Jun 2026, 09:15 AM",
  status: "Active",
  photo: null,
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [editingProfile, setEditingProfile] =
    useState<Profile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputClasses =
    "w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-[13px] text-[var(--text-primary)] outline-none transition-colors duration-200 focus:border-[var(--green-primary)] focus:ring-2 focus:ring-[var(--green-primary)]/10";

  const handleEdit = () => {
    setEditingProfile(profile);
    setIsEditing(true);
    setMessage("");
  };

  const handleCancel = () => {
    setEditingProfile(profile);
    setIsEditing(false);
    setMessage("");
  };

  const handleSave = () => {
    if (
      !editingProfile.fullName.trim() ||
      !editingProfile.username.trim() ||
      !editingProfile.email.trim() ||
      !editingProfile.phone.trim()
    ) {
      setMessage("Please complete all profile fields.");
      return;
    }

    setProfile(editingProfile);
    setIsEditing(false);
    setMessage("Profile details updated successfully.");
  };

  const handleFieldChange = (
    field: keyof Profile,
    value: string | null,
  ) => {
    setEditingProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handlePhotoChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setEditingProfile((current) => ({
      ...current,
      photo: imageUrl,
    }));

    setMessage("");
  };

  const displayedProfile = isEditing
    ? editingProfile
    : profile;

  return (
    <AdminPageLayout sectionTitle="User Profile">
      <AdminPageHeader
        title="My Profile"
        description="Configure your account information and system profile."
      />

      <div className="mt-7 overflow-hidden rounded-xl border border-[var(--border-light)] bg-white shadow-[0_10px_30px_rgba(7,91,69,0.05)]">
        {/* Accent Strip */}
        <div className="flex h-1.5 w-full">
          <span className="flex-1 bg-[var(--green-primary)]" />
          <span className="flex-1 bg-[var(--yellow-golden)]" />
          <span className="flex-1 bg-[var(--sky-blue)]" />
        </div>

        <div className="px-6 py-6 md:px-8 md:py-7">
          {/* Section Heading */}
          <div className="border-b border-[var(--border-light)] pb-5">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--green-primary)]">
              Account
            </p>

            <h2 className="mt-1 font-serif text-[21px] font-semibold text-[var(--green-dark)]">
              Account Information
            </h2>

            <p className="mt-1 text-[12px] text-[var(--text-secondary)]">
              Your administrator account details and access information.
            </p>
          </div>

          {/* Profile Content */}
          <div className="mt-7 flex flex-col gap-8 md:flex-row">
            {/* Avatar */}
            <div className="flex w-full flex-col items-center md:w-[180px]">
              <div className="rounded-2xl border border-[var(--green-primary)]/15 bg-[var(--surface-soft)] p-4">
                {displayedProfile.photo ? (
                  <img
                    src={displayedProfile.photo}
                    alt={displayedProfile.fullName}
                    className="h-28 w-28 rounded-xl object-cover"
                  />
                ) : (
                  <AdminProfileAvatar
                    name={displayedProfile.fullName}
                    size="large"
                  />
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="
                  mt-4
                  rounded-lg
                  border
                  border-[var(--green-primary)]/25
                  bg-white
                  px-4
                  py-2
                  text-[10px]
                  font-extrabold
                  uppercase
                  tracking-[0.08em]
                  text-[var(--green-dark)]
                  transition-colors
                  duration-200
                  hover:border-[var(--green-primary)]
                  hover:bg-[var(--green-primary)]
                  hover:text-white
                "
              >
                Change Photo
              </button>
            </div>

            {/* Profile Information */}
            <div className="grid flex-1 grid-cols-1 gap-x-14 gap-y-6 sm:grid-cols-2">
              <ProfileField
                label="Full Name"
                value={displayedProfile.fullName}
                editing={isEditing}
                inputClasses={inputClasses}
                onChange={(value) =>
                  handleFieldChange("fullName", value)
                }
              />

              <ProfileField
                label="Username"
                value={displayedProfile.username}
                editing={isEditing}
                inputClasses={inputClasses}
                onChange={(value) =>
                  handleFieldChange("username", value)
                }
              />

              <ProfileField
                label="Email Address"
                value={displayedProfile.email}
                editing={isEditing}
                inputClasses={inputClasses}
                type="email"
                onChange={(value) =>
                  handleFieldChange("email", value)
                }
              />

              <ProfileField
                label="Phone Number"
                value={displayedProfile.phone}
                editing={isEditing}
                inputClasses={inputClasses}
                onChange={(value) =>
                  handleFieldChange("phone", value)
                }
              />

              <ProfileInfo
                label="Role"
                value={displayedProfile.role}
              />

              <ProfileInfo
                label="Last Login"
                value={displayedProfile.lastLogin}
              />

              {/* Account Status */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                  Account Status
                </p>

                <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-[var(--green-primary)]/[0.08] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.06em] text-[var(--green-primary)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--green-primary)]" />
                  {displayedProfile.status}
                </span>
              </div>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mt-6 rounded-lg border px-4 py-3 text-[12px] font-medium ${
                message.includes("successfully")
                  ? "border-[var(--green-primary)]/20 bg-[var(--success-bg)] text-[var(--green-primary)]"
                  : "border-red-200 bg-red-50 text-red-600"
              }`}
            >
              {message}
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 border-t border-[var(--border-light)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="
                    rounded-lg
                    border
                    border-[var(--border)]
                    bg-white
                    px-5
                    py-2.5
                    text-[10px]
                    font-extrabold
                    uppercase
                    tracking-[0.08em]
                    text-[var(--text-secondary)]
                    transition-colors
                    duration-200
                    hover:border-gray-400
                    hover:bg-gray-50
                    hover:text-[var(--text-primary)]
                  "
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <button
                  type="button"
                  onClick={handleSave}
                  className="
                    rounded-lg
                    border
                    border-[var(--green-primary)]
                    bg-[var(--green-primary)]
                    px-5
                    py-2.5
                    text-[10px]
                    font-extrabold
                    uppercase
                    tracking-[0.08em]
                    text-white
                    transition-colors
                    duration-200
                    hover:border-[var(--green-dark)]
                    hover:bg-[var(--green-dark)]
                  "
                >
                  Save Changes
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="
                    rounded-lg
                    border
                    border-[var(--green-primary)]
                    bg-[var(--green-primary)]
                    px-5
                    py-2.5
                    text-[10px]
                    font-extrabold
                    uppercase
                    tracking-[0.08em]
                    text-white
                    transition-colors
                    duration-200
                    hover:border-[var(--green-dark)]
                    hover:bg-[var(--green-dark)]
                  "
                >
                  Edit Profile Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
}

function ProfileField({
  label,
  value,
  editing,
  inputClasses,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  editing: boolean;
  inputClasses: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
        {label}
      </p>

      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`mt-2 ${inputClasses}`}
        />
      ) : (
        <p className="mt-2 text-[13px] font-semibold text-[var(--text-primary)]">
          {value}
        </p>
      )}
    </div>
  );
}

function ProfileInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
        {label}
      </p>

      <p className="mt-2 text-[13px] font-semibold text-[var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}