"use client";

import React from "react";
import { XCircle } from "lucide-react";
import { Order } from "@/features/order/orderSlice";

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
}

export default function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl transition-transform duration-300 transform scale-100 opacity-100">
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
            </div>
        </div>
    );
}
