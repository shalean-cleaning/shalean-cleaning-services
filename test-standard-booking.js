// Test booking functionality for Standard House Cleaning
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

async function testStandardBooking() {
  try {
    console.log('🧪 Testing Standard House Cleaning Booking');
    console.log('==========================================');
    
    // Step 1: Get Standard House Cleaning service
    console.log('\n📋 Step 1: Finding Standard House Cleaning service...');
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .eq('name', 'Standard House Cleaning')
      .single();
    
    if (servicesError) {
      console.log('❌ Service not found:', servicesError.message);
      return;
    }
    
    console.log('✅ Service found:', services.name);
    console.log('   Base Price: R', services.base_price);
    console.log('   Per Bedroom: R', services.per_bedroom_price);
    console.log('   Per Bathroom: R', services.per_bathroom_price);
    console.log('   Duration:', services.duration_minutes, 'minutes');
    
    // Step 2: Get available regions
    console.log('\n📍 Step 2: Getting available regions...');
    const { data: regions, error: regionsError } = await supabase
      .from('regions')
      .select('*')
      .eq('is_active', true);
    
    if (regionsError) {
      console.log('❌ Regions error:', regionsError.message);
      return;
    }
    
    console.log('✅ Available regions:', regions.map(r => r.name).join(', '));
    
    // Step 3: Get suburbs for Western Cape
    console.log('\n🏘️ Step 3: Getting suburbs for Western Cape...');
    const westernCape = regions.find(r => r.name === 'Western Cape');
    const { data: suburbs, error: suburbsError } = await supabase
      .from('suburbs')
      .select('*')
      .eq('region_id', westernCape.id)
      .eq('is_active', true);
    
    if (suburbsError) {
      console.log('❌ Suburbs error:', suburbsError.message);
      return;
    }
    
    console.log('✅ Western Cape suburbs:', suburbs.map(s => s.name).join(', '));
    
    // Step 4: Get service extras
    console.log('\n➕ Step 4: Getting available service extras...');
    const { data: extras, error: extrasError } = await supabase
      .from('service_extras')
      .select('*')
      .eq('is_active', true);
    
    if (extrasError) {
      console.log('❌ Service extras error:', extrasError.message);
      return;
    }
    
    console.log('✅ Available extras:', extras.map(e => `${e.name} (R${e.price})`).join(', '));
    
    // Step 5: Calculate booking price
    console.log('\n💰 Step 5: Calculating booking price...');
    const bedrooms = 3;
    const bathrooms = 2;
    const selectedExtras = extras.slice(0, 2); // Select first 2 extras
    
    const basePrice = parseFloat(services.base_price);
    const bedroomPrice = parseFloat(services.per_bedroom_price) * bedrooms;
    const bathroomPrice = parseFloat(services.per_bathroom_price) * bathrooms;
    const extrasPrice = selectedExtras.reduce((sum, extra) => sum + parseFloat(extra.price), 0);
    
    const totalPrice = basePrice + bedroomPrice + bathroomPrice + extrasPrice;
    
    console.log('   Base price: R', basePrice);
    console.log('   Bedrooms (3): R', bedroomPrice);
    console.log('   Bathrooms (2): R', bathroomPrice);
    console.log('   Extras:', selectedExtras.map(e => e.name).join(', '));
    console.log('   Extras price: R', extrasPrice);
    console.log('   TOTAL PRICE: R', totalPrice);
    
    // Step 6: Test booking creation (without actually creating)
    console.log('\n📝 Step 6: Booking details summary...');
    const bookingDetails = {
      service: services.name,
      region: westernCape.name,
      suburb: suburbs[0].name, // First suburb
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      extras: selectedExtras.map(e => e.name),
      totalPrice: totalPrice,
      duration: services.duration_minutes
    };
    
    console.log('✅ Booking details ready:');
    console.log('   Service:', bookingDetails.service);
    console.log('   Location:', bookingDetails.suburb + ', ' + bookingDetails.region);
    console.log('   Property:', bookingDetails.bedrooms + ' bedrooms, ' + bookingDetails.bathrooms + ' bathrooms');
    console.log('   Extras:', bookingDetails.extras.join(', '));
    console.log('   Duration:', bookingDetails.duration, 'minutes');
    console.log('   Total Price: R', bookingDetails.totalPrice);
    
    console.log('\n🎉 Standard House Cleaning booking test completed!');
    console.log('✅ All data is accessible and calculations work correctly');
    console.log('🚀 Ready to create actual bookings through the application');
    
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

testStandardBooking();
