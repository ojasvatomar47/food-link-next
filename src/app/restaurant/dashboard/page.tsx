"use client";

import React from "react";
import RestaurantDashboardLayout from "@/components/layout/RestaurantDashboardLayout";

export default function RestaurantDashboardPage() {
  return (
    <RestaurantDashboardLayout>
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard Overview</h2>
        <p className="text-gray-600">
          This is your central hub for managing your food listings.
        </p>
        <p className="text-gray-600">
          Use the sidebar to create new listings or view and manage your existing ones.
        </p>
      </div>
    </RestaurantDashboardLayout>
  );
}
