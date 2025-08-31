"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersByRestaurant, updateOrder, Order } from "@/features/order/orderSlice";
import { AppDispatch, RootState } from "@/features/store";
import toast from "react-hot-toast";
import RestaurantDashboardLayout from "@/components/layout/RestaurantDashboardLayout";
import { Edit2, Trash2, Frown, PackageOpen, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import OrderDetailsModal from "@/components/orders/OrderDetailsModal";

export default function RestaurantOrdersPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { orders, loading, error } = useSelector((state: RootState) => state.orders);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        dispatch(fetchOrdersByRestaurant());
    }, [dispatch]);

    const handleUpdateStatus = async (id: string, status: Order['status']) => {
        const resultAction = await dispatch(updateOrder({ id, updateData: { status } }));
        if (updateOrder.fulfilled.match(resultAction)) {
            toast.success(`Order ${status} successfully!`);
        } else if (updateOrder.rejected.match(resultAction)) {
            toast.error(resultAction.payload as string);
        }
    };

    const handleOpenModal = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    // Pagination Logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return (
            <RestaurantDashboardLayout>
                <div className="text-center py-20 flex flex-col items-center">
                    <p className="text-xl font-medium text-gray-500">Loading orders...</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Order History</h2>
            {orders.length === 0 ? (
                <div className="text-center text-gray-500 col-span-full py-20 flex flex-col items-center">
                    <PackageOpen size={48} className="mb-4" />
                    <p className="text-lg font-medium">You have not received any orders yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-6 shadow-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Items
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer" onClick={() => handleOpenModal(order)}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900 truncate max-w-[150px]">{order._id}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-700">{order.listings.length}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${order.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                order.status === 'declined' || order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    order.status === 'fulfilled' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                {order.status === 'requested' && (
                                                    <>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order._id, 'accepted'); }}
                                                            className="p-2 text-green-600 hover:text-green-900"
                                                            title="Accept Order"
                                                        >
                                                            <CheckCircle2 size={20} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order._id, 'declined'); }}
                                                            className="p-2 text-red-600 hover:text-red-900"
                                                            title="Decline Order"
                                                        >
                                                            <XCircle size={20} />
                                                        </button>
                                                    </>
                                                )}
                                                {order.status === 'accepted' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order._id, 'fulfilled'); }}
                                                        className="p-2 text-blue-600 hover:text-blue-900"
                                                        title="Mark as Fulfilled"
                                                    >
                                                        <Edit2 size={20} />
                                                    </button>
                                                )}
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
            {selectedOrder && (
                <OrderDetailsModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    order={selectedOrder}
                />
            )}
        </RestaurantDashboardLayout>
    );
}
