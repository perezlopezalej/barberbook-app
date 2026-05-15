import { getAllServices } from "@/services/services";
import { SHOP_ID } from "@/lib/constants";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ManageServiceDialog } from "@/components/dashboard/ManageServiceDialog";
import { Wrench } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await getAllServices(SHOP_ID).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Servicios</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Gestiona los servicios y precios.</p>
        </div>
        <ManageServiceDialog shopId={SHOP_ID} />
      </div>

      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <Wrench className="w-10 h-10 text-zinc-300" />
          <p className="font-medium text-zinc-500">Sin servicios aún</p>
          <p className="text-sm text-zinc-400">Añade los servicios que ofreces para recibir reservas.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                {["Servicio", "Duración", "Precio", "Estado", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-900">{service.name}</p>
                    {service.description && (
                      <p className="text-zinc-400 text-xs mt-0.5">{service.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-700 whitespace-nowrap">
                    {formatDuration(service.duration_minutes)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-zinc-900 whitespace-nowrap">
                    {formatCurrency(service.price, service.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={service.is_active ? "default" : "secondary"} className="text-xs">
                      {service.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <ManageServiceDialog shopId={SHOP_ID} service={service} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
