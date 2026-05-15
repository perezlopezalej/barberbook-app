import { createClient } from "@/lib/supabase";
import { Schedule } from "@/lib/types";

export async function getSchedulesByBarber(barberId: string): Promise<Schedule[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("schedules")
    .select("*")
    .eq("barber_id", barberId)
    .order("day_of_week");

  if (error) throw new Error(error.message);
  return data as Schedule[];
}
