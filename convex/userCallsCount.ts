import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUserCallCount = query({
  args: { userId: v.string(), day: v.string() },
  handler: async (ctx, { userId, day }) => {
    const userCallCount = await ctx.db
      .query("userCallCounts")
      .withIndex("by_userId_and_day", (q) => 
        q.eq("userId", userId).eq("day", day)
      )
      .unique();

    return userCallCount ? userCallCount.count : 0;
  },
});

export const incrementUserCallCount = mutation({
  args: { userId: v.string(), day: v.string() },
  handler: async (ctx, { userId, day }) => {
    const userCallCount = await ctx.db
      .query("userCallCounts")
      .withIndex("by_userId_and_day", (q) => 
        q.eq("userId", userId).eq("day", day)
      )
      .unique();

    if (userCallCount) {
      await ctx.db.patch(userCallCount._id, {
        count: userCallCount.count + 1,
      });
    } else {
      await ctx.db.insert("userCallCounts", {
        userId,
        count: 1,
        day,
      });
    }

    return userCallCount ? userCallCount.count + 1 : 1;
  },
});
