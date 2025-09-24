/**
 * Environment validation utility
 * Ensures all required environment variables are present
 */

interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  paystack: {
    publicKey: string;
    secretKey: string;
  };
  resend: {
    apiKey: string;
  };
  app: {
    url: string;
    name: string;
  };
}

class EnvironmentValidator {
  private config: Partial<EnvironmentConfig> = {};

  constructor() {
    this.validate();
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
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || '';

    this.config.paystack = {
      publicKey: paystackPublicKey,
      secretKey: paystackSecretKey,
    };

    // Resend validation with fallbacks
    const resendApiKey = process.env.RESEND_API_KEY || '';
    if (typeof window === 'undefined' && !resendApiKey) {
      console.warn('RESEND_API_KEY is not set - email functionality will be disabled');
    }

    this.config.resend = {
      apiKey: resendApiKey,
    };

    // App configuration
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Shalean Cleaning Services';

    this.config.app = {
      url: appUrl,
      name: appName,
    };
  }

  public getConfig(): EnvironmentConfig {
    return this.config as EnvironmentConfig;
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

  public getResendConfig() {
    return this.config.resend;
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
    
    // Only check server-side secrets when on server
    if (typeof window === 'undefined') {
      if (!this.config.paystack?.secretKey) {
        errors.push('PAYSTACK_SECRET_KEY is required');
      }
      if (!this.config.resend?.apiKey) {
        errors.push('RESEND_API_KEY is required');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Create singleton instance
const envValidator = new EnvironmentValidator();

export default envValidator;
export type { EnvironmentConfig };
