/**
 * Fetches verse text from bible-api.com (public-domain KJV, no API key required).
 *
 * API format: https://bible-api.com/{book}+{chapter}:{verse}
 * Range:      https://bible-api.com/{book}+{chapter}:{start}-{end}
 *
 * The colon separator must NOT be percent-encoded — it must remain a literal ":"
 * in the URL path or bible-api.com returns 404.
 */

export type KjvVerse = {
  verse: number;
  text: string;
};

export type KjvResult = {
  reference: string; // "John 3:16"
  text: string;      // full concatenated passage text
  verses: KjvVerse[];
};

/** Thrown when the verse reference is valid syntax but doesn't exist in the Bible. */
export class VerseNotFoundError extends Error {
  constructor(ref: string) {
    super(`Verse not found: ${ref}`);
    this.name = "VerseNotFoundError";
  }
}

type ApiResponse = {
  reference: string;
  text: string;
  verses: { verse: number; text: string }[];
};

export async function fetchVerseKjv(
  bookName: string,
  chapter: number,
  verse: string, // "16" or "28-39"
): Promise<KjvResult> {
  // Encode only the spaces in the book/chapter segment; keep ":" literal.
  const bookChapter = `${bookName} ${chapter}`.replace(/\s+/g, "+");
  const url = `https://bible-api.com/${bookChapter}:${verse}?translation=kjv`;
  const ref = `${bookName} ${chapter}:${verse}`;

  const res = await fetch(url, {
    next: { revalidate: 86_400 }, // cache 24 h in Next.js data-cache
  });

  if (res.status === 404) {
    throw new VerseNotFoundError(ref);
  }

  if (!res.ok) {
    throw new Error(`bible-api.com returned ${res.status} for "${ref}"`);
  }

  const data: ApiResponse = await res.json();

  return {
    reference: data.reference,
    text: data.text.trim().replace(/\n+/g, " "),
    verses: data.verses.map((v) => ({
      verse: v.verse,
      text: v.text.trim().replace(/\n/g, " "),
    })),
  };
}
