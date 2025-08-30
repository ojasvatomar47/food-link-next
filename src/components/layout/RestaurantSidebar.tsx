"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, List, User } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";

export default function RestaurantSidebar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/restaurant/dashboard", icon: LayoutDashboard },
    { name: "Create Listing", href: "/restaurant/create-listing", icon: PlusCircle },
    { name: "My Listings", href: "/restaurant/my-listings", icon: List },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white shadow-lg transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-900">FoodLink</h1>
      </div>

      {/* User Info Section */}
      <div className="flex items-center space-x-3 px-6 py-4 border-b border-gray-200">
        <div className="flex-shrink-0">
          <User size={24} className="text-gray-500" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800 truncate">
            {user?.username || "Restaurant User"}
          </h3>
          <p className="text-xs text-gray-500 truncate">
            {user?.userType}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`flex items-center space-x-3 rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-green-100 text-green-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-green-600' : 'text-gray-500'} />
                  <span>{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="mt-auto px-4 py-6">
        <LogoutButton />
      </div>
    </div>
  );
}