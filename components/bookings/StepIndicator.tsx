interface StepIndicatorProps {
  current: number;
  total?: number;
}

export default function StepIndicator({
  current,
  total = 4,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Step text */}
      <span className="text-sm font-semibold text-[var(--green-primary)]">
        Step {current} of {total}
      </span>

      {/* Small progress bars */}
      <div className="flex items-center gap-1">
        {Array.from({ length: total }).map(
          (_, index) => {
            const stepNumber = index + 1;
            const isCompletedOrCurrent =
              stepNumber <= current;
            const isCurrent =
              stepNumber === current;

            return (
              <span
                key={stepNumber}
                className={`h-[5px] rounded-full ${
                  isCompletedOrCurrent
                    ? isCurrent
                      ? "w-6 bg-[var(--green-primary)]"
                      : "w-2 bg-[#BFDDBF]"
                    : "w-2 bg-[#E3E8E3]"
                }`}
              />
            );
          },
        )}
      </div>
    </div>
  );
}