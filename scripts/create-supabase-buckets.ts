// Import the Supabase client using CommonJS syntax
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load environment variables from .env file

// Initialize the Supabase client using environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to create buckets
async function createBuckets() {
  try {
    // Create a bucket for individual source files
    const { data: sourceFilesBucket, error: sourceFilesError } = await supabase
      .storage
      .createBucket('project-source-files', { public: false });
    if (sourceFilesError) {
      console.error('Error creating source files bucket:', sourceFilesError);
    } else {
      console.log('Source files bucket created successfully:', sourceFilesBucket);
    }

    // Create a bucket for project ZIP archives
    const { data: zipBucket, error: zipError } = await supabase
      .storage
      .createBucket('project-zips', { public: false });
    if (zipError) {
      console.error('Error creating ZIP bucket:', zipError);
    } else {
      console.log('ZIP bucket created successfully:', zipBucket);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Execute the function
createBuckets();