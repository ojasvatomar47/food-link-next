import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authMiddleware } from './middlewares/authMiddleware';

export async function middleware(req: NextRequest) {
  const protectedRoutes = [
    '/api/listings',
    '/api/listings/restaurant',
    '/api/orders',
    '/api/orders/restaurant',
    '/api/orders/ngo'
  ];

  if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    return authMiddleware(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/listings/:path*',
    '/api/listings/restaurant/:path*',
    '/api/orders/:path*',
    '/api/orders/restaurant/:path*',
    '/api/orders/ngo/:path*'
  ],
};