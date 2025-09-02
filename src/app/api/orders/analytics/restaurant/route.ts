import { NextRequest } from 'next/server';
import { getRestaurantAnalytics } from '@/controllers/orderController';

export async function GET(req: NextRequest) {
    return getRestaurantAnalytics(req);
}