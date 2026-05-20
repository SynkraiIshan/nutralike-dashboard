import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_TOKEN_COOKIE, isTokenValid } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const isAuthenticated = isTokenValid(token);
  const { pathname } = request.nextUrl;

  // Protected routes list
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/ingredients') ||
                           pathname.startsWith('/quotations') ||
                           pathname.startsWith('/uploads') ||
                           pathname.startsWith('/settings') ||
                           pathname.startsWith('/reports');

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and visiting login or root, redirect to dashboard
  if ((pathname === '/login' || pathname === '/') && isAuthenticated) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  if (pathname === '/') {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\.png|.*\\.svg).*)'],
};
