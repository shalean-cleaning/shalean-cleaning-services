'use client';

import { useState, useCallback, useEffect } from 'react';
import { calculatePricing, type PricingBreakdown, type Service } from '@/lib/pricing';
import type { AuthUser } from '@/lib/auth';

export interface BookingState {
  service?: Service;
  bedrooms: number;
  bathrooms: number;
  address?: string;
  suburb?: {
    id: string;
    name: string;
    region: {
      id: string;
      name: string;
    };
  };
  scheduledDate?: Date;
  scheduledTime?: string;
  selectedExtras: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  cleaner?: {
    id: string;
    profiles: {
      first_name: string | null;
      last_name: string | null;
    } | null;
  };
  pricing: PricingBreakdown;
}

const initialBookingState: BookingState = {
  bedrooms: 0,
  bathrooms: 0,
  selectedExtras: [],
  pricing: {
    basePrice: 0,
    bedroomPrice: 0,
    bathroomPrice: 0,
    extrasPrice: 0,
    subtotal: 0,
    serviceFee: 0,
    total: 0,
  },
};

export function useBookingState() {
  const [bookingState, setBookingState] = useState<BookingState>(initialBookingState);

  // Load booking state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('booking-state');
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          // Convert date strings back to Date objects
          if (parsedState.scheduledDate) {
            parsedState.scheduledDate = new Date(parsedState.scheduledDate);
          }
          setBookingState(parsedState);
        } catch (error) {
          console.error('Error loading booking state from localStorage:', error);
        }
      }
    }
  }, []);

  // Save booking state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('booking-state', JSON.stringify(bookingState));
    }
  }, [bookingState]);

  const updateBookingState = useCallback((updates: Partial<BookingState>) => {
    setBookingState(prevState => {
      const newState = { ...prevState, ...updates };
      
      // Recalculate pricing if service, bedrooms, bathrooms, or extras changed
      if (updates.service || updates.bedrooms !== undefined || updates.bathrooms !== undefined || updates.selectedExtras) {
        if (newState.service) {
          const pricing = calculatePricing({
            service: newState.service,
            bedrooms: newState.bedrooms,
            bathrooms: newState.bathrooms,
            selectedExtras: newState.selectedExtras.map(extra => ({
              id: extra.id,
              quantity: extra.quantity,
              price: extra.price,
            })),
          });
          newState.pricing = pricing;
        }
      }
      
      return newState;
    });
  }, []);

  const resetBookingState = useCallback(() => {
    setBookingState(initialBookingState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('booking-state');
    }
  }, []);

  const addExtra = useCallback((extra: { id: string; name: string; price: number }) => {
    setBookingState(prevState => {
      const existingExtra = prevState.selectedExtras.find(e => e.id === extra.id);
      let newExtras;
      
      if (existingExtra) {
        newExtras = prevState.selectedExtras.map(e =>
          e.id === extra.id ? { ...e, quantity: e.quantity + 1 } : e
        );
      } else {
        newExtras = [...prevState.selectedExtras, { ...extra, quantity: 1 }];
      }
      
      const newState = { ...prevState, selectedExtras: newExtras };
      
      if (newState.service) {
        const pricing = calculatePricing({
          service: newState.service,
          bedrooms: newState.bedrooms,
          bathrooms: newState.bathrooms,
          selectedExtras: newExtras.map(e => ({
            id: e.id,
            quantity: e.quantity,
            price: e.price,
          })),
        });
        newState.pricing = pricing;
      }
      
      return newState;
    });
  }, []);

  const removeExtra = useCallback((extraId: string) => {
    setBookingState(prevState => {
      const existingExtra = prevState.selectedExtras.find(e => e.id === extraId);
      let newExtras;
      
      if (existingExtra && existingExtra.quantity > 1) {
        newExtras = prevState.selectedExtras.map(e =>
          e.id === extraId ? { ...e, quantity: e.quantity - 1 } : e
        );
      } else {
        newExtras = prevState.selectedExtras.filter(e => e.id !== extraId);
      }
      
      const newState = { ...prevState, selectedExtras: newExtras };
      
      if (newState.service) {
        const pricing = calculatePricing({
          service: newState.service,
          bedrooms: newState.bedrooms,
          bathrooms: newState.bathrooms,
          selectedExtras: newExtras.map(e => ({
            id: e.id,
            quantity: e.quantity,
            price: e.price,
          })),
        });
        newState.pricing = pricing;
      }
      
      return newState;
    });
  }, []);

  const updateExtraQuantity = useCallback((extraId: string, quantity: number) => {
    if (quantity <= 0) {
      removeExtra(extraId);
      return;
    }
    
    setBookingState(prevState => {
      const newExtras = prevState.selectedExtras.map(e =>
        e.id === extraId ? { ...e, quantity } : e
      );
      
      const newState = { ...prevState, selectedExtras: newExtras };
      
      if (newState.service) {
        const pricing = calculatePricing({
          service: newState.service,
          bedrooms: newState.bedrooms,
          bathrooms: newState.bathrooms,
          selectedExtras: newExtras.map(e => ({
            id: e.id,
            quantity: e.quantity,
            price: e.price,
          })),
        });
        newState.pricing = pricing;
      }
      
      return newState;
    });
  }, [removeExtra]);

  return {
    bookingState,
    updateBookingState,
    resetBookingState,
    addExtra,
    removeExtra,
    updateExtraQuantity,
  };
}
