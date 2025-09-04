import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/lib/axios";
import axios from "axios";

// Define interfaces for your data
export interface OrderListing {
  _id: string;
  name: string;
  quantity: string;
  measurement: string;
  expiry: number;
  createdAt: Date;
}

export interface Order {
  _id: string;
  restaurantId: string;
  ngoId: string;
  listings: OrderListing[];
  status: "accepted" | "declined" | "requested" | "fulfilled" | "cancelled";
  pendingStatus?: {
    status: 'fulfilled' | 'cancelled';
    requestedBy: string;
  };
  restReview?: string;
  ngoReview?: string;
  restStars?: number; // New field for restaurant stars
  ngoStars?: number; // New field for NGO stars
  createdAt: Date;
  updatedAt: Date;
}

// New interfaces for dashboard analytics
export interface Review {
  ngoReview?: string;
  restReview?: string;
  restStars?: number;
  ngoStars?: number;
}

export interface Stat {
  _id: string; // The status name
  count: number;
}

export interface UserStats {
  _id: string; // User ID
  fulfilledCount: number;
  cancelledCount: number;
}

export interface Analytics {
  stats: Stat[];
  reviews: Review[];
  avgStars: number; // New field for average stars
  ngoStats?: UserStats[]; // For restaurant dashboard
  restStats?: UserStats[]; // For NGO dashboard
}

interface OrderState {
  orders: Order[];
  analytics: Analytics | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  analytics: null, // New analytics field
  loading: false,
  error: null,
};

// Async thunks for orders
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (listingIds: string[], { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/orders", { listingIds });
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.error);
      }
      return rejectWithValue("Failed to create order");
    }
  }
);

export const fetchOrdersByRestaurant = createAsyncThunk(
  "orders/fetchOrdersByRestaurant",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/orders/restaurant");
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.error);
      }
      return rejectWithValue("Failed to fetch restaurant orders");
    }
  }
);

export const fetchOrdersByNgo = createAsyncThunk(
  "orders/fetchOrdersByNgo",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/orders/ngo");
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.error);
      }
      return rejectWithValue("Failed to fetch NGO orders");
    }
  }
);

export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async ({ id, updateData }: { id: string; updateData: { status?: "accepted" | "declined" | "fulfilled" | "cancelled"; review?: string; stars?: number; confirm?: "yes" | "no"; } }, { rejectWithValue }) => {
    try {
      const res = await apiClient.patch(`/orders/${id}`, updateData);
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.error);
      }
      return rejectWithValue("Failed to update order");
    }
  }
);

// New thunk to fetch restaurant analytics
export const fetchRestaurantAnalytics = createAsyncThunk(
  "orders/fetchRestaurantAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/orders/analytics/restaurant");
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.error);
      }
      return rejectWithValue("Failed to fetch analytics");
    }
  }
);

// New thunk to fetch NGO analytics
export const fetchNgoAnalytics = createAsyncThunk(
  "orders/fetchNgoAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/orders/analytics/ngo");
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.error);
      }
      return rejectWithValue("Failed to fetch analytics");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrdersByRestaurant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByRestaurant.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersByRestaurant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrdersByNgo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByNgo.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersByNgo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(o => o._id === updatedOrder._id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
      .addCase(fetchRestaurantAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchRestaurantAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchNgoAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNgoAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchNgoAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;