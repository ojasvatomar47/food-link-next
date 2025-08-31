import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import listingReducer from "./listing/listingSlice";
import orderReducer from "./order/orderSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    listings: listingReducer,
    orders: orderReducer,
  },
});

// TS types for hooks
export type RootState = ReturnType<typeof store.getState>; // type for state
export type AppDispatch = typeof store.dispatch; // type for dispatch
export type AppStore = typeof store;