"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/features/store";
import LogoutButton from "@/components/LogoutButton";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  // State to track if the component has mounted on the client
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Redirect if user is not logged in after mounting
  useEffect(() => {
    if (hasMounted && !loading && !user) {
      toast.error("You must be logged in to view this page.");
      router.push("/login");
    }
  }, [user, loading, router, hasMounted]);

  // Show a loading state on both server and client until the app is hydrated
  if (!hasMounted || loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Once mounted and user is available, render the full content
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.username}!</h1>
        <p className="mt-4 text-gray-600">This is your personalized dashboard.</p>
        <p className="text-gray-600">User Type: {user.userType}</p>
        <div className="mt-8">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}