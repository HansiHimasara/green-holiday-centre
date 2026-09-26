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
    <div className="mx-auto w-full max-w-[760px]">
      {eyebrow && (
        <span className="block w-full text-center text-sm font-semibold uppercase tracking-[0.18em] text-[var(--green-primary)]">
          {eyebrow}
        </span>
      )}

      <h1 className="mt-2 w-full text-center font-[var(--font-display)] text-[38px] font-semibold leading-tight text-[var(--green-dark)]">
        {title}
      </h1>

      {description && (
        <div className="mt-4 flex w-full justify-center">
          <p
            className="w-full max-w-[620px] text-[15px] leading-6 text-gray-500"
            style={{ textAlign: "center" }}
          >
            {description}
          </p>
        </div>
      )}
    </div>
  );
}