import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "@/lib/axios";

export const sendMessage = createAsyncThunk(
    "chat/sendMessage",
    async ({ orderId, text }: { orderId: string; text: string }, { rejectWithValue }) => {
        try {
            const res = await apiClient.post("/chat/send", { orderId, text });
            return res.data; // { id: ... }
        } catch (err: any) {
            return rejectWithValue("Failed to send message");
        }
    }
);

const chatSlice = createSlice({
    name: "chat",
    initialState: { sending: false, error: null as string | null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (state) => {
                state.sending = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state) => {
                state.sending = false;
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.sending = false;
                state.error = action.payload as string;
            });
    },
});

export default chatSlice.reducer;
