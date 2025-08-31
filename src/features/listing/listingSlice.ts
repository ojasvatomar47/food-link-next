import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/lib/axios";
import axios from "axios";

// Define interfaces for your data
export interface Listing {
  _id: string;
  restaurantId: string;
  name: string;
  quantity: string;
  measurement: string;
  expiry: number;
  status: "available" | "claimed" | "completed";
  claimedBy?: string;
}

interface ListingState {
  listings: Listing[];
  loading: boolean;
  error: string | null;
}

const initialState: ListingState = {
  listings: [],
  loading: false,
  error: null,
};

// Async thunks for listings
export const createListing = createAsyncThunk(
  "listings/createListing",
  async (listingData: Omit<Listing, "_id" | "restaurantId" | "status" | "claimedBy">, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/listings", listingData);
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.error);
      }
      return rejectWithValue("Failed to create listing");
    }
  }
);

export const fetchListings = createAsyncThunk(
  "listings/fetchListings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/listings");
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.error);
      }
      return rejectWithValue("Failed to fetch listings");
    }
  }
);


export const fetchRestaurantListings = createAsyncThunk(
  "listings/fetchRestaurantListings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get("/listings/restaurant");
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.error);
      }
      return rejectWithValue("Failed to fetch listings");
    }
  }
);

export const updateListing = createAsyncThunk(
  "listings/updateListing",
  async ({ id, updateData }: { id: string; updateData: Partial<Listing> }, { rejectWithValue }) => {
    try {
      const res = await apiClient.put(`/listings/${id}`, updateData);
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.error);
      }
      return rejectWithValue("Failed to update listing");
    }
  }
);

export const deleteListing = createAsyncThunk(
  "listings/deleteListing",
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/listings/${id}`);
      return id;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data.error);
      }
      return rejectWithValue("Failed to delete listing");
    }
  }
);

const listingSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Listing
      .addCase(createListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.loading = false;
        state.listings.push(action.payload);
      })
      .addCase(createListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Listings
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRestaurantListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
      })
      .addCase(fetchRestaurantListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Listing
      .addCase(updateListing.fulfilled, (state, action) => {
        const index = state.listings.findIndex(l => l._id === action.payload._id);
        if (index !== -1) {
          state.listings[index] = action.payload;
        }
      })
      // Delete Listing
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.listings = state.listings.filter(l => l._id !== action.payload);
      });
  },
});

export default listingSlice.reducer;
