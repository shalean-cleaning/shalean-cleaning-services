'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Loader2, CreditCard, XCircle } from 'lucide-react';
import { usePaystack } from '@/hooks/usePaystack';
import { useBooking } from '@/providers/booking-provider';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/lib/pricing';
import type { PaymentData, PaymentResult, PaymentError } from '@/lib/paystack';

interface PaymentFormProps {
  onPaymentSuccess: (result: PaymentResult) => void;
  onPaymentError: (error: PaymentError) => void;
}

export function PaymentForm({ onPaymentSuccess, onPaymentError }: PaymentFormProps) {
  const { bookingState } = useBooking();
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

  const {
    initializePayment,
    formatAmount,
    validateEmail,
    validateAmount,
    isLoading,
    error,
    clearError,
  } = usePaystack({
    publicKey: paystackPublicKey,
    onSuccess: (result) => {
      setIsProcessing(false);
      onPaymentSuccess(result);
    },
    onError: (error) => {
      setIsProcessing(false);
      onPaymentError(error);
    },
    onClose: () => {
      setIsProcessing(false);
    },
  });

  const handlePayment = async () => {
    if (!bookingState.service) {
      onPaymentError({
        code: 'MISSING_SERVICE',
        message: 'Please select a service before proceeding with payment',
      });
      return;
    }

    if (!email || !name) {
      onPaymentError({
        code: 'MISSING_INFO',
        message: 'Please provide your email and name',
      });
      return;
    }

    if (!validateEmail(email)) {
      onPaymentError({
        code: 'INVALID_EMAIL',
        message: 'Please provide a valid email address',
      });
      return;
    }

    if (!validateAmount(bookingState.pricing.total)) {
      onPaymentError({
        code: 'INVALID_AMOUNT',
        message: 'Invalid payment amount',
      });
      return;
    }

    setIsProcessing(true);
    clearError();

    try {
      const paymentData: PaymentData = {
        bookingId: `booking_${Date.now()}`, // In real app, this would come from booking creation
        amount: bookingState.pricing.total,
        currency: 'NGN',
        customerEmail: email,
        customerName: name,
        customerPhone: phone,
        reference: `shalean_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
        metadata: {
          bookingId: `booking_${Date.now()}`,
          serviceName: bookingState.service.name,
          customerId: user?.id || 'anonymous',
          cleanerId: bookingState.cleaner?.id,
          scheduledDate: bookingState.scheduledDate?.toISOString() || '',
          scheduledTime: bookingState.scheduledTime || '',
          address: bookingState.address || '',
        },
      };

      await initializePayment(paymentData);
    } catch (err) {
      setIsProcessing(false);
      onPaymentError({
        code: 'PAYMENT_INIT_ERROR',
        message: err instanceof Error ? err.message : 'Failed to initialize payment',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 800 000 0000"
              />
            </div>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payment Summary</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Service: {bookingState.service?.name || 'Cleaning Service'}</span>
                <span>{formatPrice(bookingState.pricing.basePrice)}</span>
              </div>
              
              {bookingState.pricing.bedroomPrice > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Bedrooms ({bookingState.bedrooms})</span>
                  <span>{formatPrice(bookingState.pricing.bedroomPrice)}</span>
                </div>
              )}
              
              {bookingState.pricing.bathroomPrice > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Bathrooms ({bookingState.bathrooms})</span>
                  <span>{formatPrice(bookingState.pricing.bathroomPrice)}</span>
                </div>
              )}
              
              {bookingState.pricing.extrasPrice > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Extras</span>
                  <span>{formatPrice(bookingState.pricing.extrasPrice)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span>Service Fee (10%)</span>
                <span>{formatPrice(bookingState.pricing.serviceFee)}</span>
              </div>
              
              {/* Discount will be shown when discount functionality is fully implemented */}
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(bookingState.pricing.total)}</span>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                {error.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isLoading || isProcessing}
            className="w-full"
            size="lg"
          >
            {isLoading || isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay {formatAmount(bookingState.pricing.total)}
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            You will be redirected to Paystack to complete your payment securely.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
