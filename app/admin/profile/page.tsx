import AdminPageLayout from "@/components/admin/AdminPageLayout";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminProfileAvatar from "@/components/admin/AdminProfileAvatar";
import AdminActionButton from "@/components/admin/AdminActionButton";

export default function AdminProfilePage() {
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
                <AdminProfileAvatar
                  name="Super Admin"
                  size="large"
                />
              </div>

              <button
                type="button"
                className="
                  mt-4
                  rounded-lg
                  border
                  border-[var(--green-primary)]/25
                  bg-white
                  px-4
                  py-2
                  text-[11px]
                  font-bold
                  text-[var(--green-dark)]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
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
              <ProfileInfo
                label="Full Name"
                value="Super Admin"
              />

              <ProfileInfo
                label="Username"
                value="super_admin_gh"
              />

              <ProfileInfo
                label="Email Address"
                value="admin@greenholiday.lk"
              />

              <ProfileInfo
                label="Phone Number"
                value="+94 77 123 4567"
              />

              <ProfileInfo
                label="Role"
                value="System Administrator"
              />

              <ProfileInfo
                label="Last Login"
                value="22 Jun 2026, 09:15 AM"
              />

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
                  Account Status
                </p>

                <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-[var(--green-primary)]/[0.08] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.06em] text-[var(--green-primary)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--green-primary)]" />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="mt-8 border-t border-[var(--border-light)] pt-6">
            <AdminActionButton variant="primary">
              Edit Profile Details
            </AdminActionButton>
          </div>
        </div>
      </div>
    </AdminPageLayout>
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