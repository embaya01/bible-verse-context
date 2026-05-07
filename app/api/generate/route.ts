import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getBookBySlug, isValidChapter } from "@/lib/bible/books";
import { generateAndCacheContext, getCachedContext } from "@/lib/cache/chapter-context";
import { checkDailyCeiling, checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

const BodySchema = z.object({
  book: z.string().min(1),
  chapter: z.number().int().positive(),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again in an hour." },
      { status: 429, headers: { "Retry-After": "3600" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const book = getBookBySlug(parsed.data.book);
  if (!book) {
    return NextResponse.json({ error: "Unknown book" }, { status: 404 });
  }
  if (!isValidChapter(book, parsed.data.chapter)) {
    return NextResponse.json(
      { error: `${book.name} only has ${book.chapters} chapters` },
      { status: 400 },
    );
  }

  try {
    const cached = await getCachedContext(book, parsed.data.chapter);
    if (cached) {
      return NextResponse.json({
        book: book.slug,
        chapter: parsed.data.chapter,
        payload: cached,
        cacheHit: true,
      });
    }

    if (!checkDailyCeiling()) {
      return NextResponse.json(
        { error: "Daily generation limit reached. Try again tomorrow." },
        { status: 429 },
      );
    }

    const payload = await generateAndCacheContext(book, parsed.data.chapter);
    return NextResponse.json({
      book: book.slug,
      chapter: parsed.data.chapter,
      payload,
      cacheHit: false,
    });
  } catch (err) {
    console.error("[/api/generate] error:", err);
    return NextResponse.json(
      { error: "Failed to generate context" },
      { status: 500 },
    );
  }
}
