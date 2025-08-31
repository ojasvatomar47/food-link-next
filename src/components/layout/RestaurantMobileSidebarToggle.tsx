"use client";

import { Menu } from "lucide-react";
import React from "react";

export default function MobileSidebarToggle({ onOpen }: { onOpen: () => void }) {
    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <h1 className="text-2xl font-bold text-gray-900">FoodLink</h1>
            <button
                onClick={onOpen}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
                <Menu size={24} />
            </button>
        </div>
    );
}