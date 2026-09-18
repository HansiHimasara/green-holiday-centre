interface BookingStepHeaderProps {
  title: string;
  step?: number;
  totalSteps?: number;
}

export default function BookingStepHeader({
  title,
  step = 1,
  totalSteps = 4,
}: BookingStepHeaderProps) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="flex items-end justify-between gap-6 border-b border-[var(--border-light)] pb-4">
      <h1 className="font-serif text-[24px] font-semibold text-[var(--green-dark)]">
        {title}
      </h1>

      <div className="w-[145px]">
        <div className="mb-2 text-right text-[11px] font-semibold text-[var(--green-primary)]">
          Step {step} of {totalSteps}
        </div>

        <div className="h-[3px] overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-[var(--green-primary)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}