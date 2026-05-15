import { getAllBarbers } from "@/services/barbers";
import { SHOP_ID } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ManageBarberDialog } from "@/components/dashboard/ManageBarberDialog";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BarbersPage() {
  const barbers = await getAllBarbers(SHOP_ID).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Barberos</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Gestiona el equipo de profesionales.</p>
        </div>
        <ManageBarberDialog shopId={SHOP_ID} />
      </div>

      {barbers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <Users className="w-10 h-10 text-zinc-300" />
          <p className="font-medium text-zinc-500">Sin barberos aún</p>
          <p className="text-sm text-zinc-400">Añade tu primer barbero para empezar a recibir reservas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {barbers.map((barber) => {
            const initials = barber.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();
            return (
              <div
                key={barber.id}
                className="bg-white border border-zinc-200 rounded-lg p-4 flex items-start gap-3"
              >
                <Avatar className="h-10 w-10 flex-shrink-0">
                  {barber.avatar_url && (
                    <AvatarImage src={barber.avatar_url} alt={barber.name} />
                  )}
                  <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-zinc-900">{barber.name}</p>
                    <Badge variant={barber.is_active ? "default" : "secondary"} className="text-xs">
                      {barber.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  {barber.bio && (
                    <p className="text-sm text-zinc-500 mt-0.5 line-clamp-2">{barber.bio}</p>
                  )}
                  {barber.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {barber.specialties.map((s) => (
                        <span
                          key={s}
                          className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <ManageBarberDialog shopId={SHOP_ID} barber={barber} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
