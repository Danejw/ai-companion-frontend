// check-supabase-tables.js
const { createClient } = require('@supabase/supabase-js');

// This script will list all tables in your Supabase database
// You'll need to run this with your Supabase URL and API key

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables are set');
  process.exit(1);
}

async function listTables() {
  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Query the information_schema to get table information
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');
    
    if (error) {
      console.error('Error fetching tables:', error.message);
      return;
    }
    
    console.log('=== Supabase Tables ===');
    if (data && data.length > 0) {
      data.forEach((table, index) => {
        console.log(`${index + 1}. ${table.table_name}`);
      });
    } else {
      console.log('No tables found in the public schema');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

// Run the function
listTables(); 