"use client";

import { Service, Barber, TimeSlot } from "@/lib/types";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface Props {
  service: Service;
  barber: Barber;
  date: string;
  slot: TimeSlot;
}

export function BookingSummary({ service, barber, date, slot }: Props) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-3 text-sm">
      <p className="font-semibold text-zinc-900">Resumen de tu cita</p>
      <Separator />
      <Row label="Servicio" value={service.name} />
      <Row label="Barbero" value={barber.name} />
      <Row label="Fecha" value={formatDate(date)} />
      <Row label="Hora" value={formatTime(slot.start_time)} />
      <Separator />
      <Row
        label="Total"
        value={formatCurrency(service.price, service.currency)}
        bold
      />
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-zinc-500">{label}</span>
      <span className={bold ? "font-semibold text-zinc-900" : "text-zinc-700"}>
        {value}
      </span>
    </div>
  );
}
