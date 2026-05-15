export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Shop {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  logo_url: string | null;
  timezone: string;
  created_at: string;
}

export interface Barber {
  id: string;
  shop_id: string;
  name: string;
  bio: string;
  avatar_url: string | null;
  specialties: string[];
  is_active: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  currency: string;
  is_active: boolean;
  created_at: string;
}

// day_of_week: 0 = Sunday … 6 = Saturday
export interface Schedule {
  id: string;
  barber_id: string;
  day_of_week: number;
  start_time: string; // "09:00"
  end_time: string;   // "18:00"
  is_available: boolean;
}

export interface Booking {
  id: string;
  shop_id: string;
  barber_id: string;
  service_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  date: string;       // "YYYY-MM-DD"
  start_time: string; // "10:00"
  end_time: string;   // "10:30"
  status: BookingStatus;
  notes: string | null;
  cancellation_token: string;
  created_at: string;
  updated_at: string;
}

// Joined types used in UI
export interface BookingWithDetails extends Booking {
  barber: Pick<Barber, "id" | "name" | "avatar_url">;
  service: Pick<Service, "id" | "name" | "duration_minutes" | "price" | "currency">;
}

// Time slot computed at runtime, never persisted
export interface TimeSlot {
  start_time: string; // "10:00"
  end_time: string;   // "10:30"
  is_available: boolean;
}

// Booking wizard state (in Zustand, not persisted to DB)
export interface BookingState {
  service: Service | null;
  barber: Barber | null;
  date: string | null;   // "YYYY-MM-DD"
  slot: TimeSlot | null;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

// Payload sent to the service layer to create a booking
export interface CreateBookingPayload {
  shop_id: string;
  barber_id: string;
  service_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  date: string;
  start_time: string;
  end_time: string;
}
