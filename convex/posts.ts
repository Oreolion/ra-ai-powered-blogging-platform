import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

// create post mutation
export const createPost = mutation({
  args: {
    audioStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    postTitle: v.string(),
    postDescription: v.string(),
    // audioUrl: v.string(),
    imageUrl: v.string(),
    imageStorageId: v.union(v.id("_storage"), v.null()),
    postContent: v.string(),
    imagePrompt: v.string(),
    postCategory: v.string(),
    views: v.number(),
    viewedBy: v.optional(v.array(v.string())),
    likes: v.number(),
    summary: v.optional(v.string()),
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
      audioStorageId: args.audioStorageId ?? null,
      user: user[0]._id,
      postTitle: args.postTitle,
      postDescription: args.postDescription,
      imageUrl: args.imageUrl,
      imageStorageId: args.imageStorageId ?? undefined,
      author: user[0].name,
      authorId: user[0].clerkId,
      postContent: args.postContent,
      imagePrompt: args.imagePrompt ?? "",
      postCategory: args.postCategory,
      views: args.views,
      likes: args.likes,
      authorImageUrl: user[0].imageUrl,
    });
  },
});

// create comment mutation
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
      username: user.name,
      commentUserImage: user.imageUrl,
      content: args.content,
      //   _creationTime: Date.now(),
      editedAt: Date.now(),
    });
  },
});

// This mutation edits an existing comment
export const editComment = mutation({
  args: {
    _id: v.id("comments"),
    newContent: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { _id, newContent, userId } = args;

    // Fetch the existing comment
    const existingComment = await ctx.db.get(_id);

    if (!existingComment) {
      throw new Error("Comment not found");
    }

    // Check if the user is allowed to edit this comment
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

    if (existingComment.userId !== user._id) {
      throw new Error("User not authorized to edit this comment");
    }

    // Update the comment
    const updatedComment = await ctx.db.patch(_id, {
      content: newContent,
      editedAt: Date.now(),
    });

    return updatedComment;
  },
});

// this query will get all the comments.
export const getComments = query({
  args: { postId: v.optional(v.id("posts")) },
  handler: async (ctx, args) => {
    const { postId } = args;
    if (!postId) {
      return [];
    }
    return await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .order("desc")
      .collect();
  },
});

// This query deletes comment on post
export const deleteComment = mutation({
  args: {
    _id: v.optional(v.id("comments")),
  },
  handler: async (ctx, args) => {
    if (!args._id) {
      throw new ConvexError("Comment id required");
    }
    const comment = await ctx.db.get(args._id);

    if (!comment) {
      throw new ConvexError("Comment not found");
    }

    // delete the comment
    return await ctx.db.delete(args._id);
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

export const getAllPostsPaginated = query({
  args: {
    page: v.number(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { page, limit = 10 }) => {
    const offset = (page - 1) * limit

    const posts = await ctx.db.query("posts").order("desc").collect()

    const totalPosts = posts.length
    const paginatedPosts = posts.slice(offset, offset + limit)

    return {
      posts: paginatedPosts,
      totalPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      hasNextPage: page < Math.ceil(totalPosts / limit),
      hasPrevPage: page > 1,
    }
  },
})


export const getPostBySearchPaginated = query({
  args: {
    search: v.string(),
    page: v.number(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { search, page, limit = 10 }) => {
    const offset = (page - 1) * limit

    const allPosts = await ctx.db.query("posts").order("desc").collect()

    const filteredPosts = allPosts.filter(
      (post) =>
        post.postTitle.toLowerCase().includes(search.toLowerCase()) ||
        post.postDescription.toLowerCase().includes(search.toLowerCase()) ||
        post.postCategory.toLowerCase().includes(search.toLowerCase()) ||
        post.author.toLowerCase().includes(search.toLowerCase()),
    )

    const totalPosts = filteredPosts.length
    const paginatedPosts = filteredPosts.slice(offset, offset + limit)

    return {
      posts: paginatedPosts,
      totalPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      hasNextPage: page < Math.ceil(totalPosts / limit),
      hasPrevPage: page > 1,
    }
  },
})


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
        q.search("postDescription", args.search)
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

    if (!post) {
      throw new ConvexError("Post not found");
    }
    const newLikes = args.increment ? (post.likes ?? 0) + 1 : (post.likes ?? 0) - 1;
    return await ctx.db.patch(args.postId, {
      likes: newLikes,
    });
  },
});

// this mutation will update the views of the post.
export const updatePostViews = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new ConvexError("Post not found");
    }

    return await ctx.db.patch(args.postId, {
      views: post.views + 1,
    });
  },
});

// this mutation will delete the post.
export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
    imageStorageId: v.id("_storage"),
    audioStorageId: v.optional(v.union(v.id("_storage"), v.null())),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new ConvexError("Post not found");
    }

    // Conditionally delete image and audio storage
    if (args.imageStorageId) {
      try {
        await ctx.storage.delete(args.imageStorageId);
      } catch (error) {
        console.error(`Error deleting image storage: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    if (args.audioStorageId) {
      try {
        await ctx.storage.delete(args.audioStorageId);
      } catch (error) {
        console.error(`Error deleting audio storage: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // Always delete the post itself
    return await ctx.db.delete(args.postId);
  },
});

// create saved posts for bookmarks
export const createSavedPost = mutation({
  args: {
    audioStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    imageStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    postTitle: v.string(),
    postId: v.id("posts"),
    postDescription: v.string(),
    imageUrl: v.string(),
    postContent: v.string(),
    imagePrompt: v.optional(v.string()),
    postCategory: v.string(),
    views: v.number(),
    likes: v.number(),
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

    const [firstUser] = user;
    if (!firstUser) {
      throw new ConvexError("User not found");
    }

    return await ctx.db.insert("savedPosts", {
      audioStorageId: args.audioStorageId,
      imageStorageId: args.imageStorageId,
      imagePrompt: args.imagePrompt ?? "",
      user: firstUser._id,
      postTitle: args.postTitle,
      postId: args.postId,
      imageUrl: args.imageUrl,
      postDescription: args.postDescription,
      postContent: args.postContent,
      postCategory: args.postCategory,
      views: args.views,
      likes: args.likes,
      author: firstUser.name,
      authorId: firstUser.clerkId,
      authorImageUrl: firstUser.imageUrl,
      savedAt: Date.now(),
    });
  },
});

// get saved posts

export const getAllSavedPosts = query({
  handler: async (ctx) => {
    return await ctx.db.query("savedPosts").order("desc").collect();
  },
});

// export const getAllSavedPosts = query(async ({ db, auth }) => {
//   const identity = await auth.getUserIdentity();
//   if (!identity) {
//     throw new Error("Unauthenticated call to mutation");
//   }
//   const savedPosts = await db.query("savedPosts")
//     .filter((q) => q.eq(q.field("userId"), identity.subject))
//     .collect();

// Fetch the full post data for each saved post
//   const fullPosts = await Promise.all(
//     savedPosts.map(async (savedPost) => {
//       const post = await db.get(savedPost.postId);
//       return { ...post, savedPostId: savedPost._id };
//     })
//   );

//   return fullPosts;
// });

// this mutation will delete the Saved or bookmarked posts.

export const deleteSavedPost = mutation({
  args: {
    postId: v.id("posts"),
    audioStorageId: v.optional(v.union(v.null(), v.id("_storage"))),
    imageStorageId: v.optional(v.union(v.null(), v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new ConvexError("Post not found");
    }

    if (args.imageStorageId) {
      await ctx.storage.delete(args.imageStorageId);
    }
    if (args.audioStorageId) {
      await ctx.storage.delete(args.audioStorageId);
    }
    return await ctx.db.delete(args.postId);
  },
});

// save summary image
export const saveSummary = mutation({
  args: {
    postId: v.id("posts"),
    summary: v.string(),
  },
  handler: async (ctx, args) => {
    const { postId, summary } = args;

    // Update the post with the summary image URL
    const updatedPost = await ctx.db.patch(postId, {
      summary,
    });

    return updatedPost;
  },
});


// ======================= FOLLOW SYSTEM =======================

export const followUser = mutation({
  args: {
    followingId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");

    const followerId = identity.subject;
    if (followerId === args.followingId) {
      throw new ConvexError("You cannot follow yourself");
    }

    const existing = await ctx.db
      .query("followers")
      .withIndex("by_both", (q) =>
        q.eq("followerId", followerId).eq("followingId", args.followingId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { action: "unfollowed" };
    }

    await ctx.db.insert("followers", {
      followerId,
      followingId: args.followingId,
      createdAt: Date.now(),
    });
    return { action: "followed" };
  },
});

export const isFollowing = query({
  args: {
    followingId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const followerId = identity.subject;
    const existing = await ctx.db
      .query("followers")
      .withIndex("by_both", (q) =>
        q.eq("followerId", followerId).eq("followingId", args.followingId)
      )
      .unique();

    return !!existing;
  },
});

export const getFollowerCount = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const followers = await ctx.db
      .query("followers")
      .withIndex("by_following", (q) => q.eq("followingId", args.userId))
      .collect();
    return followers.length;
  },
});

export const getFollowingCount = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const following = await ctx.db
      .query("followers")
      .withIndex("by_follower", (q) => q.eq("followerId", args.userId))
      .collect();
    return following.length;
  },
});

export const getPostsByFollowing = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const follows = await ctx.db
      .query("followers")
      .withIndex("by_follower", (q) => q.eq("followerId", identity.subject))
      .collect();

    const followingIds = follows.map((f) => f.followingId);
    if (followingIds.length === 0) return [];

    const posts = await ctx.db.query("posts").order("desc").collect();
    return posts.filter((post) => followingIds.includes(post.authorId));
  },
});

// ======================= READING LIST =======================

export const addToReadingList = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) throw new ConvexError("User not found");

    const existing = await ctx.db
      .query("readingList")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", user._id).eq("postId", args.postId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { action: "removed" };
    }

    await ctx.db.insert("readingList", {
      userId: user._id,
      postId: args.postId,
      isRead: false,
      addedAt: Date.now(),
    });
    return { action: "added" };
  },
});

export const getReadingList = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) return [];

    const items = await ctx.db
      .query("readingList")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    const posts = await Promise.all(
      items.map(async (item) => {
        const post = await ctx.db.get(item.postId);
        return { ...post, readingListId: item._id, isRead: item.isRead };
      })
    );

    return posts.filter((p) => p !== null);
  },
});

export const markAsRead = mutation({
  args: {
    readingListId: v.id("readingList"),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.readingListId);
    if (!item) throw new ConvexError("Item not found");

    await ctx.db.patch(args.readingListId, {
      isRead: !item.isRead,
    });
    return { isRead: !item.isRead };
  },
});

// ======================= COMMENT REACTIONS =======================

export const toggleCommentReaction = mutation({
  args: {
    commentId: v.id("comments"),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");

    const userId = identity.subject;
    const existing = await ctx.db
      .query("commentReactions")
      .withIndex("by_user_and_comment", (q) =>
        q.eq("userId", userId).eq("commentId", args.commentId)
      )
      .unique();

    if (existing) {
      if (existing.emoji === args.emoji) {
        await ctx.db.delete(existing._id);
        return { action: "removed" };
      }
      await ctx.db.patch(existing._id, { emoji: args.emoji });
      return { action: "updated" };
    }

    await ctx.db.insert("commentReactions", {
      commentId: args.commentId,
      userId,
      emoji: args.emoji,
      createdAt: Date.now(),
    });
    return { action: "added" };
  },
});

export const getCommentReactions = query({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const reactions = await ctx.db
      .query("commentReactions")
      .withIndex("by_comment", (q) => q.eq("commentId", args.commentId))
      .collect();

    const grouped: Record<string, number> = {};
    reactions.forEach((r) => {
      grouped[r.emoji] = (grouped[r.emoji] || 0) + 1;
    });

    return { reactions, grouped, total: reactions.length };
  },
});

export const getUserCommentReaction = query({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const reaction = await ctx.db
      .query("commentReactions")
      .withIndex("by_user_and_comment", (q) =>
        q.eq("userId", identity.subject).eq("commentId", args.commentId)
      )
      .unique();

    return reaction?.emoji || null;
  },
});

// ======================= POST CLAPS (Medium-style) =======================

export const clapPost = mutation({
  args: {
    postId: v.id("posts"),
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");

    const userId = identity.subject;
    const clampedCount = Math.max(1, Math.min(args.count, 50));

    const existing = await ctx.db
      .query("claps")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", userId).eq("postId", args.postId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        count: existing.count + clampedCount,
      });
      return { totalClaps: existing.count + clampedCount };
    }

    await ctx.db.insert("claps", {
      postId: args.postId,
      userId,
      count: clampedCount,
      createdAt: Date.now(),
    });
    return { totalClaps: clampedCount };
  },
});

export const getPostClaps = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const claps = await ctx.db
      .query("claps")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    const totalClaps = claps.reduce((sum, c) => sum + c.count, 0);
    const clapperCount = claps.length;

    return { totalClaps, clapperCount };
  },
});

export const getUserClap = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const clap = await ctx.db
      .query("claps")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", identity.subject).eq("postId", args.postId)
      )
      .unique();

    return clap?.count || 0;
  },
});
