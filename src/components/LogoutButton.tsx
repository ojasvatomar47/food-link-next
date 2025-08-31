"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { clearUser } from "@/features/auth/authSlice";
import { AppDispatch, RootState } from "@/features/store";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(clearUser());
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  // Only show the button if a user is logged in
  if (!user) {
    return null;
  }

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
    >
      <LogOut size={16} className="mr-2" />
      Logout
    </button>
  );
}