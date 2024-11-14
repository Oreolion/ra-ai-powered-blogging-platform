import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    user: v.id("users"),
    postTitle: v.string(),
    postContent: v.string(),
    postCategory: v.string(),
    summary: v.optional(v.string()),
    postDescription: v.string(),
    audioUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    audioStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    author: v.string(),
    authorId: v.string(),
    authorImageUrl: v.string(),
    imageUrl: v.string(),
    imagePrompt: v.string(),
    views: v.number(),
    viewedBy: v.optional(v.array(v.string())),
    likes: v.optional(v.number()),
  })
    .searchIndex("search_author", { searchField: "author" })
    .searchIndex("search_title", { searchField: "postTitle" })
    .searchIndex("search_body", { searchField: "postDescription" })
    .searchIndex("search_category", { searchField: "postCategory" }),
  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
  }),
  // comment tables ...
  comments: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
    username: v.optional(v.string()),
    commentUserImage: v.optional(v.string()),
    content: v.string(),
    _creationTime: v.number(),
    newContent: v.optional(v.string()),
    editedAt: v.optional(v.number()),
    createdAt: v.optional(v.number()),
  }).index("by_post", ["postId"]),

  // user open ai call count table...
  userCallCounts: defineTable({
    userId: v.string(),
    count: v.number(),
    day: v.optional(v.string()),
  }).index("by_userId_and_day", ["userId", "day"]),

  // bookmarks tables for schema ...
  savedPosts: defineTable({
    user: v.id("users"),
    userId: v.optional(v.id("users")),
    postId: v.optional(v.id("posts")),
    summary: v.optional(v.string()),
    postTitle: v.string(),
    postContent: v.string(),
    postCategory: v.string(),
    postDescription: v.string(),
    audioUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    audioStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    author: v.string(),
    authorId: v.string(),
    authorImageUrl: v.string(),
    imageUrl: v.string(),
    imagePrompt: v.string(),
    views: v.number(),
    viewedBy: v.optional(v.array(v.string())),
    likes: v.number(),
    savedAt: v.number(),
  }),
});
