import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/lib/axios";
import axios from "axios";

// Define interfaces for your data
interface OrderListing {
  _id: string;
  name: string;
  quantity: string;
  measurement: string;
  expiry: number;
  createdAt: Date;
}

interface Order {
  _id: string;
  restaurantId: string;
  ngoId: string;
  listings: OrderListing[];
  status: "accepted" | "declined" | "requested" | "fulfilled" | "cancelled";
  restReview?: string;
  ngoReview?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
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
  async ({ id, updateData }: { id: string; updateData: { status?: Order['status'], review?: string } }, { rejectWithValue }) => {
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
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

export default orderSlice.reducer;