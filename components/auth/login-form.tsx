import React, { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function LoginForm() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
      <Card className="w-full max-w-md p-8 rounded-xl bg-berkeleyBlue/30 backdrop-blur-md border border-slateBlue/30">
        <h2 className="text-3xl font-bold font-comfortaa text-whiteSmoke mb-6 text-center">Log In</h2>
        
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
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-sm font-medium text-lightGray block">
                Password
              </label>
              <Link 
                href="/reset-password"
                className="text-xs text-robinEggBlue hover:text-robinEggBlue/80 transition"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
          
          <p className="text-center text-sm text-lightGray mt-4">
            Don't have an account?{' '}
            <Link href="/signup" className="text-robinEggBlue hover:text-robinEggBlue/80 transition">
              Sign up
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}
