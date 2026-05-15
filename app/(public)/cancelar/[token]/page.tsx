import Link from "next/link";
import { cancelBookingByToken, getBookingByToken } from "@/services/bookings";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/utils";
import { XCircle, CheckCircle2, Scissors, AlertCircle } from "lucide-react";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function CancelPage({ params }: Props) {
  const { token } = await params;

  const booking = await getBookingByToken(token);

  if (!booking) {
    return <ErrorPage message="No encontramos una reserva con ese enlace." />;
  }

  if (booking.status === "cancelled") {
    return <InfoPage message="Esta reserva ya fue cancelada." />;
  }

  if (booking.status === "completed") {
    return <InfoPage message="No se puede cancelar una cita ya completada." />;
  }

  const result = await cancelBookingByToken(token);

  if (!result.success) {
    return <ErrorPage message={result.error ?? "Error al cancelar la reserva."} />;
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
            <CheckCircle2 className="w-16 h-16 text-zinc-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Reserva cancelada</h1>
            <p className="text-zinc-500 mt-2 text-sm">
              Tu cita ha sido cancelada exitosamente.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4 text-left text-sm space-y-2">
            <p className="text-zinc-500">
              <span className="font-medium text-zinc-700">Servicio:</span> {booking.service?.name}
            </p>
            <p className="text-zinc-500">
              <span className="font-medium text-zinc-700">Barbero:</span> {booking.barber?.name}
            </p>
            <p className="text-zinc-500">
              <span className="font-medium text-zinc-700">Fecha:</span>{" "}
              {formatDate(booking.date)} — {formatTime(booking.start_time)}
            </p>
          </div>

          <Link href="/book" className={cn(buttonVariants())}>
            Hacer una nueva reserva
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorPage({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-sm">
        <XCircle className="w-12 h-12 text-red-400 mx-auto" />
        <p className="font-semibold text-zinc-900">{message}</p>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}

function InfoPage({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-sm">
        <AlertCircle className="w-12 h-12 text-zinc-400 mx-auto" />
        <p className="font-semibold text-zinc-900">{message}</p>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
