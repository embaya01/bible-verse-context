import { ReferenceForm } from "@/components/reference-form";
import { BOOKS } from "@/lib/bible/books";

const SUGGESTIONS = [
  { book: "genesis", chapter: 1, label: "Genesis 1", note: "the creation" },
  { book: "psalms", chapter: 23, label: "Psalm 23", note: "the shepherd" },
  { book: "isaiah", chapter: 53, label: "Isaiah 53", note: "the suffering servant" },
  { book: "matthew", chapter: 5, label: "Matthew 5", note: "the sermon on the mount" },
  { book: "john", chapter: 3, label: "John 3", note: "born again" },
  { book: "romans", chapter: 8, label: "Romans 8", note: "no condemnation" },
  { book: "1-corinthians", chapter: 13, label: "1 Corinthians 13", note: "love chapter" },
  { book: "revelation", chapter: 21, label: "Revelation 21", note: "new creation" },
] as const;

export default function Home() {
  return (
    <div className="space-y-12 animate-slide-up">
      {/* Hero */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
          <span className="text-[10px]">✦</span>
          Evangelical Protestant framing · KJV / WEB translations coming soon
        </div>
        <h1 className="text-4xl font-semibold tracking-tight leading-[1.15]">
          Don&apos;t just read the Bible.<br />
          <span className="text-muted-foreground font-normal">Understand it.</span>
        </h1>
        <p className="text-base text-muted-foreground max-w-lg">
          Pick any Bible chapter and get the historical, cultural, and devotional
          background in plain English — who wrote it, who they wrote to, and why it matters.
        </p>
      </section>

      {/* Form */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium mb-4">Choose a chapter</p>
        <ReferenceForm books={BOOKS} />
      </section>

      {/* Suggestions */}
      <section>
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
          Popular chapters
        </p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SUGGESTIONS.map(({ book, chapter, label, note }) => (
            <li key={`${book}-${chapter}`}>
              <a
                href={`/${book}/${chapter}`}
                className="group flex flex-col gap-0.5 rounded-xl border border-border bg-card px-3 py-2.5 text-sm transition-all duration-150 hover:border-foreground/20 hover:bg-accent hover:shadow-sm"
              >
                <span className="font-medium text-foreground">{label}</span>
                <span className="text-xs text-muted-foreground capitalize">{note}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
