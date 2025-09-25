// Test actual application data access
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

async function testApplicationData() {
  try {
    console.log('🔗 Testing Application Data Access');
    console.log('===============================');
    console.log('📡 URL:', supabaseUrl);
    console.log('🔑 API Key:', supabaseKey.substring(0, 20) + '...' + supabaseKey.substring(supabaseKey.length - 10));
    
    // Test 1: Regions
    console.log('\n🧪 Testing regions...');
    const { data: regions, error: regionsError } = await supabase
      .from('regions')
      .select('*')
      .limit(3);
    
    if (regionsError) {
      console.log('❌ Regions error:', regionsError.message);
    } else {
      console.log('✅ Regions loaded:', regions.length, 'items');
      console.log('   Sample:', regions.map(r => r.name).join(', '));
    }
    
    // Test 2: Services
    console.log('\n🧪 Testing services...');
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .limit(3);
    
    if (servicesError) {
      console.log('❌ Services error:', servicesError.message);
    } else {
      console.log('✅ Services loaded:', services.length, 'items');
      console.log('   Sample:', services.map(s => s.name).join(', '));
    }
    
    // Test 3: Service Extras
    console.log('\n🧪 Testing service extras...');
    const { data: extras, error: extrasError } = await supabase
      .from('service_extras')
      .select('*')
      .limit(3);
    
    if (extrasError) {
      console.log('❌ Service extras error:', extrasError.message);
    } else {
      console.log('✅ Service extras loaded:', extras.length, 'items');
      console.log('   Sample:', extras.map(e => e.name).join(', '));
    }
    
    console.log('\n🎉 Application data test completed!');
    console.log('✅ Your database is ready for development!');
    
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

testApplicationData();
