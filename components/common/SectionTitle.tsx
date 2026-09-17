interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionTitle({
  title,
  subtitle,
  align = "center",
}: SectionTitleProps) {
  const alignment =
    align === "center" ? "text-center" : "text-left";

  return (
    <div className={alignment}>
      <h2 className="font-serif text-[30px] font-semibold text-[var(--green-dark)]">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-2 text-sm text-gray-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}