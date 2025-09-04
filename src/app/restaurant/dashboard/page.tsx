"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/features/store";
import RestaurantDashboardLayout from "@/components/layout/RestaurantDashboardLayout";
import { Frown, PackageOpen, ChevronLeft, ChevronRight, RotateCw, Star, StarHalf } from "lucide-react";
import { fetchRestaurantAnalytics } from "@/features/order/orderSlice";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function RestaurantDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { analytics, loading, error } = useSelector((state: RootState) => state.orders);

  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [currentNgoStatsPage, setCurrentNgoStatsPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchRestaurantAnalytics());
  }, [dispatch]);

  const statsData = analytics?.stats?.map(s => ({
    name: s._id,
    value: s.count,
  })) || [];

  const COLORS = ['#4caf50', '#ff5722', '#ffc107', '#9e9e9e', '#03a9f4'];

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

  // Pagination for Reviews
  const indexOfLastReview = currentReviewPage * itemsPerPage;
  const indexOfFirstReview = indexOfLastReview - itemsPerPage;
  const currentReviews = analytics?.reviews?.slice(indexOfFirstReview, indexOfLastReview) || [];
  const totalReviewPages = Math.ceil((analytics?.reviews?.length || 0) / itemsPerPage);

  // Pagination for NGO Stats
  const indexOfLastNgoStat = currentNgoStatsPage * itemsPerPage;
  const indexOfFirstNgoStat = indexOfLastNgoStat - itemsPerPage;
  const currentNgoStats = analytics?.ngoStats?.slice(indexOfFirstNgoStat, indexOfLastNgoStat) || [];
  const totalNgoStatsPages = Math.ceil((analytics?.ngoStats?.length || 0) / itemsPerPage);

  const paginateReviews = (pageNumber: number) => setCurrentReviewPage(pageNumber);
  const paginateNgoStats = (pageNumber: number) => setCurrentNgoStatsPage(pageNumber);
  const handleRefresh = () => {
    dispatch(fetchRestaurantAnalytics());
  };


  if (loading) {
    return (
      <RestaurantDashboardLayout>
        <div className="text-center py-20 flex flex-col items-center">
          <p className="text-xl font-medium text-gray-500">Loading dashboard data...</p>
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <button
          onClick={handleRefresh}
          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
          title="Refresh Dashboard"
          disabled={loading}
        >
          <RotateCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white shadow-lg border">
            <h3 className="text-xl font-semibold capitalize text-gray-700">Average Rating</h3>
            <div className="flex items-center space-x-2 mt-2">
              <p className="text-4xl font-bold text-blue-600">{analytics?.avgStars || 0}</p>
              {renderStars(analytics?.avgStars)}
            </div>
          </div>
          {statsData.map((stat, index) => (
            <div key={stat.name} className="p-6 rounded-xl bg-white shadow-lg border">
              <h3 className="text-xl font-semibold capitalize text-gray-700">{stat.name} Orders</h3>
              <p className="text-4xl font-bold mt-2 text-green-600">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-white shadow-lg border">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Order Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {(analytics?.reviews && analytics.reviews.length > 0) && (
            <div className="p-6 rounded-xl bg-white shadow-lg border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700">Recent Reviews from NGOs</h3>
                {totalReviewPages > 1 && (
                  <div className="flex space-x-2">
                    <button onClick={() => paginateReviews(currentReviewPage - 1)} disabled={currentReviewPage === 1} className="p-1 rounded-md bg-gray-100 disabled:opacity-50">
                      <ChevronLeft size={16} />
                    </button>
                    <button onClick={() => paginateReviews(currentReviewPage + 1)} disabled={currentReviewPage === totalReviewPages} className="p-1 rounded-md bg-gray-100 disabled:opacity-50">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
              <ul className="space-y-4">
                {currentReviews.map((review, index) => (
                  <li key={index} className="bg-gray-50 p-4 rounded-md border">
                    <div className="flex items-center space-x-2 mb-2">
                      {renderStars(review.ngoStars)}
                    </div>
                    <p className="text-gray-800 italic">
                      {review.ngoReview ? `"${review.ngoReview}"` : "(No review left)"}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      - NGO User
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-6 rounded-xl bg-white shadow-lg border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">NGO Performance</h3>
            {totalNgoStatsPages > 1 && (
              <div className="flex space-x-2">
                <button onClick={() => paginateNgoStats(currentNgoStatsPage - 1)} disabled={currentNgoStatsPage === 1} className="p-1 rounded-md bg-gray-100 disabled:opacity-50">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => paginateNgoStats(currentNgoStatsPage + 1)} disabled={currentNgoStatsPage === totalNgoStatsPages} className="p-1 rounded-md bg-gray-100 disabled:opacity-50">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NGO</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fulfilled Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cancelled Orders</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentNgoStats.map(stat => (
                  <tr key={stat._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      NGO {stat._id.slice(-4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {stat.fulfilledCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {stat.cancelledCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RestaurantDashboardLayout>
  );
}