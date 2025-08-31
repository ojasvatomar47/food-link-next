"use client";

import React from "react";
import RestaurantDashboardLayout from "@/components/layout/RestaurantDashboardLayout";
import { Smile } from "lucide-react";

export default function RestaurantDashboardPage() {
  return (
    <RestaurantDashboardLayout>
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center max-w-2xl">
          <Smile size={64} className="text-green-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Dashboard!
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            This is your central hub for managing your food listings and making a difference.
          </p>
          <p className="text-lg text-gray-600">
            Use the sidebar to create new listings or view and manage your existing ones with ease.
          </p>
        </div>
      </div>
    </RestaurantDashboardLayout>
  );
}