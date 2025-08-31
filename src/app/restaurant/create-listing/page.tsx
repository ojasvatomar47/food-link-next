"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { createListing } from "@/features/listing/listingSlice";
import { AppDispatch, RootState } from "@/features/store";
import toast from "react-hot-toast";
import RestaurantDashboardLayout from "@/components/layout/RestaurantDashboardLayout";
import { PlusCircle } from "lucide-react";

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
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Create New Listing</h2>
      <p className="text-lg text-gray-600 mb-8">Fill out the details for your food donation and help reduce waste.</p>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Food Item Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-2 block w-full rounded-xl border border-gray-300 p-4 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-xl border border-gray-300 p-4 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="measurement" className="block text-sm font-medium text-gray-700">Measurement</label>
            <select
              id="measurement"
              name="measurement"
              value={form.measurement}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-xl border border-gray-300 p-4 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
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
          <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">Expiry (in hours)</label>
          <select
            id="expiry"
            name="expiry"
            value={form.expiry}
            onChange={handleChange}
            required
            className="mt-2 block w-full rounded-xl border border-gray-300 p-4 shadow-sm focus:border-green-500 focus:ring-green-500 transition-colors"
          >
            <option value={1}>1 hour</option>
            <option value={2}>2 hours</option>
            <option value={3}>3 hours</option>
            <option value={4}>4 hours</option>
          </select>
        </div>
        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-xl bg-green-600 px-6 py-4 text-lg font-semibold text-white shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2" size={20} />
              Create Listing
            </>
          )}
        </button>
      </form>
    </RestaurantDashboardLayout>
  );
}