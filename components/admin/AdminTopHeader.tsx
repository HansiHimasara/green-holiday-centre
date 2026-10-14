import Image from "next/image";

type UserRole =
  | "ADMIN"
  | "SUPER_ADMIN";

interface AdminTopHeaderProps {
  sectionTitle: string;
  adminName: string;
  adminRole: UserRole;
  adminImage?: string | null;
}

export default function AdminTopHeader({
  sectionTitle,
  adminName,
  adminRole,
  adminImage,
}: AdminTopHeaderProps) {
  const roleLabel =
    adminRole === "SUPER_ADMIN"
      ? "Super Admin"
      : "Admin";

  const initials =
    adminName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) =>
        name.charAt(0).toUpperCase()
      )
      .join("");

  return (
    <header className="flex h-[64px] items-center justify-between border-b border-[var(--border-light)] bg-white px-10">
      <div className="flex items-center gap-3">
        <h2 className="font-serif text-xl font-semibold text-[var(--green-dark)]">
          Green Holiday
        </h2>

        <div className="h-6 w-px bg-gray-300" />

        <span className="text-sm text-[var(--text-secondary)]">
          {sectionTitle}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--green-primary)]/10 text-xs font-bold text-[var(--green-primary)]">
          {adminImage ? (
            <Image
              src={adminImage}
              alt={`${adminName} profile photo`}
              width={36}
              height={36}
              unoptimized
              className="h-9 w-9 object-cover"
            />
          ) : (
            initials || "A"
          )}
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {adminName}
          </p>

          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            {roleLabel}
          </p>
        </div>
      </div>
    </header>
  );
}
