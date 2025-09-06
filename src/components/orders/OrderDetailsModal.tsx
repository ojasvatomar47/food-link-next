"use client";

import React, { useState } from "react";
import { XCircle, Star, StarHalf } from "lucide-react";
import { Order, updateOrder } from "@/features/order/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/features/store";
import toast from "react-hot-toast";
import ChatRoom from "../ChatRoom";

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
}

export default function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const [reviewText, setReviewText] = useState("");
    const [stars, setStars] = useState(0);

    if (!isOpen || !order) return null;

    const isRestaurant = user?.userType === 'Restaurant';
    const isReviewable = order.status === 'fulfilled';
    const hasSubmittedReview = isRestaurant ? !!order.restReview : !!order.ngoReview;
    const otherUserReview = isRestaurant ? order.ngoReview : order.restReview;
    const otherUserStars = isRestaurant ? order.ngoStars : order.restStars;

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (stars === 0 || reviewText.trim() === '') {
            toast.error("Please provide a rating and a review.");
            return;
        }

        const resultAction = await dispatch(updateOrder({
            id: order._id,
            updateData: { review: reviewText, stars: stars }
        }));

        if (updateOrder.fulfilled.match(resultAction)) {
            toast.success("Review submitted successfully!");
            setReviewText('');
            setStars(0);
            onClose();
        } else {
            toast.error("Failed to submit review.");
        }
    };

    const renderStars = (rating: number | undefined) => {
        if (rating === undefined) return null;

        const starsArray = [];
        const fullStars = Math.floor(rating); // number of full stars
        const hasHalfStar = rating % 1 >= 0.5; // check for .5
        const totalStars = 5;

        for (let i = 1; i <= totalStars; i++) {
            if (i <= fullStars) {
                // full star
                starsArray.push(
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                );
            } else if (i === fullStars + 1 && hasHalfStar) {
                // half star
                starsArray.push(
                    <StarHalf key={i} size={16} className="text-yellow-400 fill-current" />
                );
            } else {
                // empty star
                starsArray.push(
                    <Star key={i} size={16} className="text-gray-300" />
                );
            }
        }

        return <div className="flex space-x-1">{starsArray}</div>;
    };

    const currentUserReview = isRestaurant ? order.restReview : order.ngoReview;
    const currentUserStars = isRestaurant ? order.restStars : order.ngoStars;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <XCircle size={24} />
                    </button>
                </div>

                {/* Order Info */}
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <p>
                        <span className="font-semibold text-gray-800">Order ID:</span> {order._id}
                    </p>
                    <p>
                        <span className="font-semibold text-gray-800">Status:</span> {order.status}
                    </p>
                    <p>
                        <span className="font-semibold text-gray-800">Ordered On:</span> {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>

                {/* Listings Table */}
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Requested Listings</h4>
                <div className="overflow-x-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {order.listings.map((listing) => (
                                <tr key={listing._id}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{listing.name}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{listing.quantity} {listing.measurement}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Review from the other user */}
                {isReviewable && otherUserReview && (
                    <div className="mt-6 border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">
                            Review from the {isRestaurant ? 'NGO' : 'Restaurant'}
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-md border">
                            <div className="flex items-center space-x-2 mb-2">
                                {renderStars(otherUserStars)}
                            </div>
                            <p className="text-gray-800 italic">&quot;{otherUserReview}&quot;</p>
                        </div>
                    </div>
                )}

                {/* Current user's submitted review */}
                {isReviewable && hasSubmittedReview && (
                    <div className="mt-6 border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Your Review</h4>
                        <div className="bg-gray-50 p-4 rounded-md border">
                            <div className="flex items-center space-x-2 mb-2">
                                {renderStars(currentUserStars)}
                            </div>
                            <p className="text-gray-800 italic">&quot;{currentUserReview}&quot;</p>
                        </div>
                    </div>
                )}

                {/* Review submission form */}
                {isReviewable && !hasSubmittedReview && (
                    <div className="mt-6 border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Leave a Review</h4>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rating</label>
                                <div className="flex space-x-1 mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={24}
                                            onClick={() => setStars(star)}
                                            className={`cursor-pointer ${stars >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700">Review</label>
                                <textarea
                                    id="reviewText"
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-black"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}