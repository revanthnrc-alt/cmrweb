"use node";

import { ConvexError, v } from "convex/values";

import { internalAction } from "./_generated/server";

export const completePrompt = internalAction({
  args: { prompt: v.string() },
  returns: v.string(),
  handler: async (_ctx, args) => {
    if (!process.env.GROQ_API_KEY) {
      throw new ConvexError("Missing GROQ_API_KEY");
    }

    if (process.env.NODE_ENV === "development") {
      console.log("[GROQ PROMPT]", args.prompt);
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        max_tokens: 500,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: args.prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new ConvexError(`Groq request failed: ${response.status} ${text}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content ?? "";
  },
});
