"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { createListing } from "@/features/listing/listingSlice";
import { AppDispatch, RootState } from "@/features/store";
import toast from "react-hot-toast";
import RestaurantDashboardLayout from "@/components/layout/RestaurantDashboardLayout";

export default function CreateListingPage() {
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    measurement: "kg",
    expiry: 1,
  });

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.listings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(createListing(form));
    if (createListing.fulfilled.match(resultAction)) {
      toast.success("Listing created successfully!");
      router.push("/restaurant/my-listings");
    } else if (createListing.rejected.match(resultAction)) {
      toast.error(error || "Failed to create listing.");
    }
  };

  return (
    <RestaurantDashboardLayout>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create New Listing</h2>
      <p className="text-gray-600 mb-6">Fill out the details for your food donation.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Food Item Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-green-500 focus:ring-green-500"
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
              className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Measurement</label>
            <select
              name="measurement"
              value={form.measurement}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="ml">ml</option>
              <option value="l">l</option>
              <option value="units">units</option>
              <option value="custom">Custom</option>
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
            className="mt-1 block w-full rounded-md border-gray-300 p-3 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value={1}>1 hour</option>
            <option value={2}>2 hours</option>
            <option value={3}>3 hours</option>
            <option value={4}>4 hours</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </RestaurantDashboardLayout>
  );
}
