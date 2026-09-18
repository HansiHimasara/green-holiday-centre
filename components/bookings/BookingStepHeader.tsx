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
  return (
    <div className="flex items-center justify-between gap-6">
      <h1 className="font-serif text-[24px] font-bold text-[var(--green-dark)]">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        <span className="text-[13px] font-bold text-[var(--green-primary)]">
          Step {step} of {totalSteps}
        </span>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <span
              key={index}
              className={`h-[5px] rounded-full ${
                index < step
                  ? "w-5 bg-[var(--green-primary)]"
                  : "w-[5px] bg-[#D7DDD8]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}