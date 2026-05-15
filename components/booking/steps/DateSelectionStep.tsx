"use client";

import { useBookingStore } from "@/features/booking/booking-store";
import { DatePicker } from "@/components/booking/DatePicker";
import { Button } from "@/components/ui/button";

export function DateSelectionStep() {
  const { date, setDate, nextStep, prevStep } = useBookingStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">¿Qué día te viene bien?</h2>
        <p className="text-sm text-zinc-500 mt-1">Elige una fecha disponible en el calendario.</p>
      </div>

      <DatePicker
        selected={date}
        onSelect={setDate}
        maxDaysAhead={30}
      />

      <div className="flex gap-3">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Atrás
        </Button>
        <Button onClick={nextStep} disabled={!date} className="flex-1" size="lg">
          Continuar
        </Button>
      </div>
    </div>
  );
}
