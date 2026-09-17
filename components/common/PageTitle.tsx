interface PageTitleProps {
  title: string;
  description?: string;
}

export default function PageTitle({
  title,
  description,
}: PageTitleProps) {
  return (
    <div className="text-center">
      <h1 className="font-serif text-[38px] font-semibold text-[var(--green-dark)]">
        {title}
      </h1>

      {description && (
        <p className="mx-auto mt-3 max-w-[620px] text-[15px] leading-6 text-gray-500">
          {description}
        </p>
      )}
    </div>
  );
}