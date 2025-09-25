// Simple migration runner for remote Supabase database
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

async function runMigration() {
  try {
    console.log('🚀 Running database migration...');
    console.log('📡 URL:', supabaseUrl);
    console.log('🔑 API Key:', supabaseKey.substring(0, 20) + '...' + supabaseKey.substring(supabaseKey.length - 10));
    
    // Read the complete setup SQL file
    const setupPath = path.join(__dirname, 'complete-setup.sql');
    const setupSQL = fs.readFileSync(setupPath, 'utf8');
    
    console.log('📄 Setup file loaded:', setupPath);
    console.log('📊 Setup size:', setupSQL.length, 'characters');
    
    // Try to execute the migration using the REST API
    console.log('⏳ Attempting to execute migration...');
    
    // Split into smaller chunks to avoid API limits
    const statements = setupSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('='));
    
    console.log('🔧 Found', statements.length, 'SQL statements');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
          
          // Try using the REST API to execute SQL
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
              'apikey': supabaseKey
            },
            body: JSON.stringify({ sql: statement + ';' })
          });
          
          if (response.ok) {
            console.log(`✅ Statement ${i + 1} executed successfully`);
            successCount++;
          } else {
            const error = await response.text();
            console.log(`⚠️  Statement ${i + 1} warning:`, error);
            errorCount++;
          }
        } catch (err) {
          console.log(`❌ Statement ${i + 1} failed:`, err.message);
          errorCount++;
        }
      }
    }
    
    console.log('🎉 Migration completed!');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    
    if (errorCount > 0) {
      console.log('💡 Some statements failed. This is normal for API limitations.');
      console.log('📋 You may need to run the migration manually in Supabase Dashboard.');
    }
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.log('💡 Please run the migration manually in Supabase Dashboard');
  }
}

runMigration();
