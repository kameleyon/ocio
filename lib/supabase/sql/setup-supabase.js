// This script creates the necessary tables and functions in Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupSupabase() {
  try {
    console.log('Setting up Supabase database...');
    
    // Read the SQL file
    const sqlContent = fs.readFileSync(path.join(__dirname, 'setup_database.sql'), 'utf8');
    
    // Split the SQL commands (roughly, this is a simple approach)
    const sqlCommands = sqlContent.split(';').filter(cmd => cmd.trim().length > 0);
    
    // Execute each SQL command through the Supabase REST API
    for (const command of sqlCommands) {
      console.log(`Executing SQL command: ${command.substring(0, 50)}...`);
      
      try {
        // Using supabase.rpc to execute SQL is not directly available
        // Instead, we'll need to execute each command via the REST API or
        // use a different approach that your Supabase setup supports
        
        // This is a placeholder - you may need to adjust this based on your Supabase configuration
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey
          },
          body: JSON.stringify({
            sql: command
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.warn('Warning executing command:', errorData);
          // Continue with other commands even if one fails
        }
      } catch (cmdError) {
        console.warn('Warning:', cmdError.message);
        // Continue with other commands even if one fails
      }
    }
    
    // Verify tables were created
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('Error checking tables:', tablesError);
    } else {
      console.log('Tables in public schema:', tables.map(t => t.table_name).join(', '));
    }
    
    console.log('Database setup completed!');
    
    // Check if projects table exists
    const { data: projectsCheck, error: projectsCheckError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);
    
    if (projectsCheckError) {
      if (projectsCheckError.code === '42P01') {
        console.error('Projects table was not created successfully!');
      } else {
        console.error('Error checking projects table:', projectsCheckError);
      }
    } else {
      console.log('Projects table exists!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the setup
setupSupabase();
