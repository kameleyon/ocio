"use client"

import React, { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function SignupForm() {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }
    
    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(email, password)
      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
        <Card className="w-full max-w-md p-8 rounded-xl bg-berkeleyBlue/30 backdrop-blur-md border border-slateBlue/30">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-robinEggBlue mb-4" />
            <h2 className="text-2xl font-bold font-comfortaa text-whiteSmoke mb-2">Verification Email Sent</h2>
            <p className="text-lightGray mb-6">
              Please check your email and follow the verification link to complete your registration.
            </p>
            <Link href="/login">
              <Button 
                className="bg-gradient-to-r from-slateBlue to-robinEggBlue hover:from-slateBlue/90 hover:to-robinEggBlue/90 text-whiteSmoke font-medium py-2 transition-all duration-200 shadow-glow"
              >
                Back to Login
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
      <Card className="w-full max-w-md p-8 rounded-xl bg-berkeleyBlue/30 backdrop-blur-md border border-slateBlue/30">
        <h2 className="text-3xl font-bold font-comfortaa text-whiteSmoke mb-6 text-center">Sign Up</h2>
        
        {error && (
          <div className="bg-destructive/20 p-3 rounded-lg mb-4 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-lightGray block">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-richBlack/50 border-slateBlue/50 text-whiteSmoke"
              placeholder="you@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-lightGray block">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-richBlack/50 border-slateBlue/50 text-whiteSmoke"
              placeholder="••••••••"
            />
            <p className="text-xs text-lightGray">Must be at least 8 characters</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-lightGray block">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-richBlack/50 border-slateBlue/50 text-whiteSmoke"
              placeholder="••••••••"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-slateBlue to-robinEggBlue hover:from-slateBlue/90 hover:to-robinEggBlue/90 text-whiteSmoke font-medium py-2 transition-all duration-200 shadow-glow"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
          
          <p className="text-center text-sm text-lightGray mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-robinEggBlue hover:text-robinEggBlue/80 transition">
              Log in
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}
