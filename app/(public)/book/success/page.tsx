import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, formatTime, formatCurrency } from "@/lib/utils";
import { CheckCircle2, Scissors } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function BookingSuccessPage({ searchParams }: Props) {
  const { id } = await searchParams;

  let booking = null;
  if (id) {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("bookings")
      .select(`*, barber:barbers(name), service:services(name, price, currency)`)
      .eq("id", id)
      .single();
    booking = data;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-zinc-200 bg-white">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-amber-500" />
            <span className="font-bold text-base tracking-tight">BarberBook</span>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">¡Cita confirmada!</h1>
            <p className="text-zinc-500 mt-2 text-sm">
              Te hemos enviado un email de confirmación con todos los detalles.
            </p>
          </div>

          {booking && (
            <div className="rounded-lg border border-zinc-200 bg-white p-4 text-left space-y-3 text-sm">
              <Row label="Servicio" value={booking.service?.name ?? "—"} />
              <Row label="Barbero" value={booking.barber?.name ?? "—"} />
              <Row label="Fecha" value={formatDate(booking.date)} />
              <Row label="Hora" value={formatTime(booking.start_time)} />
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
          )}

          <div className="flex flex-col gap-3">
            <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
              Volver al inicio
            </Link>
            <Link href="/book" className={cn(buttonVariants())}>
              Hacer otra reserva
            </Link>
          </div>
        </div>
      </div>
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
