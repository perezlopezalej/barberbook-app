"use client";

import { TimeSlot } from "@/lib/types";
import { cn, formatTime } from "@/lib/utils";

interface Props {
  slots: TimeSlot[];
  selected: TimeSlot | null;
  onSelect: (slot: TimeSlot) => void;
}

export function SlotGrid({ slots, selected, onSelect }: Props) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-10 text-zinc-400 text-sm">
        No hay horarios disponibles para este día.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((slot) => {
        const isSelected =
          selected?.start_time === slot.start_time;
        return (
          <button
            key={slot.start_time}
            disabled={!slot.is_available}
            onClick={() => slot.is_available && onSelect(slot)}
            className={cn(
              "py-2.5 px-3 rounded-lg text-sm font-medium border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[44px]",
              slot.is_available
                ? isSelected
                  ? "border-amber-500 bg-amber-500 text-white"
                  : "border-zinc-200 bg-white text-zinc-900 hover:border-amber-300"
                : "border-zinc-100 bg-zinc-50 text-zinc-300 cursor-not-allowed line-through"
            )}
          >
            {formatTime(slot.start_time)}
          </button>
        );
      })}
    </div>
  );
}
