import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';
import type { PaymentData } from '@/lib/paystack';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, amount, customerEmail, customerName, customerPhone } = body;

    // Validate required fields
    if (!bookingId || !amount || !customerEmail || !customerName) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: bookingId, amount, customerEmail, customerName' 
        },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0 || amount > 100000000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid amount. Must be between 1 and 100,000,000' 
        },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email format' 
        },
        { status: 400 }
      );
    }

    // Try to get booking details from database, but don't fail if it doesn't exist
    // This handles cases where payment is initiated before booking is created
    let booking = null;
    
    try {
      const { data } = await supabase
        .from('bookings')
        .select(`
          id,
          service_id,
          scheduled_date,
          scheduled_time,
          address,
          cleaner_id,
          services (
            name
          ),
          profiles (
            first_name,
            last_name
          )
        `)
        .eq('id', bookingId)
        .single();
      
      booking = data;
    } catch {
      // Booking doesn't exist yet, which is fine for this flow
      console.log('Booking not found in database, proceeding with payment initialization');
    }

    // Generate payment reference
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const reference = `shalean_${timestamp}_${random}`;

    // Create payment data
    const paymentData: PaymentData = {
      bookingId,
      amount,
      currency: 'ZAR',
      customerEmail,
      customerName,
      customerPhone,
      reference,
      metadata: {
        bookingId,
        serviceName: booking?.services?.name || 'Cleaning Service',
        customerId: booking?.profiles?.first_name ? `${booking.profiles.first_name} ${booking.profiles.last_name}` : customerName,
        cleanerId: booking?.cleaner_id || undefined,
        scheduledDate: booking?.scheduled_date || '',
        scheduledTime: booking?.scheduled_time || '',
        address: booking?.address || '',
      },
    };

    // Store payment reference in database (only if booking exists)
    if (booking) {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ 
          payment_reference: reference,
          payment_status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (updateError) {
        console.error('Error updating booking with payment reference:', updateError);
        // Don't fail the payment initialization if we can't update the booking
        console.log('Continuing with payment initialization despite booking update error');
      }
    } else {
      console.log('Booking not found in database, skipping payment reference update');
    }

    return NextResponse.json({
      success: true,
      paymentData,
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
