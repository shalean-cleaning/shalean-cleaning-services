'use client';

import { PaystackConfig, PaystackResponse, PaymentData } from './paystack';

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => {
        openIframe: () => void;
      };
    };
  }
}

export class PaystackClient {
  private publicKey: string;

  constructor(publicKey: string) {
    this.publicKey = publicKey;
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Paystack can only be used in browser environment'));
        return;
      }

      if (window.PaystackPop) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      
      script.onload = () => {
        if (window.PaystackPop) {
          resolve();
        } else {
          reject(new Error('Failed to load Paystack script'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Paystack script'));
      };

      document.head.appendChild(script);
    });
  }

  async processPayment(paymentData: PaymentData): Promise<PaystackResponse> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      const config: PaystackConfig = {
        publicKey: this.publicKey,
        email: paymentData.customerEmail,
        amount: paymentData.amount * 100, // Convert to kobo (smallest currency unit)
        currency: paymentData.currency,
        reference: paymentData.reference,
        metadata: paymentData.metadata,
        callback: (response: PaystackResponse) => {
          resolve(response);
        },
        onClose: () => {
          reject(new Error('Payment was cancelled by user'));
        },
      };

      try {
        const handler = window.PaystackPop.setup(config);
        handler.openIframe();
      } catch (error) {
        reject(error);
      }
    });
  }

  generateReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `shalean_${timestamp}_${random}`;
  }

  formatAmount(amount: number, currency = 'NGN'): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
    }).format(amount);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 100000000; // Max 100M
  }
}
