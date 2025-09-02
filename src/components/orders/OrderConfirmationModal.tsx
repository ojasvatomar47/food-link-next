"use client";

import React from "react";
import { XCircle, CheckCircle2 } from "lucide-react";
import { Order } from "@/features/order/orderSlice";

interface OrderConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onConfirm: () => void;
    onReject: () => void;
}

export default function OrderConfirmationModal({ isOpen, onClose, order, onConfirm, onReject }: OrderConfirmationModalProps) {
    if (!isOpen || !order || !order.pendingStatus) return null;

    const status = order.pendingStatus.status;
    const isFulfilled = status === 'fulfilled';
    const actionText = isFulfilled ? 'fulfill' : 'cancel';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Confirm Order {status}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <XCircle size={24} />
                    </button>
                </div>

                {/* Confirmation Message */}
                <div className="mb-6">
                    <p className="text-gray-700 text-lg">
                        Another user has requested to {actionText} this order. Do you agree with this action?
                    </p>
                    <p className="mt-2 text-gray-500 text-sm">
                        Please review the order details before confirming.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onReject}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Reject
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-semibold text-white rounded-md transition-colors ${isFulfilled ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                            }`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}