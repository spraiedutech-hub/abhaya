
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;

  // If there's no session, redirect to login.
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify the session cookie. If invalid, redirect to login.
  try {
    await auth.verifySessionCookie(session, true);
  } catch (error) {
    console.error('Session cookie verification failed:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If authenticated, proceed to the requested page.
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
     * - login (the login page)
     * - signup (the signup page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)',
  ],
};
