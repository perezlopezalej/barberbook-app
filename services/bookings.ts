import { createClient } from "@/lib/supabase";
import {
  Booking,
  BookingWithDetails,
  BookingStatus,
  CreateBookingPayload,
} from "@/lib/types";

export class SlotTakenError extends Error {
  constructor() {
    super("Este horario ya fue reservado. Por favor elige otro.");
    this.name = "SlotTakenError";
  }
}

export async function createBooking(
  payload: CreateBookingPayload
): Promise<Booking> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookings")
    .insert(payload)
    .select()
    .single();

  if (error) {
    // Postgres unique constraint violation code
    if (error.code === "23505") throw new SlotTakenError();
    throw new Error(error.message);
  }
  return data as Booking;
}

export async function getBookingsByBarberAndDate(
  barberId: string,
  date: string // "YYYY-MM-DD"
): Promise<Booking[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("barber_id", barberId)
    .eq("date", date)
    .not("status", "eq", "cancelled");

  if (error) throw new Error(error.message);
  return data as Booking[];
}

export async function getBookingsForDashboard(
  shopId: string,
  date: string
): Promise<BookingWithDetails[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      barber:barbers(id, name, avatar_url),
      service:services(id, name, duration_minutes, price, currency)
    `)
    .eq("shop_id", shopId)
    .eq("date", date)
    .not("status", "eq", "cancelled")
    .order("start_time");

  if (error) throw new Error(error.message);
  return data as BookingWithDetails[];
}

export async function getAllBookingsForDashboard(
  shopId: string,
  filters?: { date?: string; status?: BookingStatus; barber_id?: string }
): Promise<BookingWithDetails[]> {
  const supabase = createClient();
  let query = supabase
    .from("bookings")
    .select(`
      *,
      barber:barbers(id, name, avatar_url),
      service:services(id, name, duration_minutes, price, currency)
    `)
    .eq("shop_id", shopId)
    .order("date", { ascending: false })
    .order("start_time");

  if (filters?.date) query = query.eq("date", filters.date);
  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.barber_id) query = query.eq("barber_id", filters.barber_id);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as BookingWithDetails[];
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function cancelBookingByToken(
  token: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("id, status")
    .eq("cancellation_token", token)
    .single();

  if (fetchError || !booking) return { success: false, error: "Reserva no encontrada." };
  if (booking.status === "cancelled") return { success: false, error: "Esta reserva ya fue cancelada." };
  if (booking.status === "completed") return { success: false, error: "No se puede cancelar una cita completada." };

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", booking.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getBookingByToken(token: string): Promise<BookingWithDetails | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      barber:barbers(id, name, avatar_url),
      service:services(id, name, duration_minutes, price, currency)
    `)
    .eq("cancellation_token", token)
    .single();

  if (error) return null;
  return data as BookingWithDetails;
}
