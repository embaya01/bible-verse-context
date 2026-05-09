"use client";

import { useState } from "react";
import Link from "next/link";

type HistoryItem  = { book: string; chapter: number; bookName: string; visited_at: string };
type FavoriteItem = { book: string; chapter: number; bookName: string; created_at: string };
type NoteItem     = { book: string; chapter: number; bookName: string; content: string; updated_at: string };

interface AccountTabsProps {
  history:   HistoryItem[];
  favorites: FavoriteItem[];
  notes:     NoteItem[];
}

type Tab = "history" | "saved" | "notes";

function relativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function AccountTabs({ history, favorites, notes }: AccountTabsProps) {
  const [tab, setTab] = useState<Tab>("history");

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "history",  label: "History",   count: history.length },
    { id: "saved",    label: "Saved",      count: favorites.length },
    { id: "notes",    label: "Notes",      count: notes.length },
  ];

  return (
    <div className="space-y-0">
      {/* Tab bar */}
      <div className="flex items-end gap-6 border-b border-border/60 pb-0">
        {tabs.map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`relative pb-3 text-xs font-sans uppercase tracking-[0.16em] transition-colors duration-150 ${
              tab === id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground/70"
            }`}
          >
            {label}
            {count > 0 && (
              <span className={`ml-1.5 font-mono text-[10px] ${tab === id ? "text-amber" : "text-muted-foreground/50"}`}>
                {count}
              </span>
            )}
            {tab === id && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-amber" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="pt-1">
        {tab === "history" && (
          <HistoryTab items={history} />
        )}
        {tab === "saved" && (
          <SavedTab items={favorites} />
        )}
        {tab === "notes" && (
          <NotesTab items={notes} />
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-3 text-center animate-fade-in">
      <span className="font-display text-3xl text-muted-foreground/30">{icon}</span>
      <p className="text-xs font-sans text-muted-foreground/60 max-w-[200px] leading-relaxed">
        {text}
      </p>
    </div>
  );
}

function HistoryTab({ items }: { items: HistoryItem[] }) {
  if (items.length === 0)
    return <EmptyState icon="✦" text="Chapters you visit will appear here." />;

  return (
    <ul className="divide-y divide-border/40 animate-fade-in">
      {items.map(({ book, chapter, bookName, visited_at }) => (
        <li key={`${book}/${chapter}`}>
          <Link
            href={`/${book}/${chapter}`}
            className="flex items-center justify-between py-3.5 group transition-colors duration-100 hover:bg-muted/30 -mx-2 px-2 rounded-lg"
          >
            <div className="space-y-0.5">
              <p className="font-display text-[1.05rem] font-normal text-foreground group-hover:text-amber transition-colors duration-100 leading-snug">
                {bookName}
                <span className="ml-2 font-sans text-xs text-muted-foreground font-normal tracking-wide">
                  Ch. {chapter}
                </span>
              </p>
            </div>
            <span className="text-[10px] font-sans text-muted-foreground/60 uppercase tracking-[0.12em] shrink-0 ml-4">
              {relativeDate(visited_at)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function SavedTab({ items }: { items: FavoriteItem[] }) {
  if (items.length === 0)
    return (
      <EmptyState
        icon="◇"
        text="Bookmark chapters by tapping the star on any chapter page."
      />
    );

  return (
    <ul className="divide-y divide-border/40 animate-fade-in">
      {items.map(({ book, chapter, bookName, created_at }) => (
        <li key={`${book}/${chapter}`}>
          <Link
            href={`/${book}/${chapter}`}
            className="flex items-center justify-between py-3.5 group transition-colors duration-100 hover:bg-muted/30 -mx-2 px-2 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-amber text-sm opacity-70 group-hover:opacity-100 transition-opacity">★</span>
              <p className="font-display text-[1.05rem] font-normal text-foreground group-hover:text-amber transition-colors duration-100 leading-snug">
                {bookName}
                <span className="ml-2 font-sans text-xs text-muted-foreground font-normal tracking-wide">
                  Ch. {chapter}
                </span>
              </p>
            </div>
            <span className="text-[10px] font-sans text-muted-foreground/60 uppercase tracking-[0.12em] shrink-0 ml-4">
              {relativeDate(created_at)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function NotesTab({ items }: { items: NoteItem[] }) {
  if (items.length === 0)
    return (
      <EmptyState
        icon="◌"
        text="Add personal reflections on any chapter page to see them here."
      />
    );

  return (
    <ul className="space-y-4 pt-4 animate-fade-in">
      {items.map(({ book, chapter, bookName, content, updated_at }) => (
        <li key={`${book}/${chapter}`}>
          <Link
            href={`/${book}/${chapter}`}
            className="block p-4 rounded-xl border border-border hover:border-amber/30 bg-card hover:bg-muted/30 transition-all duration-150 group"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <p className="font-display text-[1.05rem] text-foreground group-hover:text-amber transition-colors duration-100 leading-snug">
                {bookName}
                <span className="ml-2 font-sans text-xs text-muted-foreground font-normal tracking-wide">
                  Ch. {chapter}
                </span>
              </p>
              <span className="text-[10px] font-sans text-muted-foreground/60 uppercase tracking-[0.12em] shrink-0">
                {relativeDate(updated_at)}
              </span>
            </div>
            <p className="text-sm font-sans text-muted-foreground leading-relaxed line-clamp-3">
              {content}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
