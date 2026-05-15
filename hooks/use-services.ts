"use client";

import { useQuery } from "@tanstack/react-query";
import { getActiveServices } from "@/services/services";

export function useServices(shopId: string) {
  return useQuery({
    queryKey: ["services", shopId],
    queryFn: () => getActiveServices(shopId),
    staleTime: 5 * 60 * 1000,
  });
}
