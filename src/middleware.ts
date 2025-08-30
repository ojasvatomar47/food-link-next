import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// You need to import your authMiddleware function here
import { authMiddleware } from './middlewares/authMiddleware';

// The main middleware function that Next.js will run on every request
export async function middleware(req: NextRequest) {
  // Define which routes you want to protect
  const protectedRoutes = [
    '/api/listings',
    '/api/listings/restaurant',
    '/api/listings/'
  ];

  // Check if the requested path starts with any of the protected routes
  if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    // If it's a protected route, run your authMiddleware logic
    return authMiddleware(req);
  }

  // For all other routes, continue without any changes
  return NextResponse.next();
}

// Optional: This configuration object tells Next.js to only run the middleware on these paths,
// which can improve performance.
export const config = {
  matcher: [
    '/api/listings/:path*', // Matches /api/listings and any sub-paths
    '/api/listings/restaurant/:path*' // Matches /api/listings/restaurant and any sub-paths
  ]
};