"use client";

import { useBookingStore } from "@/features/booking/booking-store";
import { useBarbers } from "@/hooks/use-barbers";
import { BarberCard } from "@/components/booking/BarberCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SHOP_ID } from "@/lib/constants";

export function BarberSelectionStep() {
  const { data: barbers, isLoading, isError } = useBarbers(SHOP_ID);
  const { barber, setBarber, nextStep, prevStep } = useBookingStore();

  if (isLoading) return <StepSkeleton />;

  if (isError || !barbers) {
    return (
      <div className="text-center py-12 text-zinc-400">
        No se pudieron cargar los barberos. Intenta de nuevo.
      </div>
    );
  }

  if (barbers.length === 0) {
    return (
      <div className="text-center py-12 space-y-2">
        <p className="font-semibold text-zinc-700">Sin barberos disponibles</p>
        <p className="text-sm text-zinc-400">No hay barberos activos en este momento. Vuelve pronto.</p>
        <Button variant="outline" onClick={prevStep} className="mt-4">
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">¿Con quién quieres tu cita?</h2>
        <p className="text-sm text-zinc-500 mt-1">Elige a tu barbero de confianza.</p>
      </div>

      <div className="space-y-3">
        {barbers.map((b) => (
          <BarberCard
            key={b.id}
            barber={b}
            selected={barber?.id === b.id}
            onSelect={() => setBarber(b)}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Atrás
        </Button>
        <Button onClick={nextStep} disabled={!barber} className="flex-1" size="lg">
          Continuar
        </Button>
      </div>
    </div>
  );
}

function StepSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
  );
}
