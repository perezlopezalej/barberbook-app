"use client";

import { useBookingStore } from "@/features/booking/booking-store";
import { useAvailableSlots } from "@/hooks/use-available-slots";
import { SlotGrid } from "@/components/booking/SlotGrid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateShort } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export function SlotSelectionStep() {
  const { barber, service, date, slot, slotConflict, setSlot, nextStep, prevStep } =
    useBookingStore();

  const { slots, isLoading, isError } = useAvailableSlots(
    barber?.id ?? null,
    date,
    service?.duration_minutes ?? 30
  );

  if (isLoading) return <StepSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">¿A qué hora?</h2>
        <p className="text-sm text-zinc-500 mt-1">
          {date ? `Horarios disponibles el ${formatDateShort(date)}` : "Selecciona un horario."}
        </p>
      </div>

      {slotConflict && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>Ese horario ya fue reservado. Por favor elige otro.</p>
        </div>
      )}

      {isError ? (
        <div className="text-center py-8 text-zinc-400 text-sm">
          No se pudieron cargar los horarios. Intenta de nuevo.
        </div>
      ) : (
        <SlotGrid slots={slots} selected={slot} onSelect={setSlot} />
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Atrás
        </Button>
        <Button onClick={nextStep} disabled={!slot} className="flex-1" size="lg">
          Continuar
        </Button>
      </div>
    </div>
  );
}

function StepSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-11 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
