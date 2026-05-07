import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookBySlug, isValidChapter } from "@/lib/bible/books";
import { generateAndCacheContext, getCachedContext } from "@/lib/cache/chapter-context";
import { checkDailyCeiling } from "@/lib/rate-limit";
import { BibleTimeline } from "@/components/bible-timeline";
import { ContextCarousel } from "@/components/context-carousel";

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
    <article className="space-y-10 animate-slide-up">

      {/* ── Back link ───────────────────────────────────────────────── */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-colors duration-150"
      >
        ← All chapters
      </Link>

      {/* ── Chapter header ──────────────────────────────────────────── */}
      <header className="space-y-6">

        {/* Testament + book name + chapter ornament */}
        <div className="space-y-2">
          <p className="text-[10px] font-sans uppercase tracking-[0.22em] text-amber/80">
            {book.testament === "OT" ? "Old Testament" : "New Testament"}
          </p>

          <h1 className="font-display font-light uppercase tracking-tight leading-[0.92] text-[clamp(3rem,10vw,5.5rem)] text-foreground">
            {book.name}
          </h1>

          {/* Chapter ornament row */}
          <div className="flex items-center gap-3 pt-1">
            <div className="h-px w-10 bg-amber/50" />
            <span className="font-display text-sm tracking-[0.22em] text-amber italic">
              Chapter {chapter}
            </span>
            <div className="h-px w-10 bg-amber/50" />
          </div>
        </div>

        {/* Synopsis — italic Cormorant pull-quote */}
        <p className="font-display text-[1.2rem] font-normal italic leading-relaxed text-muted-foreground max-w-prose border-l-2 border-amber/30 pl-4">
          {payload.synopsis}
        </p>

        {/* Timeline */}
        <BibleTimeline
          timelineYear={payload.timeline_year}
          chapterLabel={`${book.name} ${chapter}`}
        />
      </header>

      {/* ── Content carousel ────────────────────────────────────────── */}
      <ContextCarousel payload={payload} />

    </article>
  );
}
