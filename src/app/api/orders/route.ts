import { NextRequest } from "next/server";
import { createOrder } from "@/controllers/orderController";

// @route   POST /api/orders
// @desc    Create a new order (private, Charity/NGO)
export async function POST(req: NextRequest) {
    return createOrder(req);
}