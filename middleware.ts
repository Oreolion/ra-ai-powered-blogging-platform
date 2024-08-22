import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);
const isHomeRoute = createRouteMatcher(['/']);
const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware((auth, req) => {
    const { userId } = auth();
    const { pathname } = req.nextUrl;
  
    // Handle public routes
    if (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
      return NextResponse.next();
    }
  
    // Handle home route
    if (pathname === '/') {
      if (userId) {
        return NextResponse.next();
      }
      return NextResponse.next();
    }
  
    // Handle dashboard routes
    if (pathname.startsWith('/dashboard')) {
      if (!userId) {
        return NextResponse.redirect(new URL('/sign-in', req.url));
      }
      return NextResponse.next();
    }
  
    // For all other routes, protect access
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    return NextResponse.next();
  });
  
  export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
  };