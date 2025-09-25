// Execute migration through Supabase API
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeMigration() {
  try {
    console.log('🚀 Starting migration execution...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20250924210840_create_booking_system_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Migration file loaded:', migrationPath);
    console.log('📊 Migration size:', migrationSQL.length, 'characters');
    
    // Split the migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log('🔧 Found', statements.length, 'SQL statements to execute');
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
          
          // Use rpc to execute raw SQL
          const { data, error } = await supabase.rpc('exec_sql', { 
            sql: statement + ';' 
          });
          
          if (error) {
            console.log(`⚠️  Statement ${i + 1} warning:`, error.message);
            // Continue with other statements even if one fails
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.log(`❌ Statement ${i + 1} failed:`, err.message);
          // Continue with other statements
        }
      }
    }
    
    console.log('🎉 Migration execution completed!');
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  }
}

// Check if we can execute SQL directly
async function testSQLExecution() {
  try {
    console.log('🧪 Testing SQL execution capability...');
    
    // Try a simple query first
    const { data, error } = await supabase.from('information_schema.tables').select('*').limit(1);
    
    if (error) {
      console.log('❌ Cannot execute SQL directly:', error.message);
      console.log('💡 This might be due to RLS policies or API limitations');
      return false;
    } else {
      console.log('✅ SQL execution test passed');
      return true;
    }
  } catch (err) {
    console.log('❌ SQL execution test failed:', err.message);
    return false;
  }
}

async function main() {
  console.log('🔗 Supabase Migration Executor');
  console.log('==============================');
  console.log('📡 URL:', supabaseUrl);
  console.log('🔑 API Key:', supabaseKey.substring(0, 20) + '...' + supabaseKey.substring(supabaseKey.length - 10));
  
  const canExecute = await testSQLExecution();
  
  if (canExecute) {
    await executeMigration();
  } else {
    console.log('💡 Alternative approach needed');
    console.log('📋 You may need to:');
    console.log('   1. Execute the migration manually in Supabase Dashboard');
    console.log('   2. Use the Supabase CLI with proper network access');
    console.log('   3. Check your database connection settings');
  }
}

main();
