import { action } from "./_generated/server";
import { v } from "convex/values";
// import { Buffer } from 'buffer';
import OpenAI from "openai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generatePostAction = action({
  args: { prompt: v.string() },
  handler: async (ctx, { prompt }) => {
    try {
      const TEMPLATE = `You are a witty, creative writer. Generate a blog post in a markdown format based on the following prompt:
  
  Prompt: {prompt}
  
  Blog Post:`;

      const model = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: "gpt-3.5-turbo",
        temperature: 0.2,
      });

      const parser = new StringOutputParser();

      const promptTemplate = PromptTemplate.fromTemplate(TEMPLATE);
      const chain = promptTemplate.pipe(model).pipe(parser);

      const response = await chain.invoke({
        prompt: prompt,
      });

      // Extract the generated content from the response
      const generatedContent = response;

      return generatedContent;
    } catch (e: any) {
      console.error("Error generating post:", e);
      throw new Error("Failed to generate post");
    }
  },
});

export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    // do something with `args.a` and `args.b`

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
    const buffer = imageResponse.arrayBuffer();

    return buffer;
  },
});
