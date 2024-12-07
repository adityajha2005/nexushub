import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  
  // Protected routes that require authentication
  const protectedPaths = [
    '/dashboard', 
    '/profile', 
    '/profile-setup',
    '/book-a-session',  // Add this
    '/find-a-mentor'    // Add this
  ]

  // Public routes that should redirect to dashboard if logged in
  const publicPaths = ['/login', '/signup']
  
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path
  )

  // If user is not logged in and trying to access protected route
  if (isProtectedPath && !token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If user is logged in and trying to access public route
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// Update the matcher configuration to include new protected routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/profile-setup/:path*',
    '/book-a-session/:path*',
    '/find-a-mentor/:path*',
    '/discover/:path*',
    '/login',
    '/signup',
  ]
} 