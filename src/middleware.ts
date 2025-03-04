import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware runs before the request is processed
export function middleware(request: NextRequest) {
  // Get the response
  const response = NextResponse.next();
  
  // Add a header to help with hydration issues
  response.headers.set('x-middleware-cache', 'no-cache');
  
  return response;
}

// Configure the middleware to run on specific paths
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