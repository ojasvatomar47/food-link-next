import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Listing from "@/models/Listing";
import mongoose from "mongoose";

// @route   GET /api/listings
// @desc    Fetch all available listings with restaurant analytics for NGO
// @access  Public
export async function fetchListings(req: NextRequest) {
  await dbConnect();
  try {
    const listings = await Listing.aggregate([
      { $match: { status: 'available' } },
      {
        $lookup: {
          from: 'orders',
          localField: 'restaurantId',
          foreignField: 'restaurantId',
          as: 'restaurantOrders',
        },
      },
      {
        $addFields: {
          avgRestStars: {
            $avg: '$restaurantOrders.restStars',
          },
        },
      },
      {
        $project: {
          restaurantOrders: 0, // Exclude the temporary field
        },
      },
    ]);

    return NextResponse.json(listings, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// @route   GET /api/listings/restaurant
// @desc    Fetch all listings for the authenticated restaurant
// @access  Private (Restaurant)
export async function fetchRestaurantListings(req: NextRequest) {
  await dbConnect();
  try {
    const restaurantId = req.headers.get('x-user-id');
    const userType = req.headers.get('x-user-type');

    if (!restaurantId || userType !== 'Restaurant') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listings = await Listing.find({ restaurantId }).sort({ createdAt: -1 });

    return NextResponse.json(listings, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// @route   POST /api/listings
// @desc    Create a new listing
// @access  Private (Restaurant)
export async function createListing(req: NextRequest) {
  await dbConnect();
  try {
    const restaurantId = req.headers.get('x-user-id');
    const userType = req.headers.get('x-user-type');

    if (!restaurantId || userType !== 'Restaurant') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, quantity, measurement, expiry } = body;

    if (!name || !quantity || !measurement || !expiry) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newListing = await Listing.create({
      restaurantId,
      name,
      quantity,
      measurement,
      expiry,
    });

    return NextResponse.json(newListing, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// @route   PUT /api/listings/[id]
// @desc    Update an entire listing
// @access  Private (Restaurant)
// Corrected signature to accept context directly
// listingController.ts

export async function updateListing(req: NextRequest, context: { params: { id: string } }) {
  await dbConnect();
  const restaurantId = req.headers.get('x-user-id');
  const userType = req.headers.get('x-user-type');

  if (!restaurantId || userType !== 'Restaurant') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id } = context.params;
  const listing = await Listing.findOneAndUpdate(
    { _id: id, restaurantId },
    body,
    { new: true, runValidators: true }
  );

  if (!listing) {
    return NextResponse.json({ error: "Listing not found or not owned by user" }, { status: 404 });
  }

  return NextResponse.json(listing, { status: 200 });
}

// @route   PATCH /api/listings/[id]
// @desc    Partially update a listing (e.g., change status)
// @access  Private (Restaurant/Charity)
// Corrected signature to accept context directly
export async function patchUpdateListing(req: NextRequest, context: { params: { id: string } }) {
  await dbConnect();

  try {
    const userId = req.headers.get("x-user-id");
    const userType = req.headers.get("x-user-type");

    if (!userId || !userType) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id } = context.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (body.status === "claimed") {
      if (userType !== "Charity/NGO") {
        return NextResponse.json({ error: "Only charities can claim a listing" }, { status: 403 });
      }
      if (listing.status !== "available") {
        return NextResponse.json({ error: "Listing is not available" }, { status: 400 });
      }

      listing.status = "claimed";
      listing.claimedBy = new mongoose.Types.ObjectId(userId);

    } else if (body.status === "completed") {
      if (userType !== "Restaurant") {
        return NextResponse.json({ error: "Only the restaurant can mark a listing as completed" }, { status: 403 });
      }
      if (listing.status !== "claimed") {
        return NextResponse.json({ error: "Listing must be claimed first" }, { status: 400 });
      }

      listing.status = "completed";

    } else {
      return NextResponse.json({ error: "Invalid status update" }, { status: 400 });
    }

    await listing.save();
    return NextResponse.json(listing, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// @route   DELETE /api/listings/[id]
// @desc    Delete a listing
// @access  Private (Restaurant)
// Corrected signature to accept context directly
export async function deleteListing(req: NextRequest, context: { params: { id: string } }) {
  await dbConnect();

  try {
    const restaurantId = req.headers.get("x-user-id");
    const userType = req.headers.get("x-user-type");

    if (!restaurantId || userType !== "Restaurant") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params;
    const result = await Listing.findOneAndDelete({ _id: id, restaurantId });

    if (!result) {
      return NextResponse.json({ error: "Listing not found or not owned by user" }, { status: 404 });
    }

    return NextResponse.json({ message: "Listing deleted successfully" }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
