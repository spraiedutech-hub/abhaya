
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;

  // If there's no session cookie, redirect to login for protected pages.
  if (!session) {
    // Avoid redirecting if the user is already on the login or signup page
    if (request.nextUrl.pathname !== '/login' && request.nextUrl.pathname !== '/signup') {
        return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If the user has a session cookie but tries to access login/signup, redirect to home
  if (session && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Proceed to the requested page. The actual session verification will happen
  // in server components/actions that need authenticated data.
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
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
};
