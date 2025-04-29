const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    console.log('Creating tables in Supabase...');
    
    // Read SQL file
    const sql = fs.readFileSync(path.join(__dirname, 'create_projects_table.sql'), 'utf8');
    
    // Execute SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error creating tables:', error);
      return;
    }
    
    console.log('Tables created successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

createTables();
