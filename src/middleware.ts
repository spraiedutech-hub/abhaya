
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

  const isPublicPath = pathname === '/login' || pathname === '/signup';

  // If there's no session cookie, redirect to login for protected pages.
  if (!session) {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // If there is a session, validate it.
  try {
    const decodedToken = decode(session);
    if (typeof decodedToken !== 'object' || decodedToken === null || !decodedToken.uid) {
      throw new Error('Invalid token structure');
    }

    // This check handles the expiration of the token. `exp` is in seconds.
    if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
        throw new Error('Token expired');
    }

    // If the user has a valid session but tries to access login/signup, redirect to home.
    // We allow POST requests to go through so the server actions can run.
    if (isPublicPath && request.method !== 'POST') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Admin route protection
    if (adminPaths.some(path => pathname.startsWith(path))) {
      const userEmail = decodedToken.email as string;
      if (userEmail !== ADMIN_EMAIL) {
        // If not an admin, redirect to the dashboard
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  } catch (error) {
    console.error('Token validation failed:', error);
    // If token is invalid for any reason, delete the cookie and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    return response;
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
