// Simple Supabase connection test
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔗 Supabase Connection Test');
console.log('============================');
console.log('📡 URL:', supabaseUrl);
console.log('🔑 API Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...${supabaseKey.substring(supabaseKey.length - 10)}` : 'NOT SET');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables');
  console.log('💡 Please create .env.local file with:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=https://ytitquypkuboktpypjwa.supabase.co');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🧪 Testing connection...');
    
    // Test 1: Check if we can reach the API
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError && authError.message.includes('Invalid API key')) {
      console.log('❌ Invalid API key');
      console.log('💡 Please check your API key from the Supabase dashboard');
      return;
    }
    
    console.log('✅ API connection successful!');
    
    // Test 2: Try to access a simple table (this might fail if no tables exist)
    const { data, error } = await supabase.from('_supabase_migrations').select('*').limit(1);
    
    if (error) {
      if (error.message.includes('relation "_supabase_migrations" does not exist')) {
        console.log('✅ Database connection successful!');
        console.log('📊 Database is accessible (no migrations table found, which is normal)');
      } else {
        console.log('⚠️  Database connection issue:', error.message);
      }
    } else {
      console.log('✅ Database connection successful!');
      console.log('📊 Found', data.length, 'migration records');
    }
    
  } catch (err) {
    console.error('❌ Connection test failed:', err.message);
  }
}

testConnection();
