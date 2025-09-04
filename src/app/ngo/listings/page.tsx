"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchListings, ListingWithAvgStars } from "@/features/listing/listingSlice";
import { createOrder } from "@/features/order/orderSlice";
import { AppDispatch, RootState } from "@/features/store";
import toast from "react-hot-toast";
import NgoDashboardLayout from "@/components/layout/NGODashboardLayout";
import { Frown, PackageOpen, ChevronLeft, ChevronRight, ShoppingBag, PlusCircle, Trash2, RotateCw, Star, StarHalf } from "lucide-react";

interface BasketItem {
  listingId: string;
  name: string;
  restaurantId: string;
}

export default function NgoListingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { listings, loading, error } = useSelector((state: RootState) => state.listings);

  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [basket, setBasket] = useState<BasketItem[]>([]);

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  const uniqueRestaurants = useMemo(() => {
    const restaurantMap = new Map<string, string>();
    listings.forEach(l => {
      restaurantMap.set(l.restaurantId, `Restaurant ${l.restaurantId.substring(l.restaurantId.length - 4)}`);
    });
    return Array.from(restaurantMap.entries());
  }, [listings]);

  const filteredListings = useMemo(() => {
    let filtered = listings;

    if (selectedRestaurantId) {
      filtered = filtered.filter(l => l.restaurantId === selectedRestaurantId);
    }

    if (searchTerm) {
      filtered = filtered.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return filtered;
  }, [listings, selectedRestaurantId, searchTerm]);

  const handleAddToBasket = (listing: ListingWithAvgStars) => {
    if (basket.length > 0 && basket[0].restaurantId !== listing.restaurantId) {
      toast.error("You can only add listings from one restaurant at a time.");
      return;
    }

    if (basket.some(item => item.listingId === listing._id)) {
      toast.error("This listing is already in your basket.");
      return;
    }

    setBasket(prev => [...prev, {
      listingId: listing._id,
      name: listing.name,
      restaurantId: listing.restaurantId,
    }]);

    if (basket.length === 0) {
      setSelectedRestaurantId(listing.restaurantId);
    }

    toast.success(`${listing.name} added to basket!`);
  };

  const handleRemoveFromBasket = (listingId: string) => {
    const updatedBasket = basket.filter(item => item.listingId !== listingId);
    setBasket(updatedBasket);

    if (updatedBasket.length === 0) {
      setSelectedRestaurantId(null);
    }

    toast.success("Listing removed from basket.");
  };

  const handleRequestOrder = async () => {
    if (basket.length === 0) {
      toast.error("Your basket is empty. Add some listings to place an order.");
      return;
    }

    const listingIds = basket.map(item => item.listingId);
    const resultAction = await dispatch(createOrder(listingIds));

    if (createOrder.fulfilled.match(resultAction)) {
      toast.success("Order placed successfully! We'll notify the restaurant.");
      setBasket([]);
      setSelectedRestaurantId(null);
      dispatch(fetchListings());
    } else if (createOrder.rejected.match(resultAction)) {
      toast.error(resultAction.payload as string);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchListings());
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

  // Pagination Logic
  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = filteredListings.slice(indexOfFirstListing, indexOfLastListing);
  const totalPages = Math.ceil(filteredListings.length / listingsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <NgoDashboardLayout>
        <div className="text-center py-20 flex flex-col items-center">
          <p className="text-xl font-medium text-gray-500">Loading listings...</p>
        </div>
      </NgoDashboardLayout>
    );
  }

  if (error) {
    return (
      <NgoDashboardLayout>
        <div className="text-center py-20 text-red-600 flex flex-col items-center">
          <Frown size={48} className="mb-4" />
          <p className="text-xl font-medium">Error: {error}</p>
        </div>
      </NgoDashboardLayout>
    );
  }

  return (
    <NgoDashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Browse Listings</h2>
        <button
          onClick={handleRefresh}
          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
          title="Refresh Listings"
          disabled={loading}
        >
          <RotateCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6 p-4 bg-gray-50 rounded-xl shadow-inner">
        <input
          type="text"
          placeholder="Search for food item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={selectedRestaurantId || ''}
          onChange={(e) => setSelectedRestaurantId(e.target.value || null)}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Restaurants</option>
          {uniqueRestaurants.map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
        <button
          onClick={() => { setSearchTerm(''); setSelectedRestaurantId(null); }}
          className="w-full md:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Clear Filters
        </button>
      </div>

      {listings.length === 0 ? (
        <div className="text-center text-gray-500 col-span-full py-20 flex flex-col items-center">
          <PackageOpen size={48} className="mb-4" />
          <p className="text-lg font-medium">No available listings found.</p>
          <p className="mt-2 text-gray-600">Check back later for new food donations.</p>
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
                    Restaurant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Restaurant&apos;s Rating
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {uniqueRestaurants.find(([id]) => id === listing.restaurantId)?.[1]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {listing.avgRestStars ? renderStars(listing.avgRestStars) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleAddToBasket(listing)}
                        className="text-blue-600 hover:text-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={basket.length > 0 && basket[0].restaurantId !== listing.restaurantId}
                        title="Add to Basket"
                      >
                        <PlusCircle size={20} />
                      </button>
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

      {/* Floating Basket */}
      {basket.length > 0 && (
        <div className="fixed bottom-4 right-4 z-20 bg-white p-4 rounded-xl shadow-2xl border-2 border-blue-200 w-80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-blue-700 flex items-center space-x-2">
              <ShoppingBag size={20} />
              <span>Basket ({basket.length})</span>
            </h3>
            <button
              onClick={() => setBasket([])}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Clear Basket"
            >
              <Trash2 size={20} />
            </button>
          </div>
          <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {basket.map(item => (
              <li key={item.listingId} className="flex items-center justify-between text-sm text-gray-800">
                <span>{item.name}</span>
                <button
                  onClick={() => handleRemoveFromBasket(item.listingId)}
                  className="text-red-500 hover:text-red-700 transition-colors ml-2"
                  title="Remove from Basket"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleRequestOrder}
            className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Request Order
          </button>
        </div>
      )}
    </NgoDashboardLayout>
  );
}