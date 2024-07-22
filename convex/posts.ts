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
    likes: v.number(),
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
      likes: args.likes,
      authorImageUrl: user[0].imageUrl,
      audioDuration: args.audioDuration,
    });
  },
});

export const createComment = mutation({
  args: {
    postId: v.id("posts"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    return await ctx.db.insert("comments", {
      postId: args.postId,
      userId: user._id,
      content: args.content,
      createdAt: Date.now(),
    });
  },
});

// this query will get all the comments.
export const getComments = query({
    args: { postId: v.optional(v.id("posts")) },
    handler: async (ctx, args) => {
      return await ctx.db
        .query("comments")
        .withIndex("by_post", (q) => q.eq("postId", args.postId))
        .order("desc")
        .collect();
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

// this query will get all the posts.
export const getAllPosts = query({
  handler: async (ctx) => {
    return await ctx.db.query("posts").order("desc").collect();
  },
});

// this query will get the post by the postId.
export const getPostById = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.postId);
  },
});

// this query will get the posts based on the views of the post , which we are showing in the Trending Posts section.
export const getTrendingPosts = query({
  handler: async (ctx) => {
    const post = await ctx.db.query("posts").collect();

    return post.sort((a, b) => b.views - a.views).slice(0, 8);
  },
});

// this query will get the post by the authorId.
export const getPostByAuthorId = query({
  args: {
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), args.authorId))
      .collect();

    const totalListeners = posts.reduce((sum, post) => sum + post.views, 0);

    return { posts, listeners: totalListeners };
  },
});

// this query will get the post by the search query.
export const getPostBySearch = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.search === "") {
      return await ctx.db.query("posts").order("desc").collect();
    }

    const authorSearch = await ctx.db
      .query("posts")
      .withSearchIndex("search_author", (q) => q.search("author", args.search))
      .take(10);

    if (authorSearch.length > 0) {
      return authorSearch;
    }

    const titleSearch = await ctx.db
      .query("posts")
      .withSearchIndex("search_title", (q) =>
        q.search("postTitle", args.search)
      )
      .take(10);

    if (titleSearch.length > 0) {
      return titleSearch;
    }

    return await ctx.db
      .query("posts")
      .withSearchIndex("search_body", (q) =>
        q.search("postDescription" || "postTitle", args.search)
      )
      .take(10);
  },
});

// this query will get all the posts based on the post category of the post , which we are showing in the Similar Posts section.
export const getPostByPostCategory = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);

    return await ctx.db
      .query("posts")
      .filter((q) =>
        q.and(
          q.eq(q.field("postCategory"), post?.postCategory),
          q.neq(q.field("_id"), args.postId)
        )
      )
      .collect();
  },
});

// this mutation will update the likes of the post.
export const updatePostLikes = mutation({
  args: {
    postId: v.id("posts"),
    increment: v.boolean(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    console.log(post);

    if (!post) {
      throw new ConvexError("Post not found");
    }

    const newLikes = args.increment ? post.likes + 1 : post.likes - 1;

    return await ctx.db.patch(args.postId, {
      likes: newLikes,
    });
  },
});
