import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

// Protected routes pattern
const protectedRoutes = [
  '/api/projects',
  '/build',
  '/projects',
]

export async function middleware(request: NextRequest) {
  // Create supabase middleware client
  const { supabase, response } = createClient(request)

  // Check auth session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Handle API routes authentication
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Continue with authenticated API request
    return response
  }

  // Handle page routes
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Redirect to login for protected routes if no session
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to dashboard if already logged in and trying to access auth pages
  if (session && (
    request.nextUrl.pathname === '/login' || 
    request.nextUrl.pathname === '/signup'
  )) {
    return NextResponse.redirect(new URL('/build', request.url))
  }

  return response
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/api/:path*',
    '/build/:path*',
    '/projects/:path*',
    '/login',
    '/signup',
  ],
}
