"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/features/store";
import NgoDashboardLayout from "@/components/layout/NGODashboardLayout";
import { Frown, PackageOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchNgoAnalytics } from "@/features/order/orderSlice";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function NgoDashboardPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { analytics, loading, error } = useSelector((state: RootState) => state.orders);

    const [currentReviewPage, setCurrentReviewPage] = useState(1);
    const [currentRestStatsPage, setCurrentRestStatsPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(fetchNgoAnalytics());
    }, [dispatch]);

    const statsData = analytics?.stats?.map(s => ({
        name: s._id,
        value: s.count,
    })) || [];

    const COLORS = ['#4caf50', '#ff5722', '#ffc107', '#9e9e9e', '#03a9f4'];

    // Pagination for Reviews
    const indexOfLastReview = currentReviewPage * itemsPerPage;
    const indexOfFirstReview = indexOfLastReview - itemsPerPage;
    const currentReviews = analytics?.reviews?.slice(indexOfFirstReview, indexOfLastReview) || [];
    const totalReviewPages = Math.ceil((analytics?.reviews?.length || 0) / itemsPerPage);

    // Pagination for Restaurant Stats
    const indexOfLastRestStat = currentRestStatsPage * itemsPerPage;
    const indexOfFirstRestStat = indexOfLastRestStat - itemsPerPage;
    const currentRestStats = analytics?.restStats?.slice(indexOfFirstRestStat, indexOfLastRestStat) || [];
    const totalRestStatsPages = Math.ceil((analytics?.restStats?.length || 0) / itemsPerPage);

    const paginateReviews = (pageNumber: number) => setCurrentReviewPage(pageNumber);
    const paginateRestStats = (pageNumber: number) => setCurrentRestStatsPage(pageNumber);


    if (loading) {
        return (
            <NgoDashboardLayout>
                <div className="text-center py-20 flex flex-col items-center">
                    <p className="text-xl font-medium text-gray-500">Loading dashboard data...</p>
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
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statsData.map((stat, index) => (
                        <div key={stat.name} className="p-6 rounded-xl bg-white shadow-lg border">
                            <h3 className="text-xl font-semibold capitalize text-gray-700">{stat.name} Orders</h3>
                            <p className="text-4xl font-bold mt-2 text-blue-600">{stat.value}</p>
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

                    {(analytics?.reviews && analytics?.reviews?.length > 0) && (
                        <div className="p-6 rounded-xl bg-white shadow-lg border">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-700">Recent Reviews from Restaurants</h3>
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
                            {currentReviews.length > 0 ? (
                                <ul className="space-y-4">
                                    {currentReviews.map((review, index) => (
                                        <li key={index} className="bg-gray-50 p-4 rounded-md border">
                                            <p className="text-gray-800 italic">
                                                {review.restReview ? `"${review.restReview}"` : "(No review left)"}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                - Restaurant User
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No reviews yet.</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 rounded-xl bg-white shadow-lg border">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-700">Restaurant Performance</h3>
                        {totalRestStatsPages > 1 && (
                            <div className="flex space-x-2">
                                <button onClick={() => paginateRestStats(currentRestStatsPage - 1)} disabled={currentRestStatsPage === 1} className="p-1 rounded-md bg-gray-100 disabled:opacity-50">
                                    <ChevronLeft size={16} />
                                </button>
                                <button onClick={() => paginateRestStats(currentRestStatsPage + 1)} disabled={currentRestStatsPage === totalRestStatsPages} className="p-1 rounded-md bg-gray-100 disabled:opacity-50">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restaurant</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fulfilled Orders</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cancelled Orders</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentRestStats.map(stat => (
                                    <tr key={stat._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            Restaurant {stat._id.slice(-4)}
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
        </NgoDashboardLayout>
    );
}