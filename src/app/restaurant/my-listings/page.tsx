"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurantListings, deleteListing, Listing } from "@/features/listing/listingSlice";
import { AppDispatch, RootState } from "@/features/store";
import toast from "react-hot-toast";
import RestaurantDashboardLayout from "@/components/layout/RestaurantDashboardLayout";
import UpdateListingModal from "@/components/layout/RestaurantUpdateListingModal";
import { Edit2, Trash2, Frown, PackageOpen, ChevronLeft, ChevronRight } from "lucide-react";

export default function MyListingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { listings, loading, error } = useSelector((state: RootState) => state.listings);
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

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

  const handleEdit = (listing: Listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedListing(null);
  };

  // Pagination Logic
  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = listings.slice(indexOfFirstListing, indexOfLastListing);
  const totalPages = Math.ceil(listings.length / listingsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <RestaurantDashboardLayout>
        <div className="text-center py-20 flex flex-col items-center">
          <p className="text-xl font-medium text-gray-500">Loading listings...</p>
        </div>
      </RestaurantDashboardLayout>
    );
  }

  if (error) {
    return (
      <RestaurantDashboardLayout>
        <div className="text-center py-20 text-red-600 flex flex-col items-center">
          <Frown size={48} className="mb-4" />
          <p className="text-xl font-medium">Error: {error}</p>
        </div>
      </RestaurantDashboardLayout>
    );
  }

  return (
    <RestaurantDashboardLayout>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">My Listings</h2>
      {listings.length === 0 ? (
        <div className="text-center text-gray-500 col-span-full py-20 flex flex-col items-center">
          <PackageOpen size={48} className="mb-4" />
          <p className="text-lg font-medium">You have not created any listings yet.</p>
          <p className="mt-2 text-gray-600">Go to &quot;Create Listing&quot; to add your first one.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Food Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentListings.map((listing) => (
                  <tr key={listing._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{listing.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{listing.quantity} {listing.measurement}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${listing.status === 'available' ? 'bg-green-100 text-green-800' :
                        listing.status === 'claimed' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(listing)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit Listing"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(listing._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Listing"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
      {selectedListing && (
        <UpdateListingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          listing={selectedListing}
        />
      )}
    </RestaurantDashboardLayout>
  );
}