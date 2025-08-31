import { NextRequest } from "next/server";
import { updateOrder } from "@/controllers/orderController";

// @route   PATCH /api/orders/:id
// @desc    Update order status or add a review (private, Restaurant/Charity)
export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
    return updateOrder(req, context);
}