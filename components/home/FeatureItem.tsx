import type { ReactNode } from "react";

interface FeatureItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureItem({
  icon,
  title,
  description,
}: FeatureItemProps) {
  return (
    <div className="flex gap-4">
      {/* Circular feature icon */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#8BCB38] text-[var(--green-dark)]">
        {icon}
      </div>

      {/* Feature text */}
      <div>
        <h3 className="font-serif font-semibold text-[var(--green-dark)]">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}