'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { useBooking } from '@/providers/booking-provider';
import { useAuth } from '@/hooks/useAuth';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { PaymentSuccess } from '@/components/payment/PaymentSuccess';
import { formatPrice } from '@/lib/pricing';
import type { PaymentResult, PaymentError } from '@/lib/paystack';

export default function ReviewPage() {
  const router = useRouter();
  const { bookingState } = useBooking();
  const { user } = useAuth();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [paymentError, setPaymentError] = useState<PaymentError | null>(null);

  const handlePaymentSuccess = (result: PaymentResult) => {
    setPaymentResult(result);
    setPaymentError(null);
  };

  const handlePaymentError = (error: PaymentError) => {
    setPaymentError(error);
    setPaymentResult(null);
  };

  const handleContinue = () => {
    router.push('/dashboard');
  };

  const handleGoBack = () => {
    router.back();
  };

  // If payment was successful, show success page
  if (paymentResult) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <PaymentSuccess
            paymentResult={paymentResult}
            bookingSummary={{
              serviceName: bookingState.service?.name || 'Cleaning Service',
              scheduledDate: bookingState.scheduledDate?.toISOString() || '',
              scheduledTime: bookingState.scheduledTime || '',
              address: bookingState.address || '',
              cleanerName: bookingState.cleaner?.profiles 
                ? `${bookingState.cleaner.profiles.first_name} ${bookingState.cleaner.profiles.last_name}`
                : undefined,
            }}
            onContinue={handleContinue}
          />
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    You need to be logged in to complete your booking and payment.
                  </AlertDescription>
                </Alert>
                <div className="flex gap-4">
                  <Button onClick={() => router.push('/auth')} className="flex-1">
                    Sign In / Sign Up
                  </Button>
                  <Button variant="outline" onClick={handleGoBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Check if booking is complete
  if (!bookingState.service || !bookingState.scheduledDate || !bookingState.scheduledTime || !bookingState.address) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Incomplete Booking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please complete all booking steps before proceeding to payment.
                  </AlertDescription>
                </Alert>
                <Button variant="outline" onClick={handleGoBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <Button variant="outline" onClick={handleGoBack} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Previous Step
              </Button>
              <h1 className="text-3xl font-bold mb-2">Review & Payment</h1>
              <p className="text-muted-foreground">
                Please review your booking details and complete payment to confirm your cleaning service.
              </p>
            </div>

            {/* Booking Summary */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Service</p>
                    <p className="font-semibold">{bookingState.service.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Duration</p>
                    <p>{Math.floor(bookingState.service.duration_minutes / 60)}h {bookingState.service.duration_minutes % 60}m</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Property</p>
                    <p>{bookingState.bedrooms} bedroom{bookingState.bedrooms !== 1 ? 's' : ''}, {bookingState.bathrooms} bathroom{bookingState.bathrooms !== 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                    <p>
                      {bookingState.scheduledDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })} at {bookingState.scheduledTime}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p>{bookingState.address}</p>
                    {bookingState.suburb && (
                      <p className="text-sm text-muted-foreground">
                        {bookingState.suburb.name}, {bookingState.suburb.region.name}
                      </p>
                    )}
                  </div>
                </div>

                {bookingState.selectedExtras.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Selected Extras</p>
                      <div className="space-y-1">
                        {bookingState.selectedExtras.map((extra) => (
                          <div key={extra.id} className="flex justify-between text-sm">
                            <span>{extra.name} (×{extra.quantity})</span>
                            <span>{formatPrice(extra.price * extra.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base service</span>
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
                    <span>Subtotal</span>
                    <span>{formatPrice(bookingState.pricing.subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Service fee (10%)</span>
                    <span>{formatPrice(bookingState.pricing.serviceFee)}</span>
                  </div>

                  {/* Discount will be shown when discount functionality is fully implemented */}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(bookingState.pricing.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <PaymentForm
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
