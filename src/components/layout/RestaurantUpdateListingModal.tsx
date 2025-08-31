"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateListing, Listing } from '@/features/listing/listingSlice';
import { AppDispatch, RootState } from '@/features/store';
import toast from 'react-hot-toast';
import { X, Save, Loader2 } from 'lucide-react';

interface UpdateListingModalProps {
    isOpen: boolean;
    onClose: () => void;
    listing: Listing;
}

export default function UpdateListingModal({ isOpen, onClose, listing }: UpdateListingModalProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.listings);

    const [form, setForm] = useState({
        name: listing.name,
        quantity: listing.quantity,
        measurement: listing.measurement,
        expiry: listing.expiry,
    });

    // Update form state when a new listing is passed in
    useEffect(() => {
        if (listing) {
            setForm({
                name: listing.name,
                quantity: listing.quantity,
                measurement: listing.measurement,
                expiry: listing.expiry,
            });
        }
    }, [listing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const resultAction = await dispatch(updateListing({ id: listing._id, updateData: form }));
        if (updateListing.fulfilled.match(resultAction)) {
            toast.success("Listing updated successfully!");
            onClose();
        } else if (updateListing.rejected.match(resultAction)) {
            toast.error(error || "Failed to update listing.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-lg relative transform transition-all scale-100 ease-out duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Update Listing</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Food Item Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-xl border border-gray-300 p-4 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quantity</label>
                            <input
                                type="text"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-xl border border-gray-300 p-4 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Measurement</label>
                            <select
                                name="measurement"
                                value={form.measurement}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-xl border border-gray-300 p-4 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
                            >
                                <option value="kg">kg</option>
                                <option value="g">g</option>
                                <option value="ml">ml</option>
                                <option value="l">l</option>
                                <option value="units">units</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Expiry (in hours)</label>
                        <select
                            name="expiry"
                            value={form.expiry}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-xl border border-gray-300 p-4 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
                        >
                            <option value={1}>1 hour</option>
                            <option value={2}>2 hours</option>
                            <option value={3}>3 hours</option>
                            <option value={4}>4 hours</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={20} />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2" size={20} />
                                Update Listing
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}