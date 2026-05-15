"use client";

import { useRouter } from "next/navigation";
import { useBookingStore } from "@/features/booking/booking-store";
import { Button } from "@/components/ui/button";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { Separator } from "@/components/ui/separator";
import { SHOP_ID } from "@/lib/constants";
import { Loader2 } from "lucide-react";

export function ConfirmationStep() {
  const router = useRouter();
  const {
    service,
    barber,
    date,
    slot,
    clientName,
    clientEmail,
    clientPhone,
    isSubmitting,
    setSubmitting,
    setSlotConflict,
    goToStep,
    reset,
  } = useBookingStore();

  if (!service || !barber || !date || !slot) {
    return (
      <div className="text-center py-12 text-zinc-400 text-sm">
        Información incompleta. Vuelve al inicio.
      </div>
    );
  }

  async function handleConfirm() {
    if (!service || !barber || !date || !slot) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shop_id: SHOP_ID,
          barber_id: barber.id,
          service_id: service.id,
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone,
          date,
          start_time: slot.start_time,
          end_time: slot.end_time,
        }),
      });

      if (res.status === 409) {
        setSlotConflict(true);
        goToStep(4);
        return;
      }

      if (!res.ok) {
        throw new Error("Error al crear la reserva.");
      }

      const booking = await res.json();
      reset();
      router.push(`/book/success?id=${booking.id}`);
    } catch {
      // Non-conflict error — show generic message
      setSlotConflict(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Confirma tu cita</h2>
        <p className="text-sm text-zinc-500 mt-1">Revisa los detalles antes de confirmar.</p>
      </div>

      <BookingSummary service={service} barber={barber} date={date} slot={slot} />

      <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-3 text-sm">
        <p className="font-semibold text-zinc-900">Datos de contacto</p>
        <Separator />
        <Row label="Nombre" value={clientName} />
        <Row label="Email" value={clientEmail} />
        <Row label="Teléfono" value={clientPhone} />
      </div>

      <p className="text-xs text-zinc-400 text-center">
        Recibirás un email de confirmación con los detalles de tu cita.
      </p>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => goToStep(5)}
          disabled={isSubmitting}
          className="flex-1"
        >
          Atrás
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="flex-1"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Confirmando...
            </>
          ) : (
            "Confirmar reserva"
          )}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-zinc-500">{label}</span>
      <span className="text-zinc-700">{value}</span>
    </div>
  );
}
