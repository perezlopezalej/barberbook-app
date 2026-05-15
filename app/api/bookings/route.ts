import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { buildConfirmationEmail } from "@/lib/email-templates";
import { Resend } from "resend";
import { CreateBookingPayload } from "@/lib/types";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const payload: CreateBookingPayload = await request.json();

    // Validate required fields
    const required = [
      "shop_id", "barber_id", "service_id",
      "client_name", "client_email", "client_phone",
      "date", "start_time", "end_time",
    ] as const;

    for (const field of required) {
      if (!payload[field]) {
        return NextResponse.json(
          { error: `Campo requerido: ${field}` },
          { status: 400 }
        );
      }
    }

    const supabase = await createServerSupabaseClient();

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert(payload)
      .select(`
        *,
        barber:barbers(name),
        service:services(name, price, currency)
      `)
      .single();

    if (bookingError) {
      if (bookingError.code === "23505") {
        return NextResponse.json(
          { error: "slot_taken", message: "Este horario ya fue reservado." },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: bookingError.message }, { status: 500 });
    }

    // Send confirmation email (non-blocking — failure doesn't break booking)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    try {
      await resend.emails.send({
        from: "BarberBook <confirmaciones@resend.dev>",
        to: [payload.client_email],
        subject: `✂ Tu cita está confirmada — ${payload.date}`,
        html: buildConfirmationEmail({
          clientName: payload.client_name,
          serviceName: booking.service?.name ?? "Servicio",
          barberName: booking.barber?.name ?? "Barbero",
          date: payload.date,
          startTime: payload.start_time,
          price: booking.service?.price ?? 0,
          currency: booking.service?.currency ?? "MXN",
          cancellationToken: booking.cancellation_token,
          appUrl,
        }),
      });
    } catch (emailErr) {
      // Log but don't fail — booking is already created
      console.error("Email send failed:", emailErr);
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    console.error("Booking API error:", err);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
