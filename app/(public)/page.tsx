import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Scissors, Clock, CalendarCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="border-b border-zinc-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-amber-500" />
            <span className="font-bold text-base tracking-tight">BarberBook</span>
          </div>
          <Link href="/book" className={cn(buttonVariants({ size: "sm" }))}>
            Reservar cita
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-sm font-medium px-3 py-1 rounded-full border border-amber-200">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            Reservas en línea 24/7
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 leading-tight">
            Tu barbería,<br />a un clic de distancia
          </h1>
          <p className="text-zinc-500 text-lg max-w-lg mx-auto">
            Reserva tu cita en segundos. Sin llamadas, sin esperas. Elige tu servicio, barbero y horario favorito.
          </p>
          <Link href="/book" className={cn(buttonVariants({ size: "lg" }), "text-base px-8")}>
            Reservar ahora
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-100 bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              icon: <CalendarCheck className="h-5 w-5 text-amber-500" />,
              title: "Reserva en 90 segundos",
              desc: "Elige servicio, barbero y horario. Sin registros, sin complicaciones.",
            },
            {
              icon: <Clock className="h-5 w-5 text-amber-500" />,
              title: "Siempre disponible",
              desc: "Reserva a cualquier hora del día desde tu teléfono o computadora.",
            },
            {
              icon: <Scissors className="h-5 w-5 text-amber-500" />,
              title: "Confirmación instantánea",
              desc: "Recibes un email de confirmación con todos los detalles de tu cita.",
            },
          ].map((f) => (
            <div key={f.title} className="space-y-2">
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="font-semibold text-zinc-900">{f.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-6 px-4 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} BarberBook
      </footer>
    </main>
  );
}
