import { ConvexError, v } from "convex/values";

import { internalMutation, query } from "./_generated/server";

// Fetch all users from the 'users' table
export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").order("desc").collect();
  },
});

export const getUserById = query({
  args: { clerkId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
    //   throw new ConvexError("User not found");
    return null; 
    }

    return user;
  },
});

// this query is used to get the top user by post count. first the post is sorted by views and then the user is sorted by total posts, so the user with the most posts will be at the top.
export const getTopUserByPostCount = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users").collect();

    const userData = await Promise.all(
      user.map(async (u) => {
        const posts = await ctx.db
          // @ts-ignore

          .query("posts")
          .filter((q) => q.eq(q.field("authorId"), u.clerkId))
          .collect();

        // @ts-ignore
        const sortedPosts = posts.sort((a, b) => b.views - a.views);

        return {
          ...u,
          totalPosts: posts.length,
          post: sortedPosts.map((p) => ({
            // @ts-ignore

            postTitle: p.postTitle,
            postId: p._id,
          })),
        };
      })
    );

    return userData.sort((a, b) => b.totalPosts - a.totalPosts);
  },
});

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      imageUrl: args.imageUrl,
      name: args.name,
    });
  },
});

export const updateUser = internalMutation({
  args: {
    clerkId: v.string(),
    imageUrl: v.string(),
    email: v.string(),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      imageUrl: args.imageUrl,
      email: args.email,
    });

    const post = await ctx.db
      // @ts-ignore

      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), args.clerkId))
      .collect();

    await Promise.all(
      post.map(async (p) => {
        await ctx.db.patch(p._id, {
          authorImageUrl: args.imageUrl,
        });
      })
    );
  },
});

export const deleteUser = internalMutation({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.delete(user._id);
  },
});
