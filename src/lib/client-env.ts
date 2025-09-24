'use client';

/**
 * Client-side environment validation utility
 * Only validates client-side accessible environment variables
 */

interface ClientEnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  paystack: {
    publicKey: string;
  };
  app: {
    url: string;
    name: string;
  };
}

class ClientEnvironmentValidator {
  private config: Partial<ClientEnvironmentConfig> = {};

  constructor() {
    try {
      this.validate();
    } catch (error) {
      console.warn('Client environment validation failed:', error);
      // Don't throw during construction, just log the error
    }
  }

  private validate(): void {
    // Supabase validation with fallbacks
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    this.config.supabase = {
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
    };

    // Paystack validation with fallbacks
    const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

    this.config.paystack = {
      publicKey: paystackPublicKey,
    };

    // App configuration
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Shalean Cleaning Services';

    this.config.app = {
      url: appUrl,
      name: appName,
    };
  }

  public getConfig(): ClientEnvironmentConfig {
    return this.config as ClientEnvironmentConfig;
  }

  public isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  public isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  public isTest(): boolean {
    return process.env.NODE_ENV === 'test';
  }

  public getSupabaseConfig() {
    return this.config.supabase;
  }

  public getPaystackConfig() {
    return this.config.paystack;
  }

  public getAppConfig() {
    return this.config.app;
  }

  public validateEnvironment(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check if required environment variables are set
    if (!this.config.supabase?.url) {
      errors.push('NEXT_PUBLIC_SUPABASE_URL is required');
    }
    if (!this.config.supabase?.anonKey) {
      errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
    }
    if (!this.config.paystack?.publicKey) {
      errors.push('NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Create singleton instance
const clientEnvValidator = new ClientEnvironmentValidator();

// Export validateConfig function
export function validateConfig(): { isValid: boolean; errors: string[] } {
  return clientEnvValidator.validateEnvironment();
}

export default clientEnvValidator;
export type { ClientEnvironmentConfig };
