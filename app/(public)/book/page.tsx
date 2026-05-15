"use client";

import { useBookingStore } from "@/features/booking/booking-store";
import { BookingProgressBar } from "@/components/booking/BookingProgressBar";
import { ServiceSelectionStep } from "@/components/booking/steps/ServiceSelectionStep";
import { BarberSelectionStep } from "@/components/booking/steps/BarberSelectionStep";
import { DateSelectionStep } from "@/components/booking/steps/DateSelectionStep";
import { SlotSelectionStep } from "@/components/booking/steps/SlotSelectionStep";
import { CustomerInfoStep } from "@/components/booking/steps/CustomerInfoStep";
import { ConfirmationStep } from "@/components/booking/steps/ConfirmationStep";
import { Scissors } from "lucide-react";
import Link from "next/link";

const STEP_LABELS = [
  "Servicio",
  "Barbero",
  "Fecha",
  "Horario",
  "Tus datos",
  "Confirmar",
];

export default function BookPage() {
  const step = useBookingStore((s) => s.step);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="border-b border-zinc-200 bg-white">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-amber-500" />
            <span className="font-bold text-base tracking-tight">BarberBook</span>
          </Link>
          <span className="text-sm text-zinc-400">
            Paso {step} de {STEP_LABELS.length}
          </span>
        </div>
      </nav>

      {/* Progress bar */}
      <BookingProgressBar currentStep={step} totalSteps={STEP_LABELS.length} />

      {/* Step label */}
      <div className="max-w-2xl mx-auto px-4 pt-8 w-full">
        <p className="text-sm font-medium text-amber-600 mb-1">
          Paso {step} — {STEP_LABELS[step - 1]}
        </p>
      </div>

      {/* Step content */}
      <div className="flex-1 max-w-2xl mx-auto px-4 py-4 pb-16 w-full">
        {step === 1 && <ServiceSelectionStep />}
        {step === 2 && <BarberSelectionStep />}
        {step === 3 && <DateSelectionStep />}
        {step === 4 && <SlotSelectionStep />}
        {step === 5 && <CustomerInfoStep />}
        {step === 6 && <ConfirmationStep />}
      </div>
    </div>
  );
}
