"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isPast,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, toDateString, capitalize } from "@/lib/utils";

interface Props {
  selected: string | null; // "YYYY-MM-DD"
  onSelect: (date: string) => void;
  isDateAvailable?: (date: string) => boolean;
  maxDaysAhead?: number;
}

export function DatePicker({
  selected,
  onSelect,
  isDateAvailable,
  maxDaysAhead = 30,
}: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + maxDaysAhead);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const canGoPrev = currentMonth > startOfMonth(today);
  const canGoNext =
    startOfMonth(addMonths(currentMonth, 1)) <= startOfMonth(maxDate);

  return (
    <div className="bg-white rounded-lg border border-zinc-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => canGoPrev && setCurrentMonth(subMonths(currentMonth, 1))}
          disabled={!canGoPrev}
          className="p-1.5 rounded-md hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <p className="font-semibold text-zinc-900 text-sm">
          {capitalize(format(currentMonth, "MMMM yyyy", { locale: es }))}
        </p>
        <button
          onClick={() => canGoNext && setCurrentMonth(addMonths(currentMonth, 1))}
          disabled={!canGoNext}
          className="p-1.5 rounded-md hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 mb-1">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-xs text-zinc-400 py-1 font-medium">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-px">
        {days.map((day) => {
          const dateStr = toDateString(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selected === dateStr;
          const isPastDay = isPast(day) && !isToday(day);
          const isBeyondMax = day > maxDate;
          const available = isDateAvailable ? isDateAvailable(dateStr) : true;
          const disabled = isPastDay || isBeyondMax || !available || !isCurrentMonth;

          return (
            <button
              key={dateStr}
              onClick={() => !disabled && onSelect(dateStr)}
              disabled={disabled}
              className={cn(
                "aspect-square rounded-md text-sm flex items-center justify-center transition-all min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                !isCurrentMonth && "invisible",
                disabled && "text-zinc-300 cursor-not-allowed",
                !disabled && !isSelected && "hover:bg-amber-50 text-zinc-700",
                isToday(day) && !isSelected && "font-bold text-amber-600",
                isSelected && "bg-amber-500 text-white font-semibold"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
