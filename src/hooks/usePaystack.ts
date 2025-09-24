'use client';

import { useState, useCallback } from 'react';
import { PaystackClient } from '@/lib/paystack-client';
import type { PaymentData, PaymentResult, PaymentError } from '@/lib/paystack';

interface UsePaystackOptions {
  publicKey: string;
  onSuccess?: (result: PaymentResult) => void;
  onError?: (error: PaymentError) => void;
  onClose?: () => void;
}

export function usePaystack({ publicKey, onSuccess, onError, onClose }: UsePaystackOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<PaymentError | null>(null);
  const [paystackClient] = useState(() => new PaystackClient(publicKey));

  const initializePayment = useCallback(async (paymentData: PaymentData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Initialize payment with backend
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: paymentData.bookingId,
          amount: paymentData.amount,
          customerEmail: paymentData.customerEmail,
          customerName: paymentData.customerName,
          customerPhone: paymentData.customerPhone,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to initialize payment');
      }

      // Process payment with Paystack
      const paystackResponse = await paystackClient.processPayment(result.paymentData);

      if (paystackResponse.status === 'success') {
        // Verify payment with backend
        const verifyResponse = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reference: paystackResponse.reference,
            transactionId: paystackResponse.trans,
          }),
        });

        const verifyResult = await verifyResponse.json();

        if (verifyResult.success) {
          onSuccess?.(verifyResult);
        } else {
          const error: PaymentError = {
            code: 'VERIFICATION_FAILED',
            message: verifyResult.message || 'Payment verification failed',
          };
          setError(error);
          onError?.(error);
        }
      } else {
        const error: PaymentError = {
          code: 'PAYMENT_FAILED',
          message: paystackResponse.message || 'Payment failed',
        };
        setError(error);
        onError?.(error);
      }
    } catch (err) {
      const error: PaymentError = {
        code: 'PAYMENT_ERROR',
        message: err instanceof Error ? err.message : 'An unexpected error occurred',
        details: err,
      };
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [paystackClient, onSuccess, onError]);

  const processPayment = useCallback(async (paymentData: PaymentData): Promise<PaymentResult> => {
    return new Promise((resolve, reject) => {
      const handleSuccess = (result: PaymentResult) => {
        resolve(result);
      };

      const handleError = (error: PaymentError) => {
        reject(error);
      };

      initializePayment(paymentData)
        .then(() => {
          // Success/error handlers will be called by initializePayment
        })
        .catch((error) => {
          reject(error);
        });
    });
  }, [initializePayment]);

  const generateReference = useCallback(() => {
    return paystackClient.generateReference();
  }, [paystackClient]);

  const formatAmount = useCallback((amount: number, currency = 'NGN') => {
    return paystackClient.formatAmount(amount, currency);
  }, [paystackClient]);

  const validateEmail = useCallback((email: string) => {
    return paystackClient.validateEmail(email);
  }, [paystackClient]);

  const validateAmount = useCallback((amount: number) => {
    return paystackClient.validateAmount(amount);
  }, [paystackClient]);

  return {
    initializePayment,
    processPayment,
    generateReference,
    formatAmount,
    validateEmail,
    validateAmount,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
