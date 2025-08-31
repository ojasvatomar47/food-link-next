"use client";

import React, { ReactNode, useState } from "react";
import RestaurantSidebar from "@/components/layout/RestaurantSidebar";
import MobileSidebarToggle from "@/components/layout/RestaurantMobileSidebarToggle";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";
import { User } from "lucide-react";

export default function RestaurantDashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative flex min-h-screen bg-gray-50 lg:bg-gray-100">
      <RestaurantSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        {/* Mobile Header with Toggle Button */}
        <div className="lg:hidden">
          <MobileSidebarToggle onOpen={toggleSidebar} />
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex mb-8 items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Restaurant Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Welcome back, {user?.username || "Restaurant User"}!
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <User size={20} className="text-gray-500" />
              <span className="text-gray-700 font-medium">{user?.username}</span>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="rounded-2xl bg-white p-6 lg:p-10 shadow-xl">
          {children}
        </div>
      </main>
    </div>
  );
}