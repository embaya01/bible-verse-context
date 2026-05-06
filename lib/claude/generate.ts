import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { MODEL, SYSTEM_PROMPT } from "./system-prompt";
import type { ChapterContextPayload } from "@/lib/supabase/client";
import type { BibleBook } from "@/lib/bible/books";

let cached: Anthropic | null = null;

function getAnthropic(): Anthropic {
  if (cached) return cached;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Missing ANTHROPIC_API_KEY in .env.local");
  cached = new Anthropic({ apiKey });
  return cached;
}

const PayloadSchema = z.object({
  historical: z.object({
    date_written: z.string(),
    period: z.string(),
    author: z.string(),
    audience: z.string(),
    purpose: z.string(),
  }),
  people_places: z.object({
    people: z.array(z.object({ name: z.string(), description: z.string() })),
    places: z.array(z.object({ name: z.string(), description: z.string() })),
  }),
  cultural_religious: z.object({
    customs: z.array(z.string()),
    surrounding_cultures: z.array(z.string()),
    audience_beliefs: z.array(z.string()),
  }),
  themes_takeaway: z.object({
    main_themes: z.array(z.string()),
    cross_references: z.array(z.object({ reference: z.string(), note: z.string() })),
    application: z.string(),
  }),
});

export async function generateChapterContext(
  book: BibleBook,
  chapter: number,
): Promise<ChapterContextPayload> {
  const anthropic = getAnthropic();
  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Generate the context document for ${book.name} ${chapter}. Return JSON only.`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude returned no text content");
  }

  const cleaned = stripCodeFences(textBlock.text);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(
      `Claude returned invalid JSON for ${book.name} ${chapter}: ${(err as Error).message}`,
    );
  }

  return PayloadSchema.parse(parsed);
}

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "")
      .trim();
  }
  return trimmed;
}
