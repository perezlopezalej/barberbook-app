"use client";

import { useBookingStore } from "@/features/booking/booking-store";
import { useServices } from "@/hooks/use-services";
import { ServiceCard } from "@/components/booking/ServiceCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SHOP_ID } from "@/lib/constants";

export function ServiceSelectionStep() {
  const { data: services, isLoading, isError } = useServices(SHOP_ID);
  const { service, setService, nextStep } = useBookingStore();

  if (isLoading) return <StepSkeleton />;

  if (isError || !services) {
    return (
      <div className="text-center py-12 text-zinc-400">
        No se pudieron cargar los servicios. Intenta de nuevo.
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12 space-y-2">
        <p className="font-semibold text-zinc-700">Sin servicios disponibles</p>
        <p className="text-sm text-zinc-400">Vuelve pronto, estamos actualizando nuestros servicios.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">¿Qué servicio deseas?</h2>
        <p className="text-sm text-zinc-500 mt-1">Selecciona el servicio para tu cita.</p>
      </div>

      <div className="space-y-3">
        {services.map((s) => (
          <ServiceCard
            key={s.id}
            service={s}
            selected={service?.id === s.id}
            onSelect={() => setService(s)}
          />
        ))}
      </div>

      <Button
        onClick={nextStep}
        disabled={!service}
        className="w-full"
        size="lg"
      >
        Continuar
      </Button>
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
