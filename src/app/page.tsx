"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/features/store";

export default function Home() {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !loading) {
      if (user) {
        // Redirect logged-in users to their specific dashboard
        if (user.userType === "Restaurant") {
          router.push("/restaurant/dashboard");
        } else if (user.userType === "Charity/NGO") {
          // You will need to create this page later
          router.push("/charity/dashboard");
        }
      } else {
        // Redirect logged-out users to the login page
        router.push("/login");
      }
    }
  }, [user, loading, hasMounted, router]);

  // Show a loading state while the app is hydrating and checking for a user
  return (
    <main className="flex min-h-screen items-center justify-center">
      <p>Loading...</p>
    </main>
  );
}