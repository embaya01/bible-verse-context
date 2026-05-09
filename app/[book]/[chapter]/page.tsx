import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookBySlug, isValidChapter } from "@/lib/bible/books";
import { getCachedContext } from "@/lib/cache/chapter-context";
import { ChapterAuthShell } from "@/components/account/chapter-auth-shell";
import { FloatingChapterMenu } from "@/components/account/floating-chapter-menu";
import { ChapterStreamContent } from "@/components/chapter-stream-content";
import { getUser, createClient } from "@/lib/supabase/server";

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

  const [cachedPayload, user] = await Promise.all([
    getCachedContext(book, chapter),
    getUser(),
  ]);

  let initialSaved = false;
  let initialNote = "";
  if (user) {
    const supabase = await createClient();
    const [{ data: fav }, { data: note }] = await Promise.all([
      supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("book", bookSlug)
        .eq("chapter", chapter)
        .maybeSingle(),
      supabase
        .from("notes")
        .select("content")
        .eq("user_id", user.id)
        .eq("book", bookSlug)
        .eq("chapter", chapter)
        .maybeSingle(),
    ]);
    initialSaved = !!fav;
    initialNote = note?.content ?? "";
  }

  return (
    <article className="space-y-10 animate-slide-up">

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-colors duration-150"
      >
        ← All chapters
      </Link>

      {/* Header — relative so bookmark button can anchor to top-right */}
      <header className="relative space-y-6">

        {/* Bookmark button (rendered by auth shell, absolute top-right) */}
        <ChapterAuthShell
          book={bookSlug}
          chapter={chapter}
          user={user}
          initialSaved={initialSaved}
          initialNote={initialNote}
          bookmarkOnly
        />

        <div className="space-y-2">
          <p className="text-[10px] font-sans uppercase tracking-[0.22em] text-amber/80">
            {book.testament === "OT" ? "Old Testament" : "New Testament"}
          </p>
          <h1 className="font-display font-light uppercase tracking-tight leading-[0.92] text-[clamp(3rem,10vw,5.5rem)] text-foreground">
            {book.name}
          </h1>
          <div className="flex items-center gap-3 pt-1">
            <div className="h-px w-10 bg-amber/50" />
            <span className="font-display text-sm tracking-[0.22em] text-amber italic">
              Chapter {chapter}
            </span>
            <div className="h-px w-10 bg-amber/50" />
          </div>
        </div>

      </header>

      <ChapterStreamContent
        bookSlug={bookSlug}
        bookName={book.name}
        chapter={chapter}
        initialPayload={cachedPayload}
      />

      {/* Floating action menu — history logging, notes, favorites, KJV text */}
      <FloatingChapterMenu
        bookSlug={bookSlug}
        bookName={book.name}
        chapter={chapter}
        user={user}
        initialSaved={initialSaved}
        initialNote={initialNote}
      />

    </article>
  );
}
