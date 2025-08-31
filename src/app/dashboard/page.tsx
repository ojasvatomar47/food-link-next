"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/features/store";
import toast from "react-hot-toast";

export default function DashboardRouterPage() {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !loading) {
      if (!user) {
        toast.error("You must be logged in to view this page.");
        router.push("/login");
      } else if (user.userType === "Restaurant") {
        router.push("/restaurant/dashboard");
      } else if (user.userType === "Charity/NGO") {
        router.push("/charity/dashboard");
      }
    }
  }, [user, loading, hasMounted, router]);

  // Show a loading state on both server and client until the app is hydrated
  if (!hasMounted || loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Fallback for cases where a user type is not handled
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
