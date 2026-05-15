"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scissors, CalendarDays, Users, Wrench, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/use-auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Hoy", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/bookings", label: "Reservas", icon: CalendarDays },
  { href: "/dashboard/barbers", label: "Barberos", icon: Users },
  { href: "/dashboard/services", label: "Servicios", icon: Wrench },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  function isActive(item: (typeof NAV_ITEMS)[0]) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-col border-r border-zinc-200 bg-white h-screen sticky top-0">
        <div className="px-4 h-14 flex items-center border-b border-zinc-100">
          <Link href="/" className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-amber-500" />
            <span className="font-bold text-sm tracking-tight">BarberBook</span>
          </Link>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive(item)
                  ? "bg-amber-50 text-amber-700"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-2 pb-4">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-zinc-200 flex">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors",
              isActive(item) ? "text-amber-600" : "text-zinc-400"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
