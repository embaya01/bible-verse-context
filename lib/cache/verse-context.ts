import { getSupabaseAdmin, type VerseContextPayload } from "@/lib/supabase/client";
import { generateVerseContext } from "@/lib/claude/generate-verse";
import { fetchVerseKjv } from "@/lib/bible/kjv-api";
import { VERSE_MODEL, VERSE_PROMPT_VERSION } from "@/lib/claude/verse-prompt";
import type { BibleBook } from "@/lib/bible/books";

export async function getCachedVerseContext(
  book: BibleBook,
  chapter: number,
  verse: string,
): Promise<VerseContextPayload | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("verse_context")
    .select("payload")
    .eq("book", book.slug)
    .eq("chapter", chapter)
    .eq("verse", verse)
    .eq("prompt_version", VERSE_PROMPT_VERSION)
    .maybeSingle();

  if (error) throw error;
  return data ? (data.payload as VerseContextPayload) : null;
}

export async function generateAndCacheVerseContext(
  book: BibleBook,
  chapter: number,
  verse: string,
): Promise<{ payload: VerseContextPayload; verseText: string }> {
  // 1. Fetch KJV text (cached 24h by Next.js data-cache)
  const kjv = await fetchVerseKjv(book.name, chapter, verse);

  // 2. Generate AI context
  const payload = await generateVerseContext(book, chapter, verse, kjv.text);

  // 3. Persist to Supabase
  const { error } = await getSupabaseAdmin().from("verse_context").insert({
    book: book.slug,
    chapter,
    verse,
    payload,
    model: VERSE_MODEL,
    prompt_version: VERSE_PROMPT_VERSION,
  });

  if (error) {
    // Concurrent request may have inserted first — non-fatal
    console.error("[verse-context] insert failed:", error.message);
  }

  return { payload, verseText: kjv.text };
}

export async function getVerseText(
  book: BibleBook,
  chapter: number,
  verse: string,
): Promise<string> {
  const kjv = await fetchVerseKjv(book.name, chapter, verse);
  return kjv.text;
}
