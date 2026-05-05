import { action } from "./_generated/server";
import { v } from "convex/values";
import { RateLimitError } from "../lib/limitError";
import OpenAI from "openai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { api } from "./_generated/api";
export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getStartOfDay = () => {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  )
    .toISOString()
    .split("T")[0];
};

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
    const currentDay = getStartOfDay();
    const userCallCount = await ctx.runQuery(
      api.userCallsCount.getUserCallCount,
      {
        userId: userId,
        day: currentDay,
      }
    );

    if (userCallCount >= 6) {
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
      const currentDay = getStartOfDay();

      await ctx.runMutation(api.userCallsCount.incrementUserCallCount, {
        userId,
        day: currentDay,
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
    const currentDay = getStartOfDay();

    const userCallCount = await ctx.runQuery(
      api.userCallsCount.getUserCallCount,
      {
        userId: userId,
        day: currentDay,
      }
    );

    if (userCallCount >= 6) {
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
        response_format: "url",
      });
      if (!response.data || !response.data[0]?.url) {
        throw new Error("Error generating thumbnail: No image URL returned");
      }

      const url = response.data[0].url;
      
      if (!url) throw new Error("Error generating thumbnail");

      const imageResponse = await fetch(url);
      const buffer = await imageResponse.arrayBuffer();

      await ctx.runMutation(api.userCallsCount.incrementUserCallCount, {
        userId,
        day: currentDay,
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
    const currentDay = getStartOfDay();

    const userCallCount = await ctx.runQuery(
      api.userCallsCount.getUserCallCount,
      {
        userId: userId,
        day: currentDay,
      }
    );

    if (userCallCount >= 6) {
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
      const currentDay = getStartOfDay();

      await ctx.runMutation(api.userCallsCount.incrementUserCallCount, {
        userId,
        day: currentDay,
      });

      return response;
    } catch (e) {
      console.error("Error summarizing post:", e);
      throw new Error("Failed to summarize post");
    }
  },
});

export const suggestTitlesAction = action({
  args: { content: v.string() },
  handler: async (ctx, { content }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const userId = identity.subject;
    const currentDay = getStartOfDay();

    const userCallCount = await ctx.runQuery(
      api.userCallsCount.getUserCallCount,
      { userId, day: currentDay }
    );
    if (userCallCount >= 6) {
      throw new RateLimitError("You have exceeded the maximum number of calls to this function.");
    }

    try {
      const TEMPLATE = `You are an expert copywriter. Based on the following blog post content, suggest 5 catchy, click-worthy titles. Each title should be on a new line starting with a number. No extra text, just the titles.

Blog Content:
{content}

Titles:`;

      const model = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: "gpt-4",
        temperature: 0.7,
        maxTokens: 150,
      });

      const parser = new StringOutputParser();
      const promptTemplate = PromptTemplate.fromTemplate(TEMPLATE);
      const chain = promptTemplate.pipe(model).pipe(parser);
      const response = await chain.invoke({ content });

      await ctx.runMutation(api.userCallsCount.incrementUserCallCount, {
        userId,
        day: currentDay,
      });

      return response;
    } catch (e) {
      console.error("Error suggesting titles:", e);
      throw new Error("Failed to suggest titles");
    }
  },
});

export const rewriteToneAction = action({
  args: { text: v.string(), tone: v.string() },
  handler: async (ctx, { text, tone }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const userId = identity.subject;
    const currentDay = getStartOfDay();

    const userCallCount = await ctx.runQuery(
      api.userCallsCount.getUserCallCount,
      { userId, day: currentDay }
    );
    if (userCallCount >= 6) {
      throw new RateLimitError("You have exceeded the maximum number of calls to this function.");
    }

    try {
      const TEMPLATE = `Rewrite the following text in a {tone} tone. Keep the same meaning and key points. Return only the rewritten text.

Text:
{text}

Rewritten:`;

      const model = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: "gpt-4",
        temperature: 0.5,
        maxTokens: 500,
      });

      const parser = new StringOutputParser();
      const promptTemplate = PromptTemplate.fromTemplate(TEMPLATE);
      const chain = promptTemplate.pipe(model).pipe(parser);
      const response = await chain.invoke({ text, tone });

      await ctx.runMutation(api.userCallsCount.incrementUserCallCount, {
        userId,
        day: currentDay,
      });

      return response;
    } catch (e) {
      console.error("Error rewriting tone:", e);
      throw new Error("Failed to rewrite tone");
    }
  },
});

export const expandContentAction = action({
  args: { text: v.string() },
  handler: async (ctx, { text }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const userId = identity.subject;
    const currentDay = getStartOfDay();

    const userCallCount = await ctx.runQuery(
      api.userCallsCount.getUserCallCount,
      { userId, day: currentDay }
    );
    if (userCallCount >= 6) {
      throw new RateLimitError("You have exceeded the maximum number of calls to this function.");
    }

    try {
      const TEMPLATE = `Expand the following text with more detail, examples, and depth. Keep the same writing style. Return only the expanded text.

Text:
{text}

Expanded:`;

      const model = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: "gpt-4",
        temperature: 0.4,
        maxTokens: 800,
      });

      const parser = new StringOutputParser();
      const promptTemplate = PromptTemplate.fromTemplate(TEMPLATE);
      const chain = promptTemplate.pipe(model).pipe(parser);
      const response = await chain.invoke({ text });

      await ctx.runMutation(api.userCallsCount.incrementUserCallCount, {
        userId,
        day: currentDay,
      });

      return response;
    } catch (e) {
      console.error("Error expanding content:", e);
      throw new Error("Failed to expand content");
    }
  },
});
