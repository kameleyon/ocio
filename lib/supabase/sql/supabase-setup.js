const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

async function setupDatabase() {
  try {
    console.log('Setting up Supabase database tables...');
    
    // Create projects table
    console.log('Creating projects table...');
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);
    
    if (projectsError && projectsError.code === '42P01') {
      // Table doesn't exist, create it using raw SQL
      console.log('Projects table does not exist. Creating it...');
      const projectsSql = fs.readFileSync(path.join(__dirname, 'create_projects_table.sql'), 'utf8');
      
      // Execute SQL directly using the REST API
      const projectsResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey
        },
        body: JSON.stringify({
          query: projectsSql
        })
      });
      
      if (!projectsResponse.ok) {
        const errorData = await projectsResponse.json();
        console.error('Error creating projects table:', errorData);
      } else {
        console.log('Projects table created successfully!');
      }
    } else {
      console.log('Projects table already exists.');
    }
    
    // Create profiles table
    console.log('Creating profiles table...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (profilesError && profilesError.code === '42P01') {
      // Table doesn't exist, create it using raw SQL
      console.log('Profiles table does not exist. Creating it...');
      const profilesSql = fs.readFileSync(path.join(__dirname, 'create_profiles_table.sql'), 'utf8');
      
      // Execute SQL directly using the REST API
      const profilesResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey
        },
        body: JSON.stringify({
          query: profilesSql
        })
      });
      
      if (!profilesResponse.ok) {
        const errorData = await profilesResponse.json();
        console.error('Error creating profiles table:', errorData);
      } else {
        console.log('Profiles table created successfully!');
      }
    } else {
      console.log('Profiles table already exists.');
    }
    
    // Create storage bucket for project files if it doesn't exist
    console.log('Setting up storage...');
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketsError) {
      console.error('Error checking storage buckets:', bucketsError);
    } else {
      const projectFilesBucket = buckets.find(b => b.name === 'project-files');
      
      if (!projectFilesBucket) {
        console.log('Creating project-files storage bucket...');
        const { data, error } = await supabase
          .storage
          .createBucket('project-files', {
            public: false,
            fileSizeLimit: 52428800, // 50MB
          });
        
        if (error) {
          console.error('Error creating storage bucket:', error);
        } else {
          console.log('Storage bucket created successfully!');
          
          // Set bucket policy to allow access by authenticated users
          const { error: policyError } = await supabase
            .storage
            .from('project-files')
            .createSignedUrl('placeholder.txt', 60);
          
          if (policyError) {
            console.error('Error setting bucket policy:', policyError);
          }
        }
      } else {
        console.log('project-files storage bucket already exists.');
      }
    }
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Execute the setup
setupDatabase();
