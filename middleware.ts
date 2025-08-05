import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Skip middleware for static files, API routes, and special paths
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.includes('.') ||
    path.startsWith('/favicon') ||
    path.startsWith('/debug') ||
    path.startsWith('/test')
  ) {
    return NextResponse.next()
  }

  // Only handle root route redirects - let client handle everything else
  if (path === '/') {
    console.log('🏠 Root route - redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Allow all other routes through - let client-side auth handle protection
  console.log(`➡️ Allowing access to: ${path}`)
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}