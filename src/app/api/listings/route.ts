import { NextRequest } from "next/server";
import {
  fetchListings,
  createListing,
} from "@/controllers/listingController";

// @route   GET /api/listings
// @desc    Fetch all available listings (public)
export async function GET(req: NextRequest) {
  return fetchListings(req);
}

// @route   POST /api/listings
// @desc    Create a new listing (private, Restaurant)
export async function POST(req: NextRequest) {
  return createListing(req);
}