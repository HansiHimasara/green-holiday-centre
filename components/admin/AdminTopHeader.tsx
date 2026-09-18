interface AdminTopHeaderProps {
  sectionTitle: string;
}

export default function AdminTopHeader({
  sectionTitle,
}: AdminTopHeaderProps) {
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
        <div className="h-8 w-8 rounded-full bg-gray-200" />

        <span className="text-sm font-semibold text-[var(--text-primary)]">
          Super Admin
        </span>
      </div>
    </header>
  );
}