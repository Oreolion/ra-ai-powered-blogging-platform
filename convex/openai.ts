import { action } from "./_generated/server";
import { v } from "convex/values";
import { RateLimitError } from "../lib/limitError";
// import { Buffer } from 'buffer';
import OpenAI from "openai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { api } from "./_generated/api";

export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generatePostAction = action({
  args: { prompt: v.string() },
  handler: async (ctx, { prompt }) => {
    // Get the user's ID from the context
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    const userId = identity.subject;
    // Check if the user has exceeded their limit
    const userCallCount = await ctx.runQuery(
      api.userCallsCount.getUserCallCount,
      {
        userId: userId,
      }
    );

    if (userCallCount >= 4) {
      throw new RateLimitError(
        "You have exceeded the maximum number of calls to this function."
      );
    }

    try {
      const TEMPLATE = `You are a witty, creative writer. Generate a blog post in a markdown format based on the following prompt, remember to always add paragrapgh and jump to the next line when needed. e.g at the end of every paragraph:
  
  Prompt: {prompt}
  
  Blog Post:`;

      const model = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: "gpt-4",
        temperature: 0.2,
      });

      const parser = new StringOutputParser();

      const promptTemplate = PromptTemplate.fromTemplate(TEMPLATE);
      const chain = promptTemplate.pipe(model).pipe(parser);

      const response = await chain.invoke({
        prompt: prompt,
      });

      // Increment the user's call count
      await ctx.runMutation(api.userCallsCount.incrementUserCallCount, {
        userId,
      });

      return response;
    } catch (e: any) {
      console.error("Error generating post:", e);
      throw new Error("Failed to generate post");
    }
  },
});

export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (ctx, { prompt }) => {
    // Get the user's ID from the context
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    const userId = identity.subject;
    // Check if the user has exceeded their limit
    const userCallCount = await ctx.runQuery(
      api.userCallsCount.getUserCallCount,
      {
        userId: userId,
      }
    );

    if (userCallCount >= 4) {
      throw new RateLimitError(
        "You have exceeded the maximum number of calls to this function."
      );
    }
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      });

      const url = response.data[0].url;
      if (!url) throw new Error("Error generating thumbnail");

      const imageResponse = await fetch(url);
      const buffer = await imageResponse.arrayBuffer();

      await ctx.runMutation(api.userCallsCount.incrementUserCallCount, {
        userId,
      });

      return buffer;
    } catch (e: any) {
      console.error("Error generating thumbnail:", e);
      throw new Error("Failed to generate thumbnail");
    }
  },
});

export const summarizePostAction = action({
  args: { content: v.string(), title: v.string() },
  handler: async (ctx, { content, title }) => {
    // Get the user's ID from the context
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    const userId = identity.subject;

    // Check if the user has exceeded their limit
    const userCallCount = await ctx.runQuery(
      api.userCallsCount.getUserCallCount,
      {
        userId: userId,
      }
    );

    if (userCallCount >= 4) {
      throw new RateLimitError(
        "You have exceeded the maximum number of calls to this function."
      );
    }

    try {
      const TEMPLATE = `You are a creative AI assistant that summarizes blog posts into concise, engaging summaries suitable for social media sharing.

Blog Title: {title}

Blog Content: {content}

Summary:
`;

      const model = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: "gpt-4",
        temperature: 0.3,
        maxTokens: 200,
      });

      const parser = new StringOutputParser();

      const promptTemplate = PromptTemplate.fromTemplate(TEMPLATE);
      const chain = promptTemplate.pipe(model).pipe(parser);

      const response = await chain.invoke({
        title: title,
        content: content,
      });

      // Increment the user's call count
      await ctx.runMutation(api.userCallsCount.incrementUserCallCount, {
        userId,
      });

      return response;
    } catch (e) {
      console.error("Error summarizing post:", e);
      throw new Error("Failed to summarize post");
    }
  },
});
