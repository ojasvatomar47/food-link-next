"use client";

import React from "react";
import NgoDashboardLayout from "@/components/layout/NGODashboardLayout";
import { Smile } from "lucide-react";

export default function NgoDashboardPage() {
    return (
        <NgoDashboardLayout>
            <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="text-center max-w-2xl">
                    <Smile size={64} className="text-blue-500 mx-auto mb-6 animate-bounce" />
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome to Your Dashboard!
                    </h2>
                    <p className="text-lg text-gray-600 mb-2">
                        This is your central hub for browsing available food listings and managing your orders.
                    </p>
                    <p className="text-lg text-gray-600">
                        Use the sidebar to explore new listings or check the status of your existing orders.
                    </p>
                </div>
            </div>
        </NgoDashboardLayout>
    );
}
