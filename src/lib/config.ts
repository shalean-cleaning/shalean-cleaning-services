/**
 * Application configuration utility
 * Provides centralized access to environment variables and app settings
 */

import envValidator from './env';
import clientEnvValidator from './client-env';

// Use client validator for client-side, server validator for server-side
const validator = typeof window !== 'undefined' ? clientEnvValidator : envValidator;

export const config = {
  // Environment info
  isDevelopment: validator.isDevelopment(),
  isProduction: validator.isProduction(),
  isTest: validator.isTest(),

  // Supabase configuration with fallbacks
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },

  // Paystack configuration with fallbacks
  paystack: {
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    secretKey: process.env.PAYSTACK_SECRET_KEY || '',
  },

  // Resend configuration with fallbacks
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
  },

  // App configuration with fallbacks
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Shalean Cleaning Services',
  },

  // Feature flags
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    debugMode: process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE === 'true',
    emailNotifications: !!process.env.RESEND_API_KEY,
  },

  // API endpoints
  api: {
    baseUrl: validator.isDevelopment() ? 'http://localhost:3000/api' : `${validator.getAppConfig()?.url || 'http://localhost:3000'}/api`,
    endpoints: {
      payments: {
        initialize: '/api/payments/initialize',
        verify: '/api/payments/verify',
      },
      bookings: {
        create: '/api/bookings',
        confirm: '/api/bookings/confirm',
        draft: '/api/bookings/draft',
      },
      services: '/api/services',
      regions: '/api/regions',
      suburbs: '/api/suburbs',
      cleaners: '/api/cleaners/availability',
    },
  },

  // Payment configuration
  payment: {
    currency: 'NGN',
    minAmount: 100, // Minimum amount in kobo (1 NGN)
    maxAmount: 100000000, // Maximum amount in kobo (1M NGN)
    serviceFeePercentage: 0.1, // 10% service fee
  },

  // Email configuration
  email: {
    from: process.env.EMAIL_FROM || 'noreply@shalean.com',
    replyTo: process.env.EMAIL_REPLY_TO || 'support@shalean.com',
    templates: {
      bookingConfirmation: 'booking-confirmation',
      paymentReceipt: 'payment-receipt',
      reminder: 'booking-reminder',
    },
  },

  // Security configuration
  security: {
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes in milliseconds
  },

  // Booking configuration
  booking: {
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 2,
    timeSlots: {
      start: '07:00',
      end: '13:00',
      interval: 60, // minutes
    },
    defaultDuration: 120, // minutes
  },

  // UI configuration
  ui: {
    itemsPerPage: 10,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
};

// Validation function
export function validateConfig(): { isValid: boolean; errors: string[] } {
  return validator.validateEnvironment();
}

// Helper functions
export function getApiUrl(endpoint: string): string {
  return `${config.api.baseUrl}${endpoint}`;
}

export function formatCurrency(amount: number, currency = config.payment.currency): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function isFeatureEnabled(feature: keyof typeof config.features): boolean {
  return config.features[feature];
}

export function getEnvironmentInfo(): string {
  if (config.isDevelopment) return 'development';
  if (config.isProduction) return 'production';
  if (config.isTest) return 'test';
  return 'unknown';
}

// Export default config
export default config;
