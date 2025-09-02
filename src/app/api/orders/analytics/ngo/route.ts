import { NextRequest } from 'next/server';
import { getNgoAnalytics } from '@/controllers/orderController';

export async function GET(req: NextRequest) {
    return getNgoAnalytics(req);
}