interface PageTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export default function PageTitle({
  eyebrow,
  title,
  description,
}: PageTitleProps) {
  return (
    <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
      {eyebrow && (
        <span className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--green-primary)]">
          {eyebrow}
        </span>
      )}

      <h1 className="font-serif text-[38px] font-semibold leading-tight text-[var(--green-dark)]">
        {title}
      </h1>

      {description && (
        <p className="mx-auto mt-4 max-w-[620px] text-center text-[15px] leading-6 text-gray-500">
          {description}
        </p>
      )}
    </div>
  );
}