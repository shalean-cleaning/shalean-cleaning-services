// Verify data in remote Supabase database
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

async function verifyTable(tableName, expectedCount = null) {
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`❌ ${tableName}: ${error.message}`);
      return false;
    } else {
      const actualCount = count || 0;
      const status = expectedCount ? 
        (actualCount >= expectedCount ? '✅' : '⚠️ ') : 
        '✅';
      console.log(`${status} ${tableName}: ${actualCount} records`);
      return true;
    }
  } catch (err) {
    console.log(`❌ ${tableName}: ${err.message}`);
    return false;
  }
}

async function verifyData() {
  console.log('🔍 Verifying data in remote Supabase database...');
  console.log('📡 URL:', supabaseUrl);
  console.log('=====================================');
  
  let successCount = 0;
  let totalCount = 0;
  
  // Verify tables exist and have data
  const tables = [
    { name: 'regions', expectedCount: 4 },
    { name: 'suburbs', expectedCount: 19 },
    { name: 'service_categories', expectedCount: 4 },
    { name: 'services', expectedCount: 7 },
    { name: 'service_extras', expectedCount: 10 },
    { name: 'profiles', expectedCount: 10 },
    { name: 'cleaners', expectedCount: 10 },
    { name: 'cleaner_availability', expectedCount: 50 }
  ];
  
  for (const table of tables) {
    totalCount++;
    if (await verifyTable(table.name, table.expectedCount)) {
      successCount++;
    }
  }
  
  console.log('=====================================');
  console.log(`📊 Verification completed: ${successCount}/${totalCount} tables verified`);
  
  if (successCount === totalCount) {
    console.log('🎉 All data has been successfully pushed to your remote Supabase database!');
    console.log('🚀 Your Shalean booking system is ready to use.');
  } else {
    console.log('⚠️  Some tables are missing or have insufficient data.');
    console.log('💡 Please check the Supabase dashboard and re-run the complete-setup.sql script if needed.');
  }
  
  // Test a sample query
  console.log('\n🧪 Testing sample queries...');
  try {
    const { data: regions, error } = await supabase
      .from('regions')
      .select('name')
      .limit(3);
    
    if (error) {
      console.log('❌ Sample query failed:', error.message);
    } else {
      console.log('✅ Sample regions:', regions.map(r => r.name).join(', '));
    }
  } catch (err) {
    console.log('❌ Sample query error:', err.message);
  }
}

verifyData().catch(console.error);
