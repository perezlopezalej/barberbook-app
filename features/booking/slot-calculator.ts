import { TimeSlot, Schedule, Booking } from "@/lib/types";
import { addMinutes, timeToMinutes, getDayOfWeek } from "@/lib/utils";

/**
 * Generates all possible slots for a barber on a given date,
 * then marks which ones are taken by existing bookings.
 *
 * Pure function — no side effects, no API calls.
 */
export function calculateAvailableSlots(
  date: string,         // "YYYY-MM-DD"
  serviceDuration: number, // minutes
  schedules: Schedule[],
  existingBookings: Booking[] // only active bookings for this barber on this date
): TimeSlot[] {
  const dayOfWeek = getDayOfWeek(date);
  const schedule = schedules.find(
    (s) => s.day_of_week === dayOfWeek && s.is_available
  );

  if (!schedule) return [];

  const slots: TimeSlot[] = [];
  const scheduleEnd = timeToMinutes(schedule.end_time);

  let cursor = schedule.start_time;

  while (true) {
    const slotStart = timeToMinutes(cursor);
    const slotEnd = slotStart + serviceDuration;

    if (slotEnd > scheduleEnd) break;

    const endStr = addMinutes(cursor, serviceDuration);
    const isTaken = existingBookings.some(
      (b) => overlaps(cursor, endStr, b.start_time, b.end_time)
    );

    slots.push({ start_time: cursor, end_time: endStr, is_available: !isTaken });
    cursor = addMinutes(cursor, 30); // 30-minute slot grid
  }

  return slots;
}

// Two intervals [aStart, aEnd) and [bStart, bEnd) overlap when aStart < bEnd && aEnd > bStart
function overlaps(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  return (
    timeToMinutes(aStart) < timeToMinutes(bEnd) &&
    timeToMinutes(aEnd) > timeToMinutes(bStart)
  );
}

/**
 * Returns true if a barber has at least one available slot on a given date.
 * Used to disable non-bookable days on the calendar.
 */
export function hasAvailableSlots(
  date: string,
  serviceDuration: number,
  schedules: Schedule[],
  existingBookings: Booking[]
): boolean {
  const slots = calculateAvailableSlots(date, serviceDuration, schedules, existingBookings);
  return slots.some((s) => s.is_available);
}
