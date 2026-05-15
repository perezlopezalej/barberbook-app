import { Badge } from "@/components/ui/badge";
import { BookingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Completada",
};

const STATUS_CLASSES: Record<BookingStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-zinc-100 text-zinc-500 border-zinc-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        STATUS_CLASSES[status]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
