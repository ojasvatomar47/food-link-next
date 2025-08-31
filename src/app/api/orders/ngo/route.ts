import { NextRequest } from "next/server";
import { getOrdersByNgo } from "@/controllers/orderController";

// @route   GET /api/orders/ngo
// @desc    Fetch all orders for an NGO (private, Charity/NGO)
export async function GET(req: NextRequest) {
    return getOrdersByNgo(req);
}