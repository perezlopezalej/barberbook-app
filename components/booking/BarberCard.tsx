"use client";

import { Barber } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check } from "lucide-react";

interface Props {
  barber: Barber;
  selected: boolean;
  onSelect: () => void;
}

export function BarberCard({ barber, selected, onSelect }: Props) {
  const initials = barber.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left p-4 rounded-lg border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
        selected
          ? "border-amber-500 bg-amber-50"
          : "border-zinc-200 bg-white hover:border-zinc-300"
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 flex-shrink-0">
          {barber.avatar_url && <AvatarImage src={barber.avatar_url} alt={barber.name} />}
          <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-zinc-900">{barber.name}</p>
          {barber.bio && (
            <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed mt-0.5">
              {barber.bio}
            </p>
          )}
          {barber.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {barber.specialties.map((s) => (
                <span
                  key={s}
                  className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
            selected ? "border-amber-500 bg-amber-500" : "border-zinc-300"
          )}
        >
          {selected && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
    </button>
  );
}
