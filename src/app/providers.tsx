"use client";

import { Provider } from "react-redux";
import { store, AppStore } from "@/features/store";
import { setupResponseInterceptor } from "@/lib/axios";
import { useEffect } from "react";
import { isTokenExpired, clearUser } from "@/features/auth/authSlice";

// Set up the response interceptor once when the app loads.
// This is critical for catching 401 Unauthorized errors from the API.
setupResponseInterceptor(store as AppStore);

export function Providers({ children }: { children: React.ReactNode }) {
  // Proactive token check on initial render.
  // This ensures a user with an expired token is logged out immediately.
  const token = store.getState().auth.token;
  if (token && isTokenExpired(token)) {
    store.dispatch(clearUser());
  }

  // Set up a periodic check to handle tokens that expire while a user is idle.
  useEffect(() => {
    const checkAndClear = () => {
      const currentToken = store.getState().auth.token;
      if (currentToken && isTokenExpired(currentToken)) {
        store.dispatch(clearUser());
      }
    };

    const intervalId = setInterval(checkAndClear, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);

  return <Provider store={store}>{children}</Provider>;
}