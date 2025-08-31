"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, List, X, User } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";
import { UtensilsCrossed } from "lucide-react"; // Import a new icon for the logo

export default function RestaurantSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/restaurant/dashboard", icon: LayoutDashboard },
    { name: "Create Listing", href: "/restaurant/create-listing", icon: PlusCircle },
    { name: "My Listings", href: "/restaurant/my-listings", icon: List },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={onClose}
      ></div>

      {/* Sidebar Content */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 transform flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header (FoodLink Logo) */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 p-4">
          <Link href="/restaurant/dashboard" className="flex items-center space-x-2">
            <UtensilsCrossed size={28} className="text-green-500" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800">
              FoodLink
            </h1>
          </Link>
          <button onClick={onClose} className="p-1 rounded-md text-gray-500 hover:text-gray-700 lg:hidden">
            <X size={24} />
          </button>
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
                    className={`group flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${isActive
                        ? 'bg-green-100 text-green-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    onClick={onClose}
                  >
                    <Icon size={20} className={`transition-colors duration-200 ${isActive ? 'text-green-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
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
    </>
  );
}