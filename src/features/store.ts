import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice"; // import the reducer

export const store = configureStore({
  reducer: {
    auth: authReducer, // attach slice reducer to store
  },
});

// TS types for hooks
export type RootState = ReturnType<typeof store.getState>; // type for state
export type AppDispatch = typeof store.dispatch; // type for dispatch
