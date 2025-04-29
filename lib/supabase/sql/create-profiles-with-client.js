// Script to create profiles table using Supabase client 
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase connection
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to create profiles table via REST API
async function createProfilesTable() {
  try {
    console.log('Creating profiles table via REST API...');
    
    // Define the API endpoint for the SQL query
    const endpoint = `${supabaseUrl}/rest/v1/`;
    
    // Simple CREATE TABLE statement without complex syntax
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY,
        email TEXT NOT NULL,
        full_name TEXT,
        avatar_url TEXT,
        subscription_tier TEXT DEFAULT 'free',
        generation_count INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `;
    
    // Use fetch to execute the query directly
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: createTableSQL
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to create table: ${errorData}`);
    }
    
    console.log('Profiles table created successfully!');
    
    // Test if the table was created
    const { data, error } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.log('Error accessing profiles table:', error.message);
    } else {
      console.log('Successfully verified profiles table exists.');
    }
    
  } catch (error) {
    console.error('Error creating profiles table:', error.message);
  }
}

// Run the function
createProfilesTable();
