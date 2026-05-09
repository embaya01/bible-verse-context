"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface Verse { verse: number; text: string; }

interface ChapterTextDialogProps {
  open: boolean;
  onClose: () => void;
  bookName: string;
  chapter: number;
}

export function ChapterTextDialog({
  open,
  onClose,
  bookName,
  chapter,
}: ChapterTextDialogProps) {
  const [verses, setVerses]     = useState<Verse[]>([]);
  const [status, setStatus]     = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    if (!open) return;
    if (verses.length > 0) return; // already loaded
    setStatus("loading");
    fetch(`/api/kjv-chapter?book=${encodeURIComponent(bookName)}&chapter=${chapter}`)
      .then((r) => r.json())
      .then((data) => { setVerses(data.verses ?? []); setStatus("done"); })
      .catch(() => setStatus("error"));
  }, [open, bookName, chapter, verses.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={(e) => { if (e.currentTarget === e.target) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`${bookName} ${chapter} — King James Version`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/85 backdrop-blur-md animate-fade-in" />

      {/* Panel */}
      <div className="relative w-full max-w-lg max-h-[82vh] animate-blur-in flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber/60 to-transparent shrink-0" />

        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-6 pb-4 shrink-0">
          <div>
            <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-amber/70 mb-1">
              King James Version
            </p>
            <h2 className="font-display text-[1.8rem] font-light uppercase tracking-tight leading-none text-foreground">
              {bookName}
              <span className="ml-3 font-display text-lg text-muted-foreground font-normal not-italic tracking-[0.2em]">
                {chapter}
              </span>
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-muted-foreground/50 hover:text-foreground transition-colors text-lg leading-none mt-1 ml-4 shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="h-px bg-border/50 mx-6 shrink-0" />

        {/* Scrollable verse content */}
        <div className="overflow-y-auto px-7 py-5 flex-1">
          {status === "loading" && (
            <div className="space-y-3 animate-fade-in">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-5 h-3 rounded bg-muted mt-1 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 rounded bg-muted w-full" />
                    <div className="h-3 rounded bg-muted w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {status === "error" && (
            <p className="text-sm text-muted-foreground font-sans text-center py-10">
              Could not load chapter text. Please try again.
            </p>
          )}

          {status === "done" && (
            <div className="space-y-0 animate-fade-in">
              {verses.map(({ verse, text }) => (
                <p key={verse} className="flex gap-3 py-1.5 leading-relaxed">
                  <span className="font-mono text-[11px] text-amber/60 pt-[3px] w-5 text-right shrink-0 select-none">
                    {verse}
                  </span>
                  <span className="font-display text-[1.05rem] text-foreground/90">
                    {text}
                  </span>
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber/30 to-transparent shrink-0" />
      </div>
    </div>,
    document.body,
  );
}
