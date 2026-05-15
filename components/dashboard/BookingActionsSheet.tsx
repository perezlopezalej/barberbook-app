"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookingWithDetails, BookingStatus } from "@/lib/types";
import { updateBookingStatus } from "@/services/bookings";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { formatDate, formatTime, formatCurrency } from "@/lib/utils";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  booking: BookingWithDetails;
}

export function BookingActionsSheet({ booking }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<BookingStatus | null>(null);

  async function handleAction(status: BookingStatus) {
    setLoading(status);
    try {
      await updateBookingStatus(booking.id, status);
      toast.success(`Cita marcada como ${statusLabel(status)}.`);
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("No se pudo actualizar la cita. Intenta de nuevo.");
    } finally {
      setLoading(null);
    }
  }

  const canConfirm = booking.status === "pending";
  const canComplete = booking.status === "confirmed" || booking.status === "pending";
  const canCancel = booking.status !== "cancelled" && booking.status !== "completed";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="p-1.5 rounded-md hover:bg-zinc-100 transition-colors">
        <MoreHorizontal className="w-4 h-4 text-zinc-500" />
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Detalle de cita</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <BookingStatusBadge status={booking.status} />

          <div className="space-y-2 text-sm">
            <Row label="Cliente" value={booking.client_name} />
            <Row label="Email" value={booking.client_email} />
            <Row label="Teléfono" value={booking.client_phone} />
            <Separator />
            <Row label="Servicio" value={booking.service?.name ?? "—"} />
            <Row label="Barbero" value={booking.barber?.name ?? "—"} />
            <Row label="Fecha" value={formatDate(booking.date)} />
            <Row
              label="Horario"
              value={`${formatTime(booking.start_time)} – ${formatTime(booking.end_time)}`}
            />
            <Separator />
            <Row
              label="Total"
              value={formatCurrency(
                booking.service?.price ?? 0,
                booking.service?.currency ?? "MXN"
              )}
              bold
            />
          </div>

          <div className="space-y-2 pt-4">
            {canConfirm && (
              <ActionButton
                label="Confirmar cita"
                status="confirmed"
                loading={loading}
                variant="default"
                onClick={() => handleAction("confirmed")}
              />
            )}
            {canComplete && (
              <ActionButton
                label="Marcar como completada"
                status="completed"
                loading={loading}
                variant="outline"
                onClick={() => handleAction("completed")}
              />
            )}
            {canCancel && (
              <ActionButton
                label="Cancelar cita"
                status="cancelled"
                loading={loading}
                variant="outline"
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                onClick={() => handleAction("cancelled")}
              />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
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
      <span className={bold ? "font-semibold text-zinc-900" : "text-zinc-700 text-right"}>
        {value}
      </span>
    </div>
  );
}

function ActionButton({
  label,
  status,
  loading,
  variant,
  onClick,
  className,
}: {
  label: string;
  status: BookingStatus;
  loading: BookingStatus | null;
  variant: "default" | "outline";
  onClick: () => void;
  className?: string;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={loading !== null}
      variant={variant}
      className={`w-full ${className ?? ""}`}
    >
      {loading === status ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : null}
      {label}
    </Button>
  );
}

function statusLabel(status: BookingStatus): string {
  const labels: Record<BookingStatus, string> = {
    confirmed: "confirmada",
    completed: "completada",
    cancelled: "cancelada",
    pending: "pendiente",
  };
  return labels[status];
}
