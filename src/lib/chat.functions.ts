import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
});

const InputSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(30),
});

export const chatWithAI = createServerFn({ method: "POST" })
  .inputValidator((input) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { reply: "", error: "AI service is not configured." };
    }

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content:
                "You are a friendly shopping assistant for My Store, an online fashion store for Men, Women and Kids. Help users find products, suggest outfits, answer sizing/return/shipping questions and give style tips. Keep replies short, helpful and warm.",
            },
            ...data.messages,
          ],
        }),
      });

      if (res.status === 429) return { reply: "", error: "Too many requests. Please try again in a moment." };
      if (res.status === 402) return { reply: "", error: "AI credits exhausted. Please add credits to continue." };
      if (!res.ok) {
        console.error("AI gateway error:", res.status, await res.text());
        return { reply: "", error: "AI service is currently unavailable." };
      }

      const json = await res.json();
      const reply = json?.choices?.[0]?.message?.content ?? "";
      return { reply, error: null };
    } catch (e) {
      console.error("chatWithAI failed:", e);
      return { reply: "", error: "Something went wrong. Please try again." };
    }
  });
