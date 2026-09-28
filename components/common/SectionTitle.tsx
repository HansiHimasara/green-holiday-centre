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
  return (
    <div
      className={`w-full ${
        align === "center" ? "mx-auto text-center" : "text-left"
      }`}
    >
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