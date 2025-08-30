"use client";

import React, { ReactNode } from "react";
import RestaurantSidebar from "@/components/layout/RestaurantSidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";
import { User } from "lucide-react";

export default function RestaurantDashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <RestaurantSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Restaurant Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome, {user?.username || "Restaurant User"}! Manage your food listings here.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* User Icon and name */}
            <User size={24} className="text-gray-500" />
            <span className="text-gray-700">{user?.username}</span>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          {children}
        </div>
      </main>
    </div>
  );
}
