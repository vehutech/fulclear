// ================================================================
// FILE: src/middleware.ts
// PURPOSE: Route protection middleware
// ================================================================
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionUser } from '@/lib/auth/session-manager';

export async function middleware(request: NextRequest) {
  const session = await getSessionUser();
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ['/', '/login'];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // API routes don't need middleware (they handle auth internally)
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Role-based access control
    if (pathname.startsWith('/dashboard/student') && session.role !== 'student') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname.startsWith('/dashboard/official') && session.role !== 'official') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname.startsWith('/dashboard/admin') && session.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};