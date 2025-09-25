// Execute migration using Supabase REST API
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

async function executeMigrationViaAPI() {
  try {
    console.log('🚀 Executing Migration via Supabase REST API');
    console.log('============================================');
    console.log('📡 URL:', supabaseUrl);
    console.log('🔑 API Key:', supabaseKey.substring(0, 20) + '...' + supabaseKey.substring(supabaseKey.length - 10));
    
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
    
    // Execute each statement using the REST API
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
          
          // Use the Supabase REST API to execute SQL
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
              'apikey': supabaseKey
            },
            body: JSON.stringify({
              sql: statement + ';'
            })
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.log(`⚠️  Statement ${i + 1} warning:`, response.status, errorText);
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.log(`❌ Statement ${i + 1} failed:`, err.message);
        }
      }
    }
    
    console.log('🎉 Migration execution completed!');
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  }
}

// Alternative approach: Try to create tables one by one using the REST API
async function createTablesIndividually() {
  try {
    console.log('🔧 Creating Tables Individually via REST API');
    console.log('============================================');
    
    // Create profiles table
    console.log('⏳ Creating profiles table...');
    const profilesResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      },
      body: JSON.stringify({
        sql: `
          CREATE TABLE IF NOT EXISTS profiles (
            id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
            email TEXT NOT NULL,
            first_name TEXT,
            last_name TEXT,
            phone TEXT,
            role TEXT DEFAULT 'CUSTOMER',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      })
    });
    
    if (profilesResponse.ok) {
      console.log('✅ Profiles table created');
    } else {
      console.log('⚠️  Profiles table creation failed:', await profilesResponse.text());
    }
    
    // Create regions table
    console.log('⏳ Creating regions table...');
    const regionsResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      },
      body: JSON.stringify({
        sql: `
          CREATE TABLE IF NOT EXISTS regions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      })
    });
    
    if (regionsResponse.ok) {
      console.log('✅ Regions table created');
    } else {
      console.log('⚠️  Regions table creation failed:', await regionsResponse.text());
    }
    
    // Create services table
    console.log('⏳ Creating services table...');
    const servicesResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey
      },
      body: JSON.stringify({
        sql: `
          CREATE TABLE IF NOT EXISTS services (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            base_price DECIMAL(10,2) NOT NULL,
            per_bedroom_price DECIMAL(10,2),
            per_bathroom_price DECIMAL(10,2),
            duration_minutes INTEGER DEFAULT 60,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      })
    });
    
    if (servicesResponse.ok) {
      console.log('✅ Services table created');
    } else {
      console.log('⚠️  Services table creation failed:', await servicesResponse.text());
    }
    
    console.log('🎉 Individual table creation completed!');
    
  } catch (err) {
    console.error('❌ Individual table creation failed:', err.message);
  }
}

async function main() {
  console.log('🔗 Supabase Migration Executor (REST API)');
  console.log('=========================================');
  
  // Try the full migration first
  await executeMigrationViaAPI();
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // If that fails, try creating tables individually
  await createTablesIndividually();
}

main();

