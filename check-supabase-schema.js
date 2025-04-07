// check-supabase-schema.js
const { createClient } = require('@supabase/supabase-js');

// This script will list all tables and their columns in your Supabase database
// You'll need to run this with your Supabase URL and API key

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables are set');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function listTablesWithColumns() {
  try {
    // Get all tables in the public schema
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');
    
    if (tablesError) {
      console.error('Error fetching tables:', tablesError.message);
      return;
    }
    
    console.log('=== Supabase Database Schema ===\n');
    
    if (!tables || tables.length === 0) {
      console.log('No tables found in the public schema');
      return;
    }
    
    // For each table, get its columns
    for (const table of tables) {
      const tableName = table.table_name;
      console.log(`TABLE: ${tableName}`);
      console.log('-'.repeat(tableName.length + 7));
      
      // Get columns for this table
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_schema', 'public')
        .eq('table_name', tableName)
        .order('ordinal_position');
      
      if (columnsError) {
        console.error(`Error fetching columns for ${tableName}:`, columnsError.message);
        continue;
      }
      
      if (columns && columns.length > 0) {
        // Print column details in a formatted way
        console.log('Column Name'.padEnd(30) + 'Data Type'.padEnd(20) + 'Nullable'.padEnd(10) + 'Default');
        console.log('-'.repeat(80));
        
        columns.forEach(column => {
          const name = column.column_name.padEnd(30);
          const type = column.data_type.padEnd(20);
          const nullable = column.is_nullable === 'YES' ? 'YES'.padEnd(10) : 'NO'.padEnd(10);
          const defaultVal = column.column_default || 'NULL';
          
          console.log(`${name}${type}${nullable}${defaultVal}`);
        });
      } else {
        console.log('No columns found for this table');
      }
      
      console.log('\n');
    }
    
    console.log('=== End of Schema ===');
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

// Run the function
listTablesWithColumns(); 