import { ReferenceForm } from "@/components/reference-form";
import { BOOKS } from "@/lib/bible/books";

const SUGGESTIONS = [
  { book: "genesis",        chapter: 1,  label: "Genesis 1",     note: "The creation" },
  { book: "psalms",         chapter: 23, label: "Psalm 23",      note: "The shepherd" },
  { book: "isaiah",         chapter: 53, label: "Isaiah 53",     note: "The suffering servant" },
  { book: "matthew",        chapter: 5,  label: "Matthew 5",     note: "Sermon on the Mount" },
  { book: "john",           chapter: 3,  label: "John 3",        note: "Born again" },
  { book: "romans",         chapter: 8,  label: "Romans 8",      note: "No condemnation" },
  { book: "1-corinthians",  chapter: 13, label: "1 Cor. 13",     note: "The love chapter" },
  { book: "revelation",     chapter: 21, label: "Rev. 21",       note: "New creation" },
] as const;

export default function Home() {
  return (
    <div className="animate-slide-up">

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="pt-8 pb-14 text-center space-y-7">
        {/* Ornamental subtitle */}
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-14 bg-amber/40" />
          <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-amber/70">
            Evangelical Protestant · AI-generated context
          </span>
          <div className="h-px w-14 bg-amber/40" />
        </div>

        {/* Main headline — Cormorant Garamond, large, light weight */}
        <div>
          <h1 className="font-display font-light text-[clamp(2.8rem,8.5vw,4.75rem)] leading-[1.06] tracking-tight text-foreground">
            Don&apos;t just read<br />
            <em>the Bible.</em>
          </h1>
          <p className="font-display text-[clamp(1.85rem,5.5vw,3.2rem)] font-light italic text-muted-foreground leading-snug mt-1">
            Understand it.
          </p>
        </div>

        {/* Subtext */}
        <p className="text-sm text-muted-foreground max-w-[40ch] mx-auto leading-relaxed">
          Historical, cultural, and devotional background for any Bible chapter —
          who wrote it, to whom, and why it still matters.
        </p>
      </section>

      {/* ── Ornamental divider ───────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-10">
        <div className="flex-1 h-px bg-border" />
        <span className="text-amber/40 text-sm font-display">✦</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* ── Form ────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-card px-6 py-7 shadow-sm mb-12">
        <p className="font-display text-[1.25rem] font-medium tracking-wide mb-5">
          Choose a chapter
        </p>
        <ReferenceForm books={BOOKS} />
      </section>

      {/* ── Popular chapters ────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-4 mb-5">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-muted-foreground shrink-0">
            Popular chapters
          </p>
          <div className="flex-1 h-px bg-border/60" />
        </div>

        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SUGGESTIONS.map(({ book, chapter, label, note }) => (
            <li key={`${book}-${chapter}`}>
              <a
                href={`/${book}/${chapter}`}
                className="group flex flex-col gap-0.5 rounded-xl border border-border bg-card px-3.5 py-3 transition-all duration-200 hover:border-amber/35 hover:bg-accent hover:shadow-sm"
              >
                <span className="font-display text-[1.05rem] font-medium leading-snug text-foreground">
                  {label}
                </span>
                <span className="text-[11px] text-muted-foreground font-sans">
                  {note}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
}
