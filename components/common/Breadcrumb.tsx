import Link from "next/link";

interface BreadcrumbProps {
  items: {
    label: string;
    href?: string;
  }[];
}

export default function Breadcrumb({
  items,
}: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className="flex items-center gap-3"
        >
          {item.href ? (
            <Link
              href={item.href}
              className="text-gray-500 hover:text-[var(--green-primary)]"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-[var(--green-dark)]">
              {item.label}
            </span>
          )}

          {index < items.length - 1 && (
            <span className="text-gray-400">
              ›
            </span>
          )}
        </div>
      ))}
    </div>
  );
}