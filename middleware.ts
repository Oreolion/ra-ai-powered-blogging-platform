import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);
const isHomeRoute = createRouteMatcher(['/']);

export default clerkMiddleware((auth, req) => {
  if (isHomeRoute(req)) {
    const { userId } = auth();
    if (userId) {
      // User is logged in, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  if (!isPublicRoute(req) && !isHomeRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};