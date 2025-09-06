// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    messages: defineTable({
        orderId: v.string(),    // store MongoDB ObjectId as string (e.g. listing._id.toString())
        senderId: v.string(),   // your user id (string)
        text: v.string(),
        metadata: v.optional(v.any()), // optional (images, etc)
    }).index("by_order", ["orderId"]),
});
