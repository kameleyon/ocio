import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { ApiError } from './api-error'

interface RateLimitConfig {
  // Maximum number of requests allowed within the window
  limit: number
  
  // Time window in seconds
  window: number
  
  // Key generator function to identify the client
  // Default uses IP address
  keyGenerator?: (req: NextRequest) => string
  
  // Whether to store limits per user ID if available (defaults to true)
  useUserIdWhenAvailable?: boolean
  
  // Optional message returned when rate limit is exceeded
  message?: string
}

// Default rate limits based on subscription tier
const DEFAULT_RATE_LIMITS = {
  anonymous: { limit: 30, window: 60 }, // 30 requests per minute for non-authenticated users
  free: { limit: 60, window: 60 }, // 60 requests per minute for free tier
  pro: { limit: 300, window: 60 }, // 300 requests per minute for pro tier
  enterprise: { limit: 1000, window: 60 }, // 1000 requests per minute for enterprise tier
}

// In-memory storage for rate limiting (would use Redis in production)
// Key is IP or user ID, value is array of timestamps
const rateLimitStore: Record<string, number[]> = {}

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  Object.keys(rateLimitStore).forEach(key => {
    rateLimitStore[key] = rateLimitStore[key].filter(
      timestamp => now - timestamp < 60 * 60 * 1000 // Keep requests from last hour
    )
    if (rateLimitStore[key].length === 0) {
      delete rateLimitStore[key]
    }
  })
}, 5 * 60 * 1000)

export async function getRateLimitConfig(request: NextRequest): Promise<RateLimitConfig> {
  // Check if user is authenticated and get subscription tier
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      // Get user's subscription tier
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', session.user.id)
        .single()
      
      const tier = profile?.subscription_tier || 'free'
      return {
        ...DEFAULT_RATE_LIMITS[tier as keyof typeof DEFAULT_RATE_LIMITS],
        useUserIdWhenAvailable: true
      }
    }
  } catch (error) {
    console.error('Error getting rate limit config:', error)
  }
  
  // Default to anonymous rate limits if anything fails
  return DEFAULT_RATE_LIMITS.anonymous
}

export async function rateLimiter(
  request: NextRequest,
  config?: Partial<RateLimitConfig>
) {
  // Get complete config
  const defaultConfig = await getRateLimitConfig(request)
  const finalConfig = { ...defaultConfig, ...config }
  
  // Get key for rate limiting
  let key
  if (finalConfig.keyGenerator) {
    key = finalConfig.keyGenerator(request)
  } else {
    // Get forwarded IP if using a proxy, or direct IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1'
               
    key = ip
    
    // Use user ID if available and config allows it
    if (finalConfig.useUserIdWhenAvailable) {
      const cookieStore = cookies()
      const supabase = createClient(cookieStore)
      
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          key = `user_${session.user.id}`
        }
      } catch (error) {
        // Fall back to IP if we can't get the user ID
        console.error('Error getting user ID for rate limiting:', error)
      }
    }
  }
  
  // Initialize or get current requests for this key
  if (!rateLimitStore[key]) {
    rateLimitStore[key] = []
  }
  
  // Get current time
  const now = Date.now()
  
  // Clean up requests outside of current window
  const windowMs = finalConfig.window * 1000
  rateLimitStore[key] = rateLimitStore[key].filter(
    timestamp => now - timestamp < windowMs
  )
  
  // Check if limit has been reached
  if (rateLimitStore[key].length >= finalConfig.limit) {
    // Calculate reset time
    const oldestTimestamp = Math.min(...rateLimitStore[key])
    const resetTime = oldestTimestamp + windowMs
    const secondsToReset = Math.ceil((resetTime - now) / 1000)
    
    // Set rate limit headers
    const headers = new Headers()
    headers.set('X-RateLimit-Limit', finalConfig.limit.toString())
    headers.set('X-RateLimit-Remaining', '0')
    headers.set('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString())
    headers.set('Retry-After', secondsToReset.toString())
    
    // Return rate limit error
    throw ApiError.tooManyRequests(
      finalConfig.message || `Rate limit exceeded. Try again in ${secondsToReset} seconds.`,
      { meta: { retryAfter: secondsToReset } }
    )
  }
  
  // Record this request
  rateLimitStore[key].push(now)
  
  // Set rate limit headers on successful request
  const headers = new Headers()
  headers.set('X-RateLimit-Limit', finalConfig.limit.toString())
  headers.set('X-RateLimit-Remaining', (finalConfig.limit - rateLimitStore[key].length).toString())
  
  return headers
}

// Wrapper function for API routes
export function withRateLimit(handler: Function, config?: Partial<RateLimitConfig>) {
  return async (...args: any[]) => {
    const request = args[0] as NextRequest
    
    try {
      // Apply rate limiting
      const rateLimit = await rateLimiter(request, config)
      
      // Call the original handler
      const response = await handler(...args)
      
      // Add rate limit headers to the response
      rateLimit.forEach((value, key) => {
        response.headers.set(key, value)
      })
      
      return response
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 429) {
        return error.toResponse()
      }
      throw error
    }
  }
}
