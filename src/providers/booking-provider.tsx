'use client';

import React, { createContext, useContext } from 'react';
import { useBookingState, type BookingState } from '@/hooks/useBookingState';

interface BookingContextType {
  bookingState: BookingState;
  updateBookingState: (updates: Partial<BookingState>) => void;
  resetBookingState: () => void;
  addExtra: (extra: { id: string; name: string; price: number }) => void;
  removeExtra: (extraId: string) => void;
  updateExtraQuantity: (extraId: string, quantity: number) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const bookingStateHook = useBookingState();

  return React.createElement(
    BookingContext.Provider,
    { value: bookingStateHook },
    children
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
