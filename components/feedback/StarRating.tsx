"use client";

import { useState } from "react";

interface StarRatingProps {
  value?: number;
  onChange?: (value: number) => void;
}

export default function StarRating({
  value = 5,
  onChange,
}: StarRatingProps) {
  // Stores the currently selected rating
  const [rating, setRating] = useState(value);

  const changeRating = (newRating: number) => {
    // Update local state
    setRating(newRating);

    // Send selected rating to parent component
    onChange?.(newRating);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Five clickable stars */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => changeRating(star)}
            className="text-[#8BCB38]"
            aria-label={`Rate ${star} stars`}
          >
            <svg
              viewBox="0 0 24 24"
              width="23"
              height="23"
              fill={
                star <= rating
                  ? "currentColor"
                  : "none"
              }
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5-4.7-4.6 6.5-.9L12 2.5Z" />
            </svg>
          </button>
        ))}
      </div>

      {/* Rating text */}
      <span className="text-sm font-semibold text-[var(--green-primary)]">
        {rating}.0 Excellent
      </span>
    </div>
  );
}