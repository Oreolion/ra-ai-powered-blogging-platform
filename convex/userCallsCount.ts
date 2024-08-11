import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUserCallCount = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const userCallCount = await ctx.db
      .query("userCallCounts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
    
    return userCallCount ? userCallCount.count : 0;
  },
});

export const incrementUserCallCount = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const userCallCount = await ctx.db
      .query("userCallCounts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (userCallCount) {
      await ctx.db.patch(userCallCount._id, {
        count: userCallCount.count + 1,
      });
    } else {
      await ctx.db.insert("userCallCounts", {
        userId,
        count: 1,
      });
    }

    return userCallCount ? userCallCount.count + 1 : 1;
  },
});