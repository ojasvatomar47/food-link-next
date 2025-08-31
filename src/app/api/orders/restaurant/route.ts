import { NextRequest } from "next/server";
import { getOrdersByRestaurant } from "@/controllers/orderController";

// @route   GET /api/orders/restaurant
// @desc    Fetch all orders for a restaurant (private, Restaurant)
export async function GET(req: NextRequest) {
    return getOrdersByRestaurant(req);
}