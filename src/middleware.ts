
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decode } from 'jsonwebtoken';

// Define admin routes
const adminPaths = ['/admin', '/record-sale', '/add-user'];
// Hardcode the admin email for role checking
const ADMIN_EMAIL = 'alice@example.com';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // If there's no session cookie, redirect to login for protected pages.
  if (!session) {
    if (pathname !== '/login' && pathname !== '/signup') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // If the user has a session cookie but tries to access login/signup, redirect to home
  if (pathname === '/login' || pathname === '/signup') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Admin route protection
  if (adminPaths.some(path => pathname.startsWith(path))) {
    try {
      const decodedToken = decode(session);
      if (typeof decodedToken === 'object' && decodedToken !== null && 'email' in decodedToken) {
        const userEmail = decodedToken.email as string;
        if (userEmail !== ADMIN_EMAIL) {
          // If not an admin, redirect to the dashboard
          return NextResponse.redirect(new URL('/', request.url));
        }
      } else {
        // If token is invalid or doesn't contain email, redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      console.error('Token decoding failed:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

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
