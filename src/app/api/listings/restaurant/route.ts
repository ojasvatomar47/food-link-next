import { NextRequest } from "next/server";
import { fetchRestaurantListings } from "@/controllers/listingController";

// @route   GET /api/listings/restaurant
// @desc    Fetch listings for the authenticated restaurant (private)
export async function GET(req: NextRequest) {
  return fetchRestaurantListings(req);
}