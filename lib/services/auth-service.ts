import { supabase } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

export type Profile = Database['public']['Tables']['profiles']['Row']

export async function signUp(email: string, password: string): Promise<{ user: any | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    // Create profile entry if signup was successful
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email || '',
      })
    }

    return { user: data.user, error: null }
  } catch (error) {
    console.error('Error in signUp:', error)
    return { user: null, error: error as Error }
  }
}

export async function signIn(email: string, password: string): Promise<{ user: any | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { user: data.user, error: null }
  } catch (error) {
    console.error('Error in signIn:', error)
    return { user: null, error: error as Error }
  }
}

export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error('Error in signOut:', error)
    return { error: error as Error }
  }
}

export async function resetPassword(email: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) throw error

    return { error: null }
  } catch (error) {
    console.error('Error in resetPassword:', error)
    return { error: error as Error }
  }
}

export async function getCurrentUser(): Promise<any | null> {
  try {
    const { data } = await supabase.auth.getUser()
    return data.user
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Error in getProfile:', error)
    return null
  }
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<{ profile: Profile | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    return { profile: data, error: null }
  } catch (error) {
    console.error('Error in updateProfile:', error)
    return { profile: null, error: error as Error }
  }
}
