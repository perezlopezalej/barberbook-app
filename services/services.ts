import { createClient } from "@/lib/supabase";
import { Service } from "@/lib/types";

export async function getActiveServices(shopId: string): Promise<Service[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("shop_id", shopId)
    .eq("is_active", true)
    .order("price");

  if (error) throw new Error(error.message);
  return data as Service[];
}

export async function getAllServices(shopId: string): Promise<Service[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("shop_id", shopId)
    .order("price");

  if (error) throw new Error(error.message);
  return data as Service[];
}

export async function createService(
  service: Omit<Service, "id" | "created_at">
): Promise<Service> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .insert(service)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Service;
}

export async function updateService(
  id: string,
  updates: Partial<Omit<Service, "id" | "shop_id" | "created_at">>
): Promise<Service> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Service;
}
