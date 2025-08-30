import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient, { setAuthToken } from "@/lib/axios";

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

// Helper function to get the initial state from localStorage
const getInitialState = (): AuthState => {
  try {
    const serializedState = localStorage.getItem("authState");
    if (serializedState === null) {
      return {
        user: null,
        token: null,
        loading: false,
        error: null,
      };
    }
    const storedState = JSON.parse(serializedState);
    if (storedState.token) {
      setAuthToken(storedState.token);
    }
    return {
      user: storedState.user || null,
      token: storedState.token || null,
      loading: false,
      error: null,
    };
  } catch (err) {
    return {
      user: null,
      token: null,
      loading: false,
      error: null,
    };
  }
};

// Initial state
const initialState: AuthState = getInitialState();

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/auth/login", data);
      return res.data;
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
      const res = await apiClient.post("/auth/register", data);
      return res.data;
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
      localStorage.setItem("authState", JSON.stringify({ ...state, user: action.payload }));
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("authState");
      setAuthToken(null);
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
        localStorage.setItem(
          "authState",
          JSON.stringify({ user: action.payload.user, token: action.payload.token })
        );
        setAuthToken(action.payload.token);
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
