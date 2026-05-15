"use client";

import { Service } from "@/lib/types";
import { cn, formatCurrency, formatDuration } from "@/lib/utils";
import { Check } from "lucide-react";

interface Props {
  service: Service;
  selected: boolean;
  onSelect: () => void;
}

export function ServiceCard({ service, selected, onSelect }: Props) {
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
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-zinc-900">{service.name}</p>
          {service.description && (
            <p className="text-sm text-zinc-500 mt-0.5 leading-relaxed">
              {service.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-zinc-400">{formatDuration(service.duration_minutes)}</span>
            <span className="font-semibold text-zinc-900">
              {formatCurrency(service.price, service.currency)}
            </span>
          </div>
        </div>
        <div
          className={cn(
            "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
            selected ? "border-amber-500 bg-amber-500" : "border-zinc-300"
          )}
        >
          {selected && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
    </button>
  );
}
