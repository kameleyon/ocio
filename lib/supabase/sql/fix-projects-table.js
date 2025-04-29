// Simple script to fix the projects table issue
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function createProjectsTable() {
  try {
    console.log('Creating projects table...');
    
    // Read the SQL file
    const sql = fs.readFileSync(path.join(__dirname, 'fix-projects-table.sql'), 'utf8');
    
    // Execute SQL directly (Note: This requires appropriate permissions in Supabase)
    // For PostgreSQL 14 and newer in Supabase, you might need to use the REST API or other methods
    try {
      // Attempt to use pg_dump_table function if available
      const { data, error } = await supabase.rpc('pg_dump_watch', { 
        query_sql: sql 
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Table created successfully using pg_dump_watch!');
    } catch (rpcError) {
      console.log('RPC method failed, trying direct database access...');
      
      // This is a simplified example - direct SQL execution may not be available
      // depending on your Supabase configuration
      console.log('Please run the SQL script directly in the Supabase dashboard SQL editor');
      console.log('SQL Script path: fix-projects-table.sql');
    }
    
    // Test if the table was created
    const { data: testData, error: testError } = await supabase
      .from('projects')
      .select('count(*)')
      .limit(1);
    
    if (testError) {
      console.error('Error testing projects table:', testError);
      console.log('The projects table may not have been created successfully.');
      console.log('Please run the SQL script directly in the Supabase dashboard SQL editor.');
    } else {
      console.log('Projects table exists and is accessible!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the function
createProjectsTable();
