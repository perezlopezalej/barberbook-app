"use client";

import { useQuery } from "@tanstack/react-query";
import { getActiveBarbers } from "@/services/barbers";

export function useBarbers(shopId: string) {
  return useQuery({
    queryKey: ["barbers", shopId],
    queryFn: () => getActiveBarbers(shopId),
    staleTime: 5 * 60 * 1000,
  });
}
