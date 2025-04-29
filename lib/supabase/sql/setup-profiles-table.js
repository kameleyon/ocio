// This script checks if the profiles table exists and has the correct structure
// Run with: node setup-profiles-table.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupProfilesTable() {
  console.log('Checking profiles table...');
  
  try {
    // Check if profiles table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      throw new Error(`Error checking tables: ${tablesError.message}`);
    }

    const profilesTableExists = tables.some(table => table.table_name === 'profiles');
    
    if (!profilesTableExists) {
      console.log('Profiles table does not exist. Creating table...');
      
      // SQL to create profiles table
      const createTableSQL = `
      -- Create profiles table
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        email TEXT NOT NULL,
        full_name TEXT,
        avatar_url TEXT,
        subscription_tier TEXT DEFAULT 'free',
        generation_count INT DEFAULT 0
      );

      -- Create index for subscription tier
      CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON public.profiles(subscription_tier);

      -- Enable RLS
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

      -- Add RLS policies
      DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
      CREATE POLICY "Users can view their own profile" ON public.profiles
        FOR SELECT USING (auth.uid() = id);

      DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
      CREATE POLICY "Users can update their own profile" ON public.profiles
        FOR UPDATE USING (auth.uid() = id);
        
      DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
      CREATE POLICY "Users can insert their own profile" ON public.profiles
        FOR INSERT WITH CHECK (auth.uid() = id);

      -- Create trigger function for profile creation on user signup
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.profiles (id, email, full_name, avatar_url, subscription_tier, generation_count)
        VALUES (
          NEW.id,
          NEW.email,
          NEW.raw_user_meta_data->>'full_name',
          NEW.raw_user_meta_data->>'avatar_url',
          'free',
          0
        );
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      -- Create the trigger
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      `;

      // Execute the SQL (requires elevated permissions)
      const { error: sqlError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
      
      if (sqlError) {
        console.error('Error creating profiles table:', sqlError);
        console.log('You may need to manually run the SQL in the Supabase dashboard.');
        console.log('SQL to run:');
        console.log(createTableSQL);
      } else {
        console.log('Profiles table created successfully!');
      }
    } else {
      console.log('Profiles table exists. Checking structure...');
      
      // Check columns in profiles table
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_schema', 'public')
        .eq('table_name', 'profiles');
      
      if (columnsError) {
        throw new Error(`Error checking columns: ${columnsError.message}`);
      }
      
      console.log('Current columns in profiles table:');
      columns.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type}`);
      });
      
      // Check if trigger exists
      const { data: triggers, error: triggersError } = await supabase
        .from('information_schema.triggers')
        .select('trigger_name')
        .eq('event_object_schema', 'auth')
        .eq('event_object_table', 'users');
      
      if (triggersError) {
        throw new Error(`Error checking triggers: ${triggersError.message}`);
      }
      
      const triggerExists = triggers.some(trigger => trigger.trigger_name === 'on_auth_user_created');
      
      if (!triggerExists) {
        console.log('Trigger for automatic profile creation is missing. Creating trigger...');
        
        // SQL to create trigger
        const createTriggerSQL = `
        -- Create trigger function for profile creation on user signup
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.profiles (id, email, full_name, avatar_url, subscription_tier, generation_count)
          VALUES (
            NEW.id,
            NEW.email,
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'avatar_url',
            'free',
            0
          );
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Create the trigger
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        `;
        
        // Execute the SQL (requires elevated permissions)
        const { error: sqlError } = await supabase.rpc('exec_sql', { sql: createTriggerSQL });
        
        if (sqlError) {
          console.error('Error creating trigger:', sqlError);
          console.log('You may need to manually run the SQL in the Supabase dashboard.');
          console.log('SQL to run:');
          console.log(createTriggerSQL);
        } else {
          console.log('Trigger created successfully!');
        }
      } else {
        console.log('Trigger for automatic profile creation exists.');
      }
    }
    
    console.log('Profile table setup complete!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

setupProfilesTable()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
  });
