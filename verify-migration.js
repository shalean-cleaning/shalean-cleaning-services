// Verify migration was applied successfully
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

async function verifyMigration() {
  try {
    console.log('🔍 Verifying Migration Status');
    console.log('============================');
    
    // List of tables that should exist after migration
    const expectedTables = [
      'profiles',
      'regions', 
      'suburbs',
      'service_categories',
      'services',
      'service_extras',
      'cleaners',
      'cleaner_availability',
      'bookings',
      'booking_items',
      'payments',
      'notifications'
    ];
    
    console.log('📊 Checking for expected tables...');
    
    for (const tableName of expectedTables) {
      try {
        const { data, error } = await supabase.from(tableName).select('*').limit(1);
        
        if (error) {
          console.log(`❌ Table '${tableName}': ${error.message}`);
        } else {
          console.log(`✅ Table '${tableName}': Found`);
        }
      } catch (err) {
        console.log(`❌ Table '${tableName}': ${err.message}`);
      }
    }
    
    // Test some basic operations
    console.log('\n🧪 Testing basic operations...');
    
    // Test regions table (should be publicly readable)
    try {
      const { data: regions, error: regionsError } = await supabase
        .from('regions')
        .select('*')
        .limit(5);
      
      if (regionsError) {
        console.log('❌ Regions query failed:', regionsError.message);
      } else {
        console.log('✅ Regions query successful:', regions?.length || 0, 'records found');
      }
    } catch (err) {
      console.log('❌ Regions test failed:', err.message);
    }
    
    // Test services table
    try {
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .limit(5);
      
      if (servicesError) {
        console.log('❌ Services query failed:', servicesError.message);
      } else {
        console.log('✅ Services query successful:', services?.length || 0, 'records found');
      }
    } catch (err) {
      console.log('❌ Services test failed:', err.message);
    }
    
    console.log('\n🎉 Migration verification completed!');
    
  } catch (err) {
    console.error('❌ Verification failed:', err.message);
  }
}

verifyMigration();
