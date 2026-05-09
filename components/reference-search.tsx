"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BOOKS,
  parseReference,
  type BibleBook,
} from "@/lib/bible/books";

// ── Parse helpers ────────────────────────────────────────────────────────────

type ParseResult = { type: "chapter"; href: string; label: string } | null;

function parseInput(raw: string): ParseResult {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const chapter = parseReference(trimmed);
  if (chapter) {
    return {
      type: "chapter",
      href: `/${chapter.book.slug}/${chapter.chapter}`,
      label: `${chapter.book.name} ${chapter.chapter}`,
    };
  }

  return null;
}

// Show book-name suggestions while the user is still typing the book part.
// Once a chapter number appears, suggestions close.
function getBookSuggestions(value: string): BibleBook[] {
  const raw = value.trim();
  if (!raw) return [];
  if (raw.includes(":")) return [];          // ignore verse-style input
  if (/\s+\d+$/.test(raw)) return [];        // chapter number already present
  const lower = raw.toLowerCase();
  return BOOKS.filter((b) => b.name.toLowerCase().startsWith(lower)).slice(0, 8);
}

// ── Component ────────────────────────────────────────────────────────────────

export function ReferenceSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const suggestions = getBookSuggestions(value);
  const parsed = parseInput(value);

  // Open/close as suggestions change
  useEffect(() => {
    setOpen(suggestions.length > 0);
    setActiveIdx(-1);
  }, [suggestions.length]);

  // Close on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function selectBook(book: BibleBook) {
    setValue(book.name + " ");
    setOpen(false);
    setActiveIdx(-1);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      selectBook(suggestions[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    if (!value.trim()) {
      setError("Enter a book and chapter.");
      return;
    }
    if (!parsed) {
      setError('Couldn\'t recognise that reference. Try "John 3", "Romans 8", or "Psalm 23".');
      return;
    }
    setError(null);
    setLoading(true);
    router.push(parsed.href);
  }

  const inputBase = cn(
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-sans",
    "ring-offset-background transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-amber/40 focus:ring-offset-1 focus:border-amber/50",
    error && "border-destructive focus:ring-destructive/40",
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-[10px] font-sans font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Reference
        </span>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Input + dropdown wrapper — must be position:relative */}
          <div ref={wrapRef} className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length > 0) setOpen(true);
              }}
              placeholder="John 3 · Romans 8 · Psalm 23"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              aria-autocomplete="list"
              aria-expanded={open}
              className={inputBase}
            />

            {/* ── Custom dropdown ─────────────────────────────────────── */}
            {open && suggestions.length > 0 && (
              <ul
                role="listbox"
                className={cn(
                  // Positioning: always below input, full width
                  "absolute left-0 right-0 top-[calc(100%+6px)] z-50",
                  // Shape & surface
                  "rounded-xl border border-border bg-card",
                  // Elevation
                  "shadow-[0_8px_32px_-4px_oklch(0_0_0/0.12),0_2px_8px_-2px_oklch(0_0_0/0.08)]",
                  // Scroll
                  "max-h-[260px] overflow-y-auto",
                  // Entry
                  "animate-fade-in",
                )}
              >
                {suggestions.map((book, i) => {
                  const isActive = i === activeIdx;
                  return (
                    <li key={book.slug} role="option" aria-selected={isActive}>
                      <button
                        type="button"
                        // mousedown fires before blur, so we preventDefault to
                        // keep input focused, then handle selection in onMouseUp
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectBook(book)}
                        className={cn(
                          // Layout
                          "flex w-full items-center justify-between gap-3 px-4 py-2.5",
                          // Divider between items (not before the first)
                          i > 0 && "border-t border-border/30",
                          // Typography
                          "font-display text-[1rem] leading-snug text-left",
                          // Amber left accent bar via border-l trick
                          "border-l-[3px] transition-colors duration-100",
                          isActive
                            ? "border-l-amber bg-amber/10 text-foreground"
                            : "border-l-transparent text-foreground/75 hover:border-l-amber/40 hover:bg-amber/[0.06] hover:text-foreground",
                          // Round top/bottom of list
                          i === 0 && "rounded-t-xl",
                          i === suggestions.length - 1 && "rounded-b-xl",
                        )}
                      >
                        <span>{book.name}</span>
                        <span className="shrink-0 text-[9px] font-sans font-semibold uppercase tracking-[0.18em] text-amber/60">
                          {book.testament}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="transition-all duration-200 font-sans shrink-0"
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
      </label>

      {/* Live parse preview */}
      {parsed && !error && (
        <p className="text-[11px] text-muted-foreground font-sans animate-fade-in">
          Chapter{" "}
          <span className="font-medium text-foreground">{parsed.label}</span>
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive animate-fade-in font-sans">
          {error}
        </p>
      )}

      {/* Helper hint */}
      {!parsed && !error && (
        <p className="text-[11px] text-muted-foreground font-sans">
          Enter a book and chapter (e.g.{" "}
          <span className="font-medium text-foreground/70">John 3</span> or{" "}
          <span className="font-medium text-foreground/70">Romans 8</span>).
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
