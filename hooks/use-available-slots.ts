"use client";

import { useQuery } from "@tanstack/react-query";
import { getSchedulesByBarber } from "@/services/schedules";
import { getBookingsByBarberAndDate } from "@/services/bookings";
import { calculateAvailableSlots } from "@/features/booking/slot-calculator";
import { TimeSlot } from "@/lib/types";

export function useAvailableSlots(
  barberId: string | null,
  date: string | null,
  serviceDuration: number
): { slots: TimeSlot[]; isLoading: boolean; isError: boolean } {
  const enabled = !!barberId && !!date && serviceDuration > 0;

  const schedulesQuery = useQuery({
    queryKey: ["schedules", barberId],
    queryFn: () => getSchedulesByBarber(barberId!),
    enabled,
    staleTime: 10 * 60 * 1000,
  });

  const bookingsQuery = useQuery({
    queryKey: ["bookings-by-date", barberId, date],
    queryFn: () => getBookingsByBarberAndDate(barberId!, date!),
    enabled,
    staleTime: 30 * 1000, // short TTL — slots change frequently
  });

  const isLoading = schedulesQuery.isLoading || bookingsQuery.isLoading;
  const isError = schedulesQuery.isError || bookingsQuery.isError;

  const slots =
    enabled && schedulesQuery.data && bookingsQuery.data
      ? calculateAvailableSlots(
          date!,
          serviceDuration,
          schedulesQuery.data,
          bookingsQuery.data
        )
      : [];

  return { slots, isLoading, isError };
}
