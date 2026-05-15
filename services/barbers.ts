import { createClient } from "@/lib/supabase";
import { Barber } from "@/lib/types";

export async function getActiveBarbers(shopId: string): Promise<Barber[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("barbers")
    .select("*")
    .eq("shop_id", shopId)
    .eq("is_active", true)
    .order("name");

  if (error) throw new Error(error.message);
  return data as Barber[];
}

export async function getAllBarbers(shopId: string): Promise<Barber[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("barbers")
    .select("*")
    .eq("shop_id", shopId)
    .order("name");

  if (error) throw new Error(error.message);
  return data as Barber[];
}

export async function createBarber(
  barber: Omit<Barber, "id" | "created_at">
): Promise<Barber> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("barbers")
    .insert(barber)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Barber;
}

export async function updateBarber(
  id: string,
  updates: Partial<Omit<Barber, "id" | "shop_id" | "created_at">>
): Promise<Barber> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("barbers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Barber;
}
