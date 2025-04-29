import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from './types'

// Create a Supabase client for use in server-side operations
// This client has admin rights and should only be used in trusted contexts
// (e.g., webhooks, background jobs)
export function createServiceClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is required')
  }

  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_KEY or SUPABASE_ANON_KEY is required')
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
