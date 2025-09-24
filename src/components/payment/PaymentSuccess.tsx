'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, MapPin, User, CreditCard } from 'lucide-react';
import { formatPrice } from '@/lib/pricing';
import type { PaymentResult } from '@/lib/paystack';

interface PaymentSuccessProps {
  paymentResult: PaymentResult;
  bookingSummary: {
    serviceName: string;
    scheduledDate: string;
    scheduledTime: string;
    address: string;
    cleanerName?: string;
  };
  onContinue: () => void;
}

export function PaymentSuccess({ paymentResult, bookingSummary, onContinue }: PaymentSuccessProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-800">Payment Successful!</h2>
              <p className="text-green-600">Your booking has been confirmed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
              <p className="font-mono text-sm">{paymentResult.transactionId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Reference</p>
              <p className="font-mono text-sm">{paymentResult.reference}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount Paid</p>
              <p className="text-lg font-bold">{formatPrice(paymentResult.amount)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="mr-1 h-3 w-3" />
                Paid
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">{bookingSummary.serviceName}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(bookingSummary.scheduledDate)} at {formatTime(bookingSummary.scheduledTime)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{bookingSummary.address}</p>
              </div>
            </div>

            {bookingSummary.cleanerName && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Assigned Cleaner</p>
                  <p className="text-sm text-muted-foreground">{bookingSummary.cleanerName}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What&apos;s Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Confirmation Email:</strong> You&apos;ll receive a confirmation email with all the details.
            </p>
            <p className="text-sm">
              <strong>Cleaner Assignment:</strong> Your cleaner will be assigned and you&apos;ll be notified.
            </p>
            <p className="text-sm">
              <strong>Reminder:</strong> We&apos;ll send you a reminder 24 hours before your scheduled cleaning.
            </p>
          </div>
          
          <Button onClick={onContinue} className="w-full" size="lg">
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
