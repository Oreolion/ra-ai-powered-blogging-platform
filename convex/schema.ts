import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
// import { podcastData } from '../constants/index';

export default defineSchema({
  Posts: defineTable({
    audioStorageId: v.optional(v.id("_storage")),
    user: v.id("users"),
    podcastTitle: v.string(),
    postDescription: v.string(),
    audioUrl: v.optional(v.string()),
    audioStrorageId: v.optional(v.id("_storage")),
    author: v.string(),
    authorId: v.string(),
    authorImageUrl: v.string(),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    audioDuration: v.number(),
    views: v.number(),

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
