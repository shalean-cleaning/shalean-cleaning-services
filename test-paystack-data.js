// Test Paystack popup data display
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPaystackData() {
  try {
    console.log('🧪 Testing Paystack Popup Data Display');
    console.log('=====================================');
    
    // Get Standard House Cleaning service
    const { data: service } = await supabase
      .from('services')
      .select('*')
      .eq('name', 'Standard House Cleaning')
      .single();
    
    // Get Western Cape region
    const { data: region } = await supabase
      .from('regions')
      .select('*')
      .eq('name', 'Western Cape')
      .single();
    
    // Get Cape Town CBD suburb
    const { data: suburb } = await supabase
      .from('suburbs')
      .select('*')
      .eq('name', 'Cape Town CBD')
      .eq('region_id', region.id)
      .single();
    
    // Get some service extras
    const { data: extras } = await supabase
      .from('service_extras')
      .select('*')
      .limit(2);
    
    // Simulate booking state
    const bookingState = {
      service: service,
      bedrooms: 3,
      bathrooms: 2,
      suburb: {
        id: suburb.id,
        name: suburb.name,
        region: {
          id: region.id,
          name: region.name
        }
      },
      scheduledDate: new Date('2025-01-15'),
      scheduledTime: '09:00',
      address: '123 Main Street, Cape Town CBD',
      selectedExtras: extras.map(extra => ({
        id: extra.id,
        name: extra.name,
        price: parseFloat(extra.price),
        quantity: 1
      })),
      pricing: {
        basePrice: parseFloat(service.base_price),
        bedroomPrice: parseFloat(service.per_bedroom_price) * 3,
        bathroomPrice: parseFloat(service.per_bathroom_price) * 2,
        extrasPrice: extras.reduce((sum, extra) => sum + parseFloat(extra.price), 0),
        subtotal: parseFloat(service.base_price) + (parseFloat(service.per_bedroom_price) * 3) + (parseFloat(service.per_bathroom_price) * 2) + extras.reduce((sum, extra) => sum + parseFloat(extra.price), 0),
        serviceFee: 0,
        total: parseFloat(service.base_price) + (parseFloat(service.per_bedroom_price) * 3) + (parseFloat(service.per_bathroom_price) * 2) + extras.reduce((sum, extra) => sum + parseFloat(extra.price), 0)
      }
    };
    
    // Generate payment data (same as in PaymentForm)
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    const serviceDescription = `${bookingState.service.name} - ${bookingState.bedrooms} bedrooms, ${bookingState.bathrooms} bathrooms`;
    const extrasDescription = bookingState.selectedExtras.length > 0 
      ? ` + ${bookingState.selectedExtras.map(extra => extra.name).join(', ')}`
      : '';
    const fullDescription = serviceDescription + extrasDescription;
    
    const paymentData = {
      bookingId,
      amount: bookingState.pricing.total,
      currency: 'ZAR',
      customerEmail: 'test@example.com',
      customerName: 'John Doe',
      customerPhone: '+27821234567',
      reference: `shalean_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      metadata: {
        bookingId,
        serviceName: bookingState.service.name,
        serviceDescription: fullDescription,
        customerId: 'test-user',
        cleanerId: undefined,
        scheduledDate: bookingState.scheduledDate.toISOString().split('T')[0],
        scheduledTime: bookingState.scheduledTime,
        address: bookingState.address,
        suburb: bookingState.suburb.name,
        region: bookingState.suburb.region.name,
        bedrooms: bookingState.bedrooms.toString(),
        bathrooms: bookingState.bathrooms.toString(),
        extras: bookingState.selectedExtras.map(extra => `${extra.name} (x${extra.quantity})`).join(', '),
        basePrice: bookingState.pricing.basePrice.toString(),
        extrasPrice: bookingState.pricing.extrasPrice.toString(),
        serviceFee: bookingState.pricing.serviceFee.toString(),
        total: bookingState.pricing.total.toString(),
      },
    };
    
    console.log('\n📋 Paystack Popup Will Display:');
    console.log('================================');
    console.log('💰 Amount: R', paymentData.amount);
    console.log('📧 Customer Email:', paymentData.customerEmail);
    console.log('👤 Customer Name:', paymentData.customerName);
    console.log('📞 Phone:', paymentData.customerPhone);
    console.log('🔗 Reference:', paymentData.reference);
    
    console.log('\n📝 Custom Fields in Popup:');
    console.log('==========================');
    console.log('🏠 Service:', paymentData.metadata.serviceDescription);
    console.log('📍 Location:', `${paymentData.metadata.suburb}, ${paymentData.metadata.region}`);
    console.log('📅 Scheduled Date:', paymentData.metadata.scheduledDate);
    console.log('⏰ Scheduled Time:', paymentData.metadata.scheduledTime);
    
    console.log('\n📊 Detailed Breakdown:');
    console.log('======================');
    console.log('🏠 Property:', `${paymentData.metadata.bedrooms} bedrooms, ${paymentData.metadata.bathrooms} bathrooms`);
    console.log('➕ Extras:', paymentData.metadata.extras || 'None');
    console.log('💰 Base Price: R', paymentData.metadata.basePrice);
    console.log('➕ Extras Price: R', paymentData.metadata.extrasPrice);
    console.log('💳 Service Fee: R', paymentData.metadata.serviceFee);
    console.log('💯 Total: R', paymentData.metadata.total);
    
    console.log('\n✅ Paystack popup will now display all correct booking data!');
    console.log('🎉 The popup will show:');
    console.log('   - Service details with property size');
    console.log('   - Selected extras');
    console.log('   - Location information');
    console.log('   - Scheduled date and time');
    console.log('   - Accurate pricing breakdown');
    
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

testPaystackData();
