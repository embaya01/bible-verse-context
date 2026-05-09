import { streamObject, jsonSchema } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createClient } from "@supabase/supabase-js";
import { SYSTEM_PROMPT, PROMPT_VERSION } from "@/lib/claude/system-prompt";
import { getBookBySlug, isValidChapter } from "@/lib/bible/books";
import { checkDailyCeiling } from "@/lib/rate-limit";
import type { ChapterContextPayload } from "@/lib/supabase/client";

export const runtime = "nodejs";
export const maxDuration = 60;

const PayloadJsonSchema = jsonSchema<ChapterContextPayload>({
  type: "object",
  properties: {
    synopsis: { type: "string" },
    timeline_year: { type: "integer" },
    historical: {
      type: "object",
      properties: {
        date_written: { type: "string" },
        period: { type: "string" },
        author: { type: "string" },
        audience: { type: "string" },
        purpose: { type: "string" },
      },
      required: ["date_written", "period", "author", "audience", "purpose"],
      additionalProperties: false,
    },
    people_places: {
      type: "object",
      properties: {
        people: {
          type: "array",
          items: {
            type: "object",
            properties: { name: { type: "string" }, description: { type: "string" } },
            required: ["name", "description"],
            additionalProperties: false,
          },
        },
        places: {
          type: "array",
          items: {
            type: "object",
            properties: { name: { type: "string" }, description: { type: "string" } },
            required: ["name", "description"],
            additionalProperties: false,
          },
        },
      },
      required: ["people", "places"],
      additionalProperties: false,
    },
    cultural_religious: {
      type: "object",
      properties: {
        customs: { type: "array", items: { type: "string" } },
        surrounding_cultures: { type: "array", items: { type: "string" } },
        audience_beliefs: { type: "array", items: { type: "string" } },
      },
      required: ["customs", "surrounding_cultures", "audience_beliefs"],
      additionalProperties: false,
    },
    themes_takeaway: {
      type: "object",
      properties: {
        main_themes: { type: "array", items: { type: "string" } },
        cross_references: {
          type: "array",
          items: {
            type: "object",
            properties: { reference: { type: "string" }, note: { type: "string" } },
            required: ["reference", "note"],
            additionalProperties: false,
          },
        },
        application: { type: "string" },
      },
      required: ["main_themes", "cross_references", "application"],
      additionalProperties: false,
    },
    scholarly_basis: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      maxItems: 4,
    },
  },
  required: [
    "synopsis",
    "timeline_year",
    "historical",
    "people_places",
    "cultural_religious",
    "themes_takeaway",
    "scholarly_basis",
  ],
  additionalProperties: false,
});

export async function POST(req: Request) {
  const { bookSlug, chapter } = await req.json() as { bookSlug: string; chapter: number };

  const book = getBookBySlug(bookSlug);
  if (!book || !isValidChapter(book, chapter)) {
    return new Response("Not found", { status: 404 });
  }

  if (!checkDailyCeiling()) {
    return new Response(JSON.stringify({ error: "Daily generation limit reached. Try again tomorrow." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  const result = streamObject({
    model: anthropic("claude-sonnet-4-6"),
    schema: PayloadJsonSchema,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Generate the context document for ${book.name} ${chapter}. Return JSON only.`,
      },
    ],
    maxOutputTokens: 2500,
    onFinish: async ({ object }) => {
      if (!object) return;
      await supabase.from("chapter_context").upsert({
        book: bookSlug,
        chapter,
        payload: object,
        model: "claude-sonnet-4-6",
        prompt_version: PROMPT_VERSION,
      });
    },
  });

  // Stream partial objects as newline-delimited JSON
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const partial of result.partialObjectStream) {
          controller.enqueue(encoder.encode(JSON.stringify(partial) + "\n"));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson" },
  });
}
