import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the state for auth
interface AuthState {
  user: string | null;  // We'll store username/email here
}

// Initial state
const initialState: AuthState = {
  user: null,
};

// Create the slice
const authSlice = createSlice({
  name: "auth", // name of this slice
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      // Update user with the value in action.payload
      state.user = action.payload;
    },
    clearUser: (state) => {
      // Reset user to null
      state.user = null;
    },
  },
});

// Export actions to use in components
export const { setUser, clearUser } = authSlice.actions;

// Export reducer to include in store
export default authSlice.reducer;
