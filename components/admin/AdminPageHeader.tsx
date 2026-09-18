interface AdminPageHeaderProps {
  title: string;
  description?: string;
}

export default function AdminPageHeader({
  title,
  description,
}: AdminPageHeaderProps) {
  return (
    <div>
      <h1 className="font-serif text-[30px] font-semibold text-[var(--green-dark)]">
        {title}
      </h1>

      {description && (
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {description}
        </p>
      )}
    </div>
  );
}