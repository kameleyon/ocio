"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Profile, getProfile } from '@/lib/services/auth-service'

interface AuthContextProps {
  user: any | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for active session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          
          // Get user profile
          const userProfile = await getProfile(session.user.id)
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          
          // Get user profile
          const userProfile = await getProfile(session.user.id)
          setProfile(userProfile)
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => {
      // Clean up subscription when component unmounts
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        setUser(data.user)
        
        // Get user profile
        const userProfile = await getProfile(data.user.id)
        setProfile(userProfile)
        
        // Redirect to dashboard
        router.push('/build')
      }

      return { error: null }
    } catch (error) {
      console.error('Error signing in:', error)
      return { error: error as Error }
    }
  }

  const signUp = async (email: string, password: string) => {
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
        
        // Redirect to login with message about verification
        router.push('/login?message=verification-email-sent')
      }

      return { error: null }
    } catch (error) {
      console.error('Error signing up:', error)
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      // Force navigation to landing page
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      const userProfile = await getProfile(user.id)
      setProfile(userProfile)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
