"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { BibleBook } from "@/lib/bible/books";

type Props = { books: BibleBook[] };

export function ReferenceForm({ books }: Props) {
  const router = useRouter();
  const [bookSlug, setBookSlug] = useState("john");
  const [chapter, setChapter] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedBook = useMemo(
    () => books.find((b) => b.slug === bookSlug) ?? books[0],
    [books, bookSlug],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ch = Number(chapter);
    if (!ch || ch < 1 || ch > selectedBook.chapters) {
      setError(`${selectedBook.name} has ${selectedBook.chapters} chapter${selectedBook.chapters > 1 ? "s" : ""}.`);
      return;
    }
    setError(null);
    setLoading(true);
    router.push(`/${selectedBook.slug}/${ch}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 space-y-1.5 text-sm">
          <span className="font-medium text-foreground">Book</span>
          <select
            value={bookSlug}
            onChange={(e) => {
              setBookSlug(e.target.value);
              setChapter(1);
              setError(null);
            }}
            className={cn(
              "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
              "ring-offset-background transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            )}
          >
            <optgroup label="Old Testament">
              {books
                .filter((b) => b.testament === "OT")
                .map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
            </optgroup>
            <optgroup label="New Testament">
              {books
                .filter((b) => b.testament === "NT")
                .map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
            </optgroup>
          </select>
        </label>

        <label className="space-y-1.5 text-sm sm:w-28">
          <span className="font-medium text-foreground">Chapter</span>
          <input
            type="number"
            min={1}
            max={selectedBook.chapters}
            value={chapter}
            onChange={(e) => {
              setChapter(parseInt(e.target.value, 10) || 1);
              setError(null);
            }}
            className={cn(
              "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
              "ring-offset-background transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              error && "border-destructive focus:ring-destructive",
            )}
          />
        </label>

        <Button
          type="submit"
          disabled={loading}
          className="sm:mb-0 transition-all duration-150"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Spinner />
              Loading…
            </span>
          ) : (
            "Get context →"
          )}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive animate-fade-in">{error}</p>
      )}

      {selectedBook.chapters > 1 && (
        <p className="text-xs text-muted-foreground">
          {selectedBook.name} has{" "}
          <span className="font-medium">{selectedBook.chapters}</span> chapters.
        </p>
      )}
    </form>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
