import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/']);
const isHomeRoute = createRouteMatcher(['/']);
const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  const { pathname } = new URL(req.url);

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  if (!isPublicRoute(req))  auth().protect();

  if (isHomeRoute(req)) {
    if (userId) {
    //   return NextResponse.redirect(new URL('/dashboard', req.url));
    return NextResponse.next();
    }
  }

  if (isDashboardRoute(req)) {
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
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};