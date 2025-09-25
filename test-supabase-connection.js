// Test Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ytitquypkuboktpypjwa.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your_anon_key_here';

console.log('🔗 Testing Supabase connection...');
console.log('📡 URL:', supabaseUrl);
console.log('🔑 API Key:', supabaseKey.substring(0, 20) + '...' + supabaseKey.substring(supabaseKey.length - 10));

if (supabaseKey === 'your_anon_key_here') {
  console.log('❌ Please set NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file');
  console.log('📋 Get your API key from: https://supabase.com/dashboard/project/ytitquypkuboktpypjwa');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🧪 Testing connection...');
    
    // Test a simple query to check connection
    const { data, error } = await supabase.from('_supabase_migrations').select('*').limit(1);
    
    if (error) {
      console.error('❌ Connection error:', error.message);
      if (error.message.includes('Invalid API key')) {
        console.log('💡 Make sure you have the correct API key from your Supabase dashboard');
      }
    } else {
      console.log('✅ Connection successful!');
      console.log('📊 Database is accessible');
    }
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

testConnection();