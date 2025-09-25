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

  // Check if Paystack key is configured
  if (!paystackPublicKey) {
    console.error('Paystack public key is not configured');
    console.error('Environment variables:', {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('PAYSTACK'))
    });
  } else {
    console.log('Paystack public key loaded:', paystackPublicKey.substring(0, 10) + '...');
  }

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
    if (!paystackPublicKey) {
      console.error('Paystack public key is missing:', {
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        allEnvVars: Object.keys(process.env).filter(key => key.includes('PAYSTACK'))
      });
      onPaymentError({
        code: 'MISSING_PAYSTACK_KEY',
        message: 'Payment system is not properly configured. Please contact support.',
      });
      return;
    }

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
      // Generate a proper booking ID
      const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      // Format the service description for Paystack
      const serviceDescription = `${bookingState.service.name} - ${bookingState.bedrooms} bedrooms, ${bookingState.bathrooms} bathrooms`;
      
      // Add extras to description if any
      const extrasDescription = bookingState.selectedExtras.length > 0 
        ? ` + ${bookingState.selectedExtras.map(extra => extra.name).join(', ')}`
        : '';
      
      const fullDescription = serviceDescription + extrasDescription;

      const paymentData: PaymentData = {
        bookingId,
        amount: bookingState.pricing.total,
        currency: 'ZAR',
        customerEmail: email,
        customerName: name,
        customerPhone: phone,
        reference: `shalean_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
        metadata: {
          bookingId,
          serviceName: bookingState.service.name,
          serviceDescription: fullDescription,
          customerId: user?.id || 'anonymous',
          cleanerId: bookingState.cleaner?.id,
          scheduledDate: bookingState.scheduledDate?.toISOString().split('T')[0] || '',
          scheduledTime: bookingState.scheduledTime || '',
          address: bookingState.address || '',
          suburb: bookingState.suburb?.name || '',
          region: bookingState.suburb?.region?.name || '',
          bedrooms: bookingState.bedrooms.toString(),
          bathrooms: bookingState.bathrooms.toString(),
          extras: bookingState.selectedExtras.map(extra => `${extra.name} (x${extra.quantity})`).join(', '),
          basePrice: bookingState.pricing.basePrice.toString(),
          extrasPrice: bookingState.pricing.extrasPrice.toString(),
          serviceFee: bookingState.pricing.serviceFee.toString(),
          total: bookingState.pricing.total.toString(),
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
                placeholder="+27 11 123 4567"
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
