import { getSupabaseAdmin, type ChapterContextPayload } from "@/lib/supabase/client";
import { generateChapterContext } from "@/lib/claude/generate";
import { MODEL, PROMPT_VERSION } from "@/lib/claude/system-prompt";
import type { BibleBook } from "@/lib/bible/books";

export async function getCachedContext(
  book: BibleBook,
  chapter: number,
): Promise<ChapterContextPayload | null> {
  const { data, error } = await getSupabaseAdmin()
    .from("chapter_context")
    .select("payload")
    .eq("book", book.slug)
    .eq("chapter", chapter)
    .eq("prompt_version", PROMPT_VERSION)
    .maybeSingle();

  if (error) throw error;
  return data ? (data.payload as ChapterContextPayload) : null;
}

export async function generateAndCacheContext(
  book: BibleBook,
  chapter: number,
): Promise<ChapterContextPayload> {
  const payload = await generateChapterContext(book, chapter);

  const { error } = await getSupabaseAdmin().from("chapter_context").insert({
    book: book.slug,
    chapter,
    payload,
    model: MODEL,
    prompt_version: PROMPT_VERSION,
  });

  if (error) {
    // A concurrent request may have inserted the row first; that's fine.
    console.error("[chapter-context] insert failed:", error.message);
  }

  return payload;
}
