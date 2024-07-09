// @ts-nocheck
import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

// create post mutation

export const createPost = mutation({
  args: {
    audioStorageId: v.union(v.id("_storage"), v.null()),
    postTitle: v.string(),
    postDescription: v.string(),
    // audioUrl: v.string(),
    imageUrl: v.string(),
    imageStorageId: v.union(v.id("_storage"), v.null()),
    postContent: v.string(),
    imagePrompt: v.string(),
    postCategory: v.string(),
    views: v.number(),
    // audioDuration: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .collect();

    if (user.length === 0) {
      throw new ConvexError("User not found");
    }

    return await ctx.db.insert("posts", {
      audioStorageId: args.audioStorageId,
      user: user[0]._id,
      postTitle: args.postTitle,
      postDescription: args.postDescription,
      audioUrl: args.audioUrl,
      imageUrl: args.imageUrl,
      imageStorageId: args.imageStorageId,
      author: user[0].name,
      authorId: user[0].clerkId,
      postContent: args.postContent,
      imagePrompt: args.imagePrompt,
      postCategory: args.postCategory,
      views: args.views,
      authorImageUrl: user[0].imageUrl,
      audioDuration: args.audioDuration,
    });
  },
});

// this mutation is required to generate the url after uploading the file to the storage.
export const getUrl = mutation({
    args: {
      storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
      return await ctx.storage.getUrl(args.storageId);
    },
  });
  