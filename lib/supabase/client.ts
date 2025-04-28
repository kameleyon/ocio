import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cfovctpyutyvyqzvypwx.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmb3ZjdHB5dXR5dnlxenZ5cHd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTk0MDIsImV4cCI6MjA2MDQ5NTQwMn0.J-c-JGblGgP4zi5ceTORCq8MYbdfcbtP-Ml8a8s4oRM'

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
