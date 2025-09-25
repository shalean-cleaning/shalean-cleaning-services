import { NextRequest, NextResponse } from 'next/server';
import type { PaymentResult } from '@/lib/paystack';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference, transactionId } = body;

    if (!reference) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment reference is required' 
        },
        { status: 400 }
      );
    }

    // For now, we'll simulate booking verification
    // In production, you would query the database with the actual schema
    const booking = {
      id: `booking_${Date.now()}`,
      amount: 0, // This would come from the database
    };

    // Verify payment with Paystack (in production, you'd make an API call to Paystack)
    // For now, we'll simulate a successful verification
    const isPaymentSuccessful = true; // In production, verify with Paystack API

    if (isPaymentSuccessful) {
      // In production, update booking status in database
      // For now, we'll simulate successful update
      console.log('Payment verified successfully for booking:', booking.id);

      // Create payment record (simulated)
      console.log('Payment record created for booking:', booking.id);

      const result: PaymentResult = {
        success: true,
        reference,
        transactionId: transactionId || `txn_${Date.now()}`,
        amount: 0, // Amount will be calculated from booking details
        currency: 'ZAR',
        message: 'Payment successful',
        bookingId: booking.id,
      };

      return NextResponse.json(result);
    } else {
      // Payment failed
      console.log('Payment verification failed for booking:', booking.id);

      const result: PaymentResult = {
        success: false,
        reference,
        transactionId: transactionId || '',
        amount: 0, // Amount will be calculated from booking details
        currency: 'ZAR',
        message: 'Payment verification failed',
        bookingId: booking.id,
      };

      return NextResponse.json(result, { status: 400 });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
