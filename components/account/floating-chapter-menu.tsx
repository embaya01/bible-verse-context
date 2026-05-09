"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/browser";
import { HistoryLogger } from "./history-logger";
import { ChapterTextDialog } from "./chapter-text-dialog";
import { NoteDialog } from "./note-dialog";
import { SignInModal } from "@/components/auth/sign-in-modal";

interface FloatingChapterMenuProps {
  bookSlug: string;
  bookName: string;
  chapter: number;
  user: User | null;
  initialSaved: boolean;
  initialNote: string;
}

export function FloatingChapterMenu({
  bookSlug,
  bookName,
  chapter,
  user,
  initialSaved,
  initialNote,
}: FloatingChapterMenuProps) {
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [saved,         setSaved]         = useState(initialSaved);
  const [note,          setNote]          = useState(initialNote);
  const [copied,        setCopied]        = useState(false);
  const [noteOpen,      setNoteOpen]      = useState(false);
  const [chapterOpen,   setChapterOpen]   = useState(false);
  const [signInOpen,    setSignInOpen]    = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Close menu on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [menuOpen]);

  const toggleFavorite = useCallback(async () => {
    if (!user) { setSignInOpen(true); setMenuOpen(false); return; }
    if (saved) {
      await supabase.from("favorites").delete()
        .eq("user_id", user.id).eq("book", bookSlug).eq("chapter", chapter);
      setSaved(false);
    } else {
      await supabase.from("favorites").upsert({ user_id: user.id, book: bookSlug, chapter });
      setSaved(true);
    }
  }, [user, saved, bookSlug, chapter, supabase]);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setMenuOpen(false);
  }

  const actions = [
    {
      id: "note",
      icon: <PenIcon />,
      label: note ? "Edit note" : "Add a note",
      active: !!note,
      onClick: () => { setNoteOpen(true); setMenuOpen(false); },
    },
    {
      id: "favorite",
      icon: <StarIcon filled={saved} />,
      label: saved ? "Saved" : "Add to favorites",
      active: saved,
      onClick: () => { toggleFavorite(); setMenuOpen(false); },
    },
    {
      id: "chapter",
      icon: <BookIcon />,
      label: "View full chapter",
      active: false,
      onClick: () => { setChapterOpen(true); setMenuOpen(false); },
    },
    {
      id: "copy",
      icon: <LinkIcon copied={copied} />,
      label: copied ? "Copied!" : "Copy link",
      active: copied,
      onClick: copyLink,
    },
  ];

  return (
    <>
      <HistoryLogger book={bookSlug} chapter={chapter} user={user} />

      {/* FAB + menu */}
      <div ref={menuRef} className="fixed bottom-7 left-6 z-40 flex flex-col items-start gap-2">

        {/* Action menu — slides up from FAB */}
        <div
          className={`flex flex-col gap-1 mb-1 transition-all duration-200 origin-bottom ${
            menuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-3 pointer-events-none"
          }`}
          aria-hidden={!menuOpen}
        >
          {actions.map(({ id, icon, label, active, onClick }, i) => (
            <button
              key={id}
              onClick={onClick}
              style={{ transitionDelay: menuOpen ? `${i * 35}ms` : "0ms" }}
              className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm font-sans shadow-lg transition-all duration-200
                ${active
                  ? "border-amber/50 bg-amber/10 text-amber"
                  : "border-border bg-card text-foreground hover:border-amber/30 hover:bg-muted/60"
                }
                ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
              `}
            >
              <span className="w-4 h-4 flex items-center justify-center shrink-0">
                {icon}
              </span>
              <span className="whitespace-nowrap">{label}</span>
            </button>
          ))}
        </div>

        {/* FAB button */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Chapter actions"}
          aria-expanded={menuOpen}
          className={`relative w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-300
            ${menuOpen
              ? "bg-foreground text-background scale-95"
              : "bg-amber text-amber-foreground hover:scale-105 active:scale-95"
            }
          `}
        >
          {/* Ambient glow ring */}
          <span
            className={`absolute inset-0 rounded-full transition-opacity duration-300 ${menuOpen ? "opacity-0" : "opacity-40"}`}
            style={{ boxShadow: "0 0 16px 4px oklch(0.745 0.17 72 / 0.5)" }}
          />
          <span
            className={`transition-all duration-300 text-lg leading-none select-none ${menuOpen ? "rotate-45 scale-90" : "rotate-0"}`}
          >
            ✦
          </span>
        </button>
      </div>

      {/* Dialogs */}
      <NoteDialog
        open={noteOpen}
        onClose={() => setNoteOpen(false)}
        bookSlug={bookSlug}
        bookName={bookName}
        chapter={chapter}
        user={user}
        initialNote={note}
        onSave={setNote}
        onSignInRequest={() => setSignInOpen(true)}
      />
      <ChapterTextDialog
        open={chapterOpen}
        onClose={() => setChapterOpen(false)}
        bookName={bookName}
        chapter={chapter}
      />
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </>
  );
}

// ── Icons ────────────────────────────────────────────────────────

function PenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function LinkIcon({ copied }: { copied: boolean }) {
  if (copied) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
