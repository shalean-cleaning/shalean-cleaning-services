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

    // Get booking details from database
    const { data: booking, error: bookingError } = await supabase
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

    if (bookingError || !booking) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Booking not found' 
        },
        { status: 404 }
      );
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
        serviceName: booking.services?.name || 'Cleaning Service',
        customerId: booking.profiles?.first_name ? `${booking.profiles.first_name} ${booking.profiles.last_name}` : customerName,
        cleanerId: booking.cleaner_id || undefined,
        scheduledDate: booking.scheduled_date,
        scheduledTime: booking.scheduled_time,
        address: booking.address,
      },
    };

    // Store payment reference in database
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
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to update booking with payment reference' 
        },
        { status: 500 }
      );
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
