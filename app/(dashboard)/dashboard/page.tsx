import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getBookingsForDashboard } from "@/services/bookings";
import { SHOP_ID } from "@/lib/constants";
import { toDateString, formatTime, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BookingStatusBadge } from "@/components/dashboard/BookingStatusBadge";
import { BookingActionsSheet } from "@/components/dashboard/BookingActionsSheet";
import { CalendarDays } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const today = toDateString(new Date());
  const bookings = await getBookingsForDashboard(SHOP_ID, today).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Hoy</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{formatDate(today)}</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {bookings.length} {bookings.length === 1 ? "cita" : "citas"}
        </Badge>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <CalendarDays className="w-10 h-10 text-zinc-300" />
          <p className="font-medium text-zinc-500">Sin citas para hoy</p>
          <p className="text-sm text-zinc-400">Las nuevas reservas aparecerán aquí.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center gap-4 bg-white border border-zinc-200 rounded-lg px-4 py-3"
            >
              <div className="text-center min-w-12">
                <p className="text-sm font-semibold text-zinc-900">{formatTime(booking.start_time)}</p>
                <p className="text-xs text-zinc-400">{formatTime(booking.end_time)}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-900 truncate">{booking.client_name}</p>
                <p className="text-sm text-zinc-500 truncate">
                  {booking.service?.name} · {booking.barber?.name}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <BookingStatusBadge status={booking.status} />
                <BookingActionsSheet booking={booking} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
