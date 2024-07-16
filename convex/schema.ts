import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
  posts: defineTable({
    user: v.id("users"),
    postTitle: v.string(),
    postContent: v.string(),
    postCategory: v.string(),
    postDescription: v.string(),
    audioUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    audioStorageId: v.union(v.id("_storage"), v.null()),
    author: v.string(),
    authorId: v.string(),
    authorImageUrl: v.string(),
    imageUrl: v.string(),
    imagePrompt: v.string(),
    // audioDuration: v.number(),
    views: v.number(),
    likes: v.optional(v.number()),

  })
  .searchIndex("search_author", {searchField: "author"})
  .searchIndex("search_title", {searchField: "postTitle"})
  .searchIndex("search_body", {searchField: "postDescription"}),
  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
  }),
});
