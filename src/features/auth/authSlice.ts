import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the state for auth
interface AuthState {
  user: {
    id: string;
    username: string;
    email: string;
    userType: string;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/auth/login", data);
      return res.data; // expects { user, token }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Login failed");
    }
  }
);

// Async thunk for register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    data: {
      username: string;
      email: string;
      password: string;
      userType: string;
      verificationCode: string;
      latitude: number;
      longitude: number;
      locationName?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post("/api/auth/register", data);
      return res.data; // expects { user }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || "Registration failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
