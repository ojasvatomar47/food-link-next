import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Fetch messages for an order
export const listByOrder = query({
    args: { orderId: v.string(), limit: v.optional(v.number()) },
    handler: async (ctx, { orderId, limit }) => {
        const q = ctx.db
            .query("messages")
            .withIndex("by_order", (q) => q.eq("orderId", orderId))
            .order("asc"); // oldest -> newest
        return limit ? q.take(limit) : q.collect();
    },
});

// Create a new message
export const create = mutation({
    args: {
        orderId: v.string(),
        senderId: v.string(),
        text: v.string(),
        metadata: v.optional(v.any()),
    },
    handler: async (ctx, { orderId, senderId, text, metadata }) => {
        return await ctx.db.insert("messages", {
            orderId,
            senderId,
            text,
            metadata,
        });
    },
});
