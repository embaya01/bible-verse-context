import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookBySlug, isValidChapter } from "@/lib/bible/books";
import { generateAndCacheContext, getCachedContext } from "@/lib/cache/chapter-context";
import { checkDailyCeiling } from "@/lib/rate-limit";
import { BibleTimeline } from "@/components/bible-timeline";
import { ContextCarousel } from "@/components/context-carousel";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ book: string; chapter: string }>;
}): Promise<Metadata> {
  const { book: bookSlug, chapter: chapterStr } = await params;
  const book = getBookBySlug(bookSlug);
  if (!book) return {};
  return {
    title: `${book.name} ${chapterStr}`,
    description: `Historical, cultural, and devotional context for ${book.name} chapter ${chapterStr}.`,
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ book: string; chapter: string }>;
}) {
  const { book: bookSlug, chapter: chapterStr } = await params;
  const book = getBookBySlug(bookSlug);
  const chapter = parseInt(chapterStr, 10);
  if (!book || !isValidChapter(book, chapter)) notFound();

  let payload = await getCachedContext(book, chapter);
  if (!payload) {
    if (!checkDailyCeiling()) {
      throw new Error("Daily generation limit reached. Try again tomorrow.");
    }
    payload = await generateAndCacheContext(book, chapter);
  }

  return (
    <article className="space-y-8 animate-slide-up">
      <header className="space-y-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Pick another chapter
        </Link>

        <div className="space-y-3">
          <Badge variant="secondary">
            {book.testament === "OT" ? "Old Testament" : "New Testament"}
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight">
            {book.name}{" "}
            <span className="text-muted-foreground font-normal">{chapter}</span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed max-w-prose">
            {payload.synopsis}
          </p>
        </div>

        <BibleTimeline
          timelineYear={payload.timeline_year}
          chapterLabel={`${book.name} ${chapter}`}
        />
      </header>

      <ContextCarousel payload={payload} />
    </article>
  );
}
