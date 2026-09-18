"use client";

import { useState } from "react";

import Input from "@/components/ui/Input";

type NightStop = {
  id: number;
  value: string;
};

export default function RoundTourNights() {
  const [nights, setNights] = useState<NightStop[]>([
    { id: 1, value: "" },
    { id: 2, value: "" },
    { id: 3, value: "" },
  ]);

  const addNight = () => {
    setNights((current) => [
      ...current,
      {
        id: Date.now(),
        value: "",
      },
    ]);
  };

  const removeNight = (id: number) => {
    // Keep at least the original 3 night fields.
    if (nights.length <= 3) return;

    setNights((current) => current.filter((night) => night.id !== id));
  };

  const updateNight = (id: number, value: string) => {
    setNights((current) =>
      current.map((night) =>
        night.id === id ? { ...night, value } : night
      )
    );
  };

  return (
    <div>
      <div className="space-y-5">
        {nights.map((night, index) => (
          <div key={night.id}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                Night {index + 1} Destination
              </span>

              {index >= 3 && (
                <button
                  type="button"
                  onClick={() => removeNight(night.id)}
                  className="text-xs font-semibold text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>

            <Input
              value={night.value}
              onChange={(event) =>
                updateNight(night.id, event.target.value)
              }
              placeholder={`Enter destination for night ${index + 1}`}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addNight}
        className="mt-5 inline-flex items-center gap-2 rounded-md border border-[var(--green-primary)] bg-white px-5 py-2.5 text-[13px] font-semibold text-[var(--green-primary)] transition-colors hover:bg-[#F1F6F1]"
      >
        <span className="text-lg leading-none">+</span>
        Add New Night
      </button>
    </div>
  );
}