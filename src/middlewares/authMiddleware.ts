import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, JWTPayload } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export interface JwtPayload extends JWTPayload {
  id: string;
  userType: string;
}

export async function authMiddleware(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'No token, authorization denied' }, { status: 401 });
    }

    // Use jwtVerify from 'jose' for verification in the Edge Runtime
    const { payload } = await jwtVerify(token, JWT_SECRET);

    const decoded = payload as JwtPayload;

    // Attach the decoded user data to the request headers for subsequent use
    const headers = new Headers(req.headers);
    headers.set('x-user-id', decoded.id);
    headers.set('x-user-type', decoded.userType);

    // Return a new request with the updated headers
    return NextResponse.next({ request: { headers } });

  } catch (err) {
    console.error('Token verification failed:', err);
    return NextResponse.json({ error: 'Token is not valid' }, { status: 401 });
  }
}
