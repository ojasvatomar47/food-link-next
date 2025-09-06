"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersByNgo, updateOrder, Order } from "@/features/order/orderSlice";
import { AppDispatch, RootState } from "@/features/store";
import toast from "react-hot-toast";
import NgoDashboardLayout from "@/components/layout/NGODashboardLayout";
import { Frown, PackageOpen, ChevronLeft, ChevronRight, CheckCircle2, XCircle, MoreHorizontal, RotateCw, Star, StarHalf, MessageSquare } from "lucide-react";
import OrderDetailsModal from "@/components/orders/OrderDetailsModal";
import OrderConfirmationModal from "@/components/orders/OrderConfirmationModal";
import ChatRoom from "@/components/ChatRoom";

export default function NgoOrdersPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { orders, loading, error } = useSelector((state: RootState) => state.orders);
    const { user } = useSelector((state: RootState) => state.auth);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchOrdersByNgo());
    }, [dispatch]);

    useEffect(() => {
        const pendingOrder = orders.find(
            (o) => o.pendingStatus && o.pendingStatus.requestedBy.toString() !== user?.id
        );
        if (pendingOrder) {
            setSelectedOrder(pendingOrder);
            setIsConfirmationModalOpen(true);
        } else {
            setIsConfirmationModalOpen(false);
            setSelectedOrder(null);
        }
    }, [orders, user]);

    const handleRequestStatusChange = async (id: string, status: 'fulfilled' | 'cancelled') => {
        const resultAction = await dispatch(updateOrder({ id, updateData: { status } }));
        if (updateOrder.fulfilled.match(resultAction)) {
            toast.success(`Request to ${status} sent for order!`);
        } else if (updateOrder.rejected.match(resultAction)) {
            toast.error(resultAction.payload as string);
        }
        setOpenDropdown(null);
    };

    const handleConfirmRequest = async (id: string) => {
        if (!selectedOrder || selectedOrder._id !== id) return;
        const resultAction = await dispatch(updateOrder({ id, updateData: { confirm: 'yes' } }));
        if (updateOrder.fulfilled.match(resultAction)) {
            toast.success(`Order status confirmed!`);
        } else if (updateOrder.rejected.match(resultAction)) {
            toast.error(resultAction.payload as string);
        }
        setIsConfirmationModalOpen(false);
        setSelectedOrder(null);
    };

    const handleRejectRequest = async (id: string) => {
        if (!selectedOrder || selectedOrder._id !== id) return;
        const resultAction = await dispatch(updateOrder({ id, updateData: { confirm: 'no' } }));
        if (updateOrder.fulfilled.match(resultAction)) {
            toast.success(`Order status request rejected.`);
        } else if (updateOrder.rejected.match(resultAction)) {
            toast.error(resultAction.payload as string);
        }
        setIsConfirmationModalOpen(false);
        setSelectedOrder(null);
    };

    const handleOpenDetailsModal = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedOrder(null);
    };

    // Corrected handlers for chat modal
    const handleOpenChat = (e: React.MouseEvent, order: Order) => {
        e.stopPropagation(); // Prevent the table row's click handler from firing
        setSelectedOrder(order); // Set the selected order first
        setIsChatOpen(true); // Then open the chat
        setOpenDropdown(null); // Close the dropdown if open
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
        setSelectedOrder(null); // Reset the selected order when the chat is closed
    };

    const handleRefresh = () => {
        dispatch(fetchOrdersByNgo());
    };

    const renderStars = (rating: number | undefined) => {
        if (rating === undefined) return null;
        const starsArray = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const totalStars = 5;

        for (let i = 1; i <= totalStars; i++) {
            if (i <= fullStars) {
                starsArray.push(
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                );
            } else if (i === fullStars + 1 && hasHalfStar) {
                starsArray.push(
                    <StarHalf key={i} size={16} className="text-yellow-400 fill-current" />
                );
            } else {
                starsArray.push(
                    <Star key={i} size={16} className="text-gray-300" />
                );
            }
        }
        return <div className="flex space-x-1">{starsArray}</div>;
    };

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return (
            <NgoDashboardLayout>
                <div className="text-center py-20 flex flex-col items-center">
                    <p className="text-xl font-medium text-gray-500">Loading orders...</p>
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
                <h2 className="text-3xl font-bold text-gray-900">My Orders</h2>
                <button
                    onClick={handleRefresh}
                    className="p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
                    title="Refresh Orders"
                    disabled={loading}
                >
                    <RotateCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>
            {orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 shadow-md text-center text-gray-500 col-span-full py-20 flex flex-col items-center">
                    <PackageOpen size={48} className="mb-4" />
                    <p className="text-lg font-medium">You have not placed any orders yet.</p>
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
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stars
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200" onClick={() => handleOpenDetailsModal(order)}>
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
                                            {order.pendingStatus && (
                                                <span className="ml-2 animate-pulse text-xs text-yellow-500">
                                                    (Pending {order.pendingStatus.status} request)
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {order.restStars ? renderStars(order.restStars) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="relative inline-block text-left">
                                                {order.status === 'accepted' && !order.pendingStatus && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenDropdown(openDropdown === order._id ? null : order._id);
                                                        }}
                                                        className="p-2 text-gray-500 hover:text-gray-900"
                                                        title="Order Actions"
                                                    >
                                                        <MoreHorizontal size={20} />
                                                    </button>
                                                )}
                                                {openDropdown === order._id && (
                                                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                                                        <div className="py-1" role="none">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRequestStatusChange(order._id, 'fulfilled');
                                                                }}
                                                                className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                                                                role="menuitem"
                                                            >
                                                                <CheckCircle2 size={16} className="mr-2" />
                                                                Request Fulfilled
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRequestStatusChange(order._id, 'cancelled');
                                                                }}
                                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                                role="menuitem"
                                                            >
                                                                <XCircle size={16} className="mr-2" />
                                                                Request Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                {order.status !== "requested" && order.status !== "declined" && (
                                                    <button
                                                        onClick={(e) => handleOpenChat(e, order)}
                                                        className="p-2 text-gray-500 hover:text-blue-600 ml-2"
                                                        title="Open Chat"
                                                    >
                                                        <MessageSquare size={20} />
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
                <>
                    <OrderDetailsModal
                        isOpen={isDetailsModalOpen}
                        onClose={handleCloseDetailsModal}
                        order={selectedOrder}
                    />
                    {isConfirmationModalOpen && (
                        <OrderConfirmationModal
                            isOpen={isConfirmationModalOpen}
                            onClose={() => setIsConfirmationModalOpen(false)}
                            order={selectedOrder}
                            onConfirm={() => handleConfirmRequest(selectedOrder._id)}
                            onReject={() => handleRejectRequest(selectedOrder._id)}
                        />
                    )}
                </>
            )}
            {isChatOpen && selectedOrder && user?.id && (
                <ChatRoom
                    orderId={selectedOrder._id}
                    userId={user.id}
                    orderStatus={selectedOrder.status}
                    userType={user.userType}
                    onClose={handleCloseChat}
                />
            )}
        </NgoDashboardLayout>
    );
}