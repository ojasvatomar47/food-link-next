import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order";
import Listing from "@/models/Listing";
import mongoose from "mongoose";

// @route   POST /api/orders
// @desc    Create a new order for a list of listings (from NGO)
// @access  Private (Charity/NGO)
export async function createOrder(req: NextRequest) {
    await dbConnect();
    try {
        const ngoId = req.headers.get('x-user-id');
        const userType = req.headers.get('x-user-type');

        if (!ngoId || userType !== 'Charity/NGO') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { listingIds } = await req.json();

        if (!listingIds || listingIds.length === 0) {
            return NextResponse.json({ error: "No listings provided" }, { status: 400 });
        }

        // Find all listings requested
        const listings = await Listing.find({ _id: { $in: listingIds }, status: 'available' });

        if (listings.length === 0) {
            return NextResponse.json({ error: "No available listings found with the provided IDs" }, { status: 404 });
        }

        // Ensure all requested listings are from the same restaurant
        const restaurantId = listings[0].restaurantId;
        const allFromSameRestaurant = listings.every(l => l.restaurantId.toString() === restaurantId.toString());

        if (!allFromSameRestaurant) {
            return NextResponse.json({ error: "All listings must be from the same restaurant" }, { status: 400 });
        }

        // Create a snapshot of the listings for the order
        const orderListings = listings.map(l => ({
            _id: l._id,
            name: l.name,
            quantity: l.quantity,
            measurement: l.measurement,
            expiry: l.expiry,
            createdAt: l.createdAt,
        }));

        // Create a new order document with the list of listings
        const newOrder = await Order.create({
            restaurantId,
            ngoId: new mongoose.Types.ObjectId(ngoId),
            listings: orderListings,
            status: 'requested',
        });

        // Update the status of each listing to 'claimed' and set the claimedBy field
        const listingUpdatePromises = listings.map(l =>
            Listing.findByIdAndUpdate(l._id, { status: 'claimed', claimedBy: new mongoose.Types.ObjectId(ngoId) })
        );
        await Promise.all(listingUpdatePromises);

        return NextResponse.json(newOrder, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// @route   GET /api/orders/restaurant
// @desc    Fetch all orders for a restaurant
// @access  Private (Restaurant)
export async function getOrdersByRestaurant(req: NextRequest) {
    await dbConnect();
    try {
        const restaurantId = req.headers.get('x-user-id');
        const userType = req.headers.get('x-user-type');

        if (!restaurantId || userType !== 'Restaurant') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const orders = await Order.find({ restaurantId }).sort({ createdAt: -1 });

        return NextResponse.json(orders, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// @route   GET /api/orders/ngo
// @desc    Fetch all orders for an NGO
// @access  Private (Charity/NGO)
export async function getOrdersByNgo(req: NextRequest) {
    await dbConnect();
    try {
        const ngoId = req.headers.get('x-user-id');
        const userType = req.headers.get('x-user-type');

        if (!ngoId || userType !== 'Charity/NGO') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const orders = await Order.find({ ngoId }).sort({ createdAt: -1 });

        return NextResponse.json(orders, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// @route   PATCH /api/orders/[id]
// @desc    Update order status or add a review
// @access  Private (Restaurant/Charity)
export async function updateOrder(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const userId = req.headers.get('x-user-id');
        const userType = req.headers.get('x-user-type');

        if (!userId || !userType) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const body = await req.json();
        const { status, review, confirm } = body;

        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const isRestaurant = order.restaurantId.toString() === userId && userType === 'Restaurant';
        const isNgo = order.ngoId.toString() === userId && userType === 'Charity/NGO';

        if (!isRestaurant && !isNgo) {
            return NextResponse.json({ error: "Not authorized to modify this order" }, { status: 403 });
        }

        // Handle confirmation of a pending status change
        if (confirm) {
            if (!order.pendingStatus) {
                return NextResponse.json({ error: "No pending status to confirm" }, { status: 400 });
            }
            if (order.pendingStatus.requestedBy.toString() === userId) {
                return NextResponse.json({ error: "Cannot confirm your own request" }, { status: 400 });
            }

            if (confirm === 'yes') {
                order.status = order.pendingStatus.status;
            }
            order.pendingStatus = undefined;
        } else if (status) { // Handle a new request for a status change
            switch (status) {
                case 'accepted':
                    if (!isRestaurant) {
                        return NextResponse.json({ error: "Only restaurants can accept an order" }, { status: 403 });
                    }
                    if (order.status !== 'requested') {
                        return NextResponse.json({ error: "Order cannot be accepted at this stage" }, { status: 400 });
                    }
                    order.status = 'accepted';
                    break;
                case 'declined':
                    if (!isRestaurant) {
                        return NextResponse.json({ error: "Only restaurants can decline an order" }, { status: 403 });
                    }
                    order.status = 'declined';
                    await Listing.updateMany({ _id: { $in: order.listings.map((l: any) => l._id) } }, { status: 'available', claimedBy: null });
                    break;
                case 'cancelled':
                case 'fulfilled':
                    if (order.status !== 'accepted') {
                        return NextResponse.json({ error: "Order must be accepted before it can be fulfilled or cancelled" }, { status: 400 });
                    }
                    if (order.pendingStatus) {
                        return NextResponse.json({ error: "A pending status change is already in progress" }, { status: 400 });
                    }
                    order.pendingStatus = { status, requestedBy: new mongoose.Types.ObjectId(userId) };
                    break;
                default:
                    return NextResponse.json({ error: "Invalid status update" }, { status: 400 });
            }
        }

        // Handle reviews
        if (review) {
            if (isRestaurant && !order.restReview) {
                order.restReview = review;
            } else if (isNgo && !order.ngoReview) {
                order.ngoReview = review;
            } else {
                return NextResponse.json({ error: "Review already submitted or not authorized" }, { status: 400 });
            }
        }

        await order.save();
        return NextResponse.json(order, { status: 200 });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}