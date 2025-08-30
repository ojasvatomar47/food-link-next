"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurantListings, deleteListing } from "@/features/listing/listingSlice";
import { AppDispatch, RootState } from "@/features/store";
import toast from "react-hot-toast";
import RestaurantDashboardLayout from "@/components/layout/RestaurantDashboardLayout";
import { Edit2, Trash2 } from "lucide-react";

export default function MyListingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { listings, loading, error } = useSelector((state: RootState) => state.listings);

  useEffect(() => {
    dispatch(fetchRestaurantListings());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      const resultAction = await dispatch(deleteListing(id));
      if (deleteListing.fulfilled.match(resultAction)) {
        toast.success("Listing deleted successfully!");
      } else {
        toast.error("Failed to delete listing.");
      }
    }
  };

  const handleEdit = (id: string) => {
    // Corrected toast call to use the generic toast() method
    toast("Edit functionality is not yet implemented.", {
      icon: '⚙️', // Use an emoji or a component for a custom icon
    });
  };

  if (loading) {
    return (
      <RestaurantDashboardLayout>
        <div className="text-center py-10">
          <p>Loading listings...</p>
        </div>
      </RestaurantDashboardLayout>
    );
  }

  if (error) {
    return (
      <RestaurantDashboardLayout>
        <div className="text-center py-10 text-red-600">
          <p>Error: {error}</p>
        </div>
      </RestaurantDashboardLayout>
    );
  }

  return (
    <RestaurantDashboardLayout>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Listings</h2>
      <div className="space-y-4">
        {listings.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p>You have not created any listings yet.</p>
            <p className="mt-2">Go to &quot;Create Listing&quot; to add your first one.</p>
          </div>
        ) : (
          listings.map((listing) => (
            <div key={listing._id} className="rounded-lg bg-gray-50 p-6 shadow-sm flex items-center justify-between transition-transform duration-200 hover:scale-[1.01]">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{listing.name}</h3>
                <p className="text-gray-600">
                  <span className="font-medium">Quantity:</span> {listing.quantity} {listing.measurement}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Status:</span>
                  <span className={`ml-1 font-semibold ${
                    listing.status === 'available' ? 'text-green-500' :
                    listing.status === 'claimed' ? 'text-yellow-500' : 'text-gray-500'
                  }`}>
                    {listing.status}
                  </span>
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(listing._id)}
                  className="rounded-full p-2 text-blue-500 hover:bg-blue-100 transition-colors duration-200"
                  title="Edit Listing"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(listing._id)}
                  className="rounded-full p-2 text-red-500 hover:bg-red-100 transition-colors duration-200"
                  title="Delete Listing"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </RestaurantDashboardLayout>
  );
}
