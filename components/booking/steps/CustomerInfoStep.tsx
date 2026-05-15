"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBookingStore } from "@/features/booking/booking-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookingSummary } from "@/components/booking/BookingSummary";

const schema = z.object({
  clientName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  clientEmail: z.string().email("Ingresa un email válido"),
  clientPhone: z
    .string()
    .min(8, "Ingresa un teléfono válido")
    .regex(/^[\d\s+()-]+$/, "Solo números y caracteres telefónicos"),
});

type FormData = z.infer<typeof schema>;

export function CustomerInfoStep() {
  const { service, barber, date, slot, clientName, clientEmail, clientPhone, setClientInfo, nextStep, prevStep } =
    useBookingStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { clientName, clientEmail, clientPhone },
  });

  function onSubmit(data: FormData) {
    setClientInfo(data);
    nextStep();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Tus datos de contacto</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Te enviaremos la confirmación por email.
        </p>
      </div>

      {service && barber && date && slot && (
        <BookingSummary service={service} barber={barber} date={date} slot={slot} />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="clientName">Nombre completo</Label>
          <Input
            id="clientName"
            placeholder="Juan García"
            {...register("clientName")}
          />
          {errors.clientName && (
            <p className="text-xs text-red-500">{errors.clientName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="clientEmail">Email</Label>
          <Input
            id="clientEmail"
            type="email"
            placeholder="juan@ejemplo.com"
            {...register("clientEmail")}
          />
          {errors.clientEmail && (
            <p className="text-xs text-red-500">{errors.clientEmail.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="clientPhone">Teléfono</Label>
          <Input
            id="clientPhone"
            type="tel"
            placeholder="+52 55 1234 5678"
            {...register("clientPhone")}
          />
          {errors.clientPhone && (
            <p className="text-xs text-red-500">{errors.clientPhone.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
            Atrás
          </Button>
          <Button type="submit" className="flex-1" size="lg">
            Revisar cita
          </Button>
        </div>
      </form>
    </div>
  );
}
