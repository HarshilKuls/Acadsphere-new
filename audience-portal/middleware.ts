import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check for Supabase session cookies (starts with sb- and ends with -auth-token)
  const hasSupabaseCookie = request.cookies.getAll().some(cookie => 
    cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
  );

  // We also check if the user is explicitly passing a guest bypass or has a standard session cookie
  // Since Acadsphere uses localStorage for some sessions, we look for our custom cookie too if it exists.
  const hasCustomCookie = request.cookies.has('acadsphere_session');

  // If trying to access protected routes without any valid session cookie
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!hasSupabaseCookie && !hasCustomCookie) {
      // Redirect to the login page (home)
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
