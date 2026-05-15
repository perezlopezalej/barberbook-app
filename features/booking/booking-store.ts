"use client";

import { create } from "zustand";
import { Service, Barber, TimeSlot, BookingState } from "@/lib/types";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface BookingStore extends BookingState {
  step: Step;
  isSubmitting: boolean;
  slotConflict: boolean;

  setService: (service: Service) => void;
  setBarber: (barber: Barber) => void;
  setDate: (date: string) => void;
  setSlot: (slot: TimeSlot) => void;
  setClientInfo: (info: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
  }) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: Step) => void;
  setSubmitting: (value: boolean) => void;
  setSlotConflict: (value: boolean) => void;
  reset: () => void;
}

const initialState: BookingState & { step: Step; isSubmitting: boolean; slotConflict: boolean } = {
  step: 1,
  service: null,
  barber: null,
  date: null,
  slot: null,
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  isSubmitting: false,
  slotConflict: false,
};

export const useBookingStore = create<BookingStore>((set) => ({
  ...initialState,

  setService: (service) =>
    set({ service, barber: null, date: null, slot: null }),

  setBarber: (barber) =>
    set({ barber, date: null, slot: null }),

  setDate: (date) =>
    set({ date, slot: null }),

  setSlot: (slot) =>
    set({ slot, slotConflict: false }),

  setClientInfo: (info) =>
    set(info),

  nextStep: () =>
    set((state) => ({ step: Math.min(state.step + 1, 6) as Step })),

  prevStep: () =>
    set((state) => ({ step: Math.max(state.step - 1, 1) as Step })),

  goToStep: (step) => set({ step }),

  setSubmitting: (value) => set({ isSubmitting: value }),

  setSlotConflict: (value) => set({ slotConflict: value }),

  reset: () => set(initialState),
}));
