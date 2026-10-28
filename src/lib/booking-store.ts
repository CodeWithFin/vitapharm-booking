"use client";

// Simple in-memory booking cart — persisted to sessionStorage
export interface CartService {
  id: number;
  name: string;
  category: string;
  durationMinutes: number;
  price: number;
}

export interface BookingState {
  cart: CartService[];
  selectedDate: string | null;
  selectedTime: string | null;
  therapistId: number | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  otpVerified: boolean;
}

const STORAGE_KEY = "vitapharm_booking";

export function getBookingState(): BookingState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : emptyState();
  } catch {
    return emptyState();
  }
}

export function setBookingState(state: BookingState) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearBookingState() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

function emptyState(): BookingState {
  return {
    cart: [],
    selectedDate: null,
    selectedTime: null,
    therapistId: null,
    phone: null,
    firstName: null,
    lastName: null,
    otpVerified: false,
  };
}
