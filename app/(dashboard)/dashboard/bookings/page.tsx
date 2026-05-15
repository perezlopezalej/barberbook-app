import { getAllBookingsForDashboard } from "@/services/bookings";
import { SHOP_ID } from "@/lib/constants";
import { BookingStatusBadge } from "@/components/dashboard/BookingStatusBadge";
import { BookingActionsSheet } from "@/components/dashboard/BookingActionsSheet";
import { formatDateShort, formatTime } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const bookings = await getAllBookingsForDashboard(SHOP_ID).catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Reservas</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Todas las citas de la barbería.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <CalendarDays className="w-10 h-10 text-zinc-300" />
          <p className="font-medium text-zinc-500">Sin reservas aún</p>
          <p className="text-sm text-zinc-400">Las reservas de los clientes aparecerán aquí.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  {["Fecha", "Hora", "Cliente", "Servicio", "Barbero", "Estado", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-700">
                      {formatDateShort(b.date)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-zinc-700">
                      {formatTime(b.start_time)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-zinc-900">{b.client_name}</p>
                      <p className="text-zinc-400 text-xs">{b.client_email}</p>
                    </td>
                    <td className="px-4 py-3 text-zinc-700 whitespace-nowrap">
                      {b.service?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-700 whitespace-nowrap">
                      {b.barber?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <BookingStatusBadge status={b.status} />
                    </td>
                    <td className="px-4 py-3">
                      <BookingActionsSheet booking={b} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
