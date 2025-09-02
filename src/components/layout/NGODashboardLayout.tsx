"use client";

import React, { ReactNode, useState } from "react";
import NgoSidebar from "./NGOSidebar";
import MobileSidebarToggle from "@/components/layout/MobileSidebarToggle";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";
import { User } from "lucide-react";

export default function NgoDashboardLayout({ children }: { children: ReactNode }) {
    const { user } = useSelector((state: RootState) => state.auth);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex min-h-screen bg-gray-50 lg:bg-gray-100">
            {/* Sidebar */}
            <NgoSidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

            {/* Main content area */}
            <div className="flex-1 flex flex-col lg:ml-64">
                {/* Mobile Header with Toggle Button */}
                <div className="lg:hidden p-4">
                    <MobileSidebarToggle onOpen={toggleSidebar} />
                </div>

                {/* Desktop Header */}
                <header className="hidden lg:flex items-center justify-between px-8 py-6 bg-gray-50">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                            Charity Dashboard
                        </h1>
                        <p className="text-gray-600 mt-2 text-lg">
                            Welcome back, {user?.username || "Charity User"}!
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                            <User size={20} className="text-gray-500" />
                            <span className="text-gray-700 font-medium">{user?.username}</span>
                        </div>
                    </div>
                </header>

                {/* Scrollable main content */}
                <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
                    <div className="rounded-2xl bg-white p-6 lg:p-10 shadow-xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}