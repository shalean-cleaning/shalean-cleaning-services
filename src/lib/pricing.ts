import type { Tables } from './types';

export interface Service {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  per_bedroom_price: number | null;
  per_bathroom_price: number | null;
  duration_minutes: number;
}

export interface ServiceExtra {
  id: string;
  name: string;
  description: string | null;
  price: number;
}

export interface PricingBreakdown {
  basePrice: number;
  bedroomPrice: number;
  bathroomPrice: number;
  extrasPrice: number;
  subtotal: number;
  serviceFee: number;
  total: number;
}

export interface BookingDetails {
  service: Service;
  bedrooms: number;
  bathrooms: number;
  selectedExtras: Array<{ id: string; quantity: number; price: number }>;
}

const SERVICE_FEE_PERCENTAGE = 0.1; // 10% service fee

export function calculatePricing(details: BookingDetails): PricingBreakdown {
  const { service, bedrooms, bathrooms, selectedExtras } = details;

  // Base service price
  const basePrice = service.base_price;

  // Per bedroom/bathroom pricing
  const bedroomPrice = (service.per_bedroom_price || 0) * bedrooms;
  const bathroomPrice = (service.per_bathroom_price || 0) * bathrooms;

  // Extras pricing
  const extrasPrice = selectedExtras.reduce(
    (total, extra) => total + (extra.price * extra.quantity),
    0
  );

  // Subtotal before service fee
  const subtotal = basePrice + bedroomPrice + bathroomPrice + extrasPrice;

  // Service fee (10% of subtotal)
  const serviceFee = subtotal * SERVICE_FEE_PERCENTAGE;

  // Final total
  const total = subtotal + serviceFee;

  return {
    basePrice,
    bedroomPrice,
    bathroomPrice,
    extrasPrice,
    subtotal,
    serviceFee,
    total,
  };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(price);
}

export function generateServiceSlug(serviceName: string): string {
  return serviceName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
