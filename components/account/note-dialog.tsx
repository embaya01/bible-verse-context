"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/lib/supabase/browser";
import type { User } from "@supabase/supabase-js";

interface NoteDialogProps {
  open: boolean;
  onClose: () => void;
  bookSlug: string;
  bookName: string;
  chapter: number;
  user: User | null;
  initialNote: string;
  onSave: (content: string) => void;
  onSignInRequest: () => void;
}

export function NoteDialog({
  open,
  onClose,
  bookSlug,
  bookName,
  chapter,
  user,
  initialNote,
  onSave,
  onSignInRequest,
}: NoteDialogProps) {
  const [content, setContent]   = useState(initialNote);
  const [status, setStatus]     = useState<"idle" | "saving" | "saved">("idle");
  const textareaRef             = useRef<HTMLTextAreaElement>(null);
  const supabase                = createClient();

  useEffect(() => {
    if (open) {
      setContent(initialNote);
      setStatus("idle");
      setTimeout(() => textareaRef.current?.focus(), 80);
    }
  }, [open, initialNote]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  async function handleSave() {
    if (!user) return;
    setStatus("saving");
    const trimmed = content.trim();
    if (trimmed) {
      await supabase.from("notes").upsert({
        user_id: user.id,
        book: bookSlug,
        chapter,
        content: trimmed,
        updated_at: new Date().toISOString(),
      });
    } else {
      await supabase
        .from("notes")
        .delete()
        .eq("user_id", user.id)
        .eq("book", bookSlug)
        .eq("chapter", chapter);
    }
    setStatus("saved");
    onSave(trimmed);
    setTimeout(onClose, 700);
  }

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={(e) => { if (e.currentTarget === e.target) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Note for ${bookName} ${chapter}`}
    >
      <div className="absolute inset-0 bg-background/85 backdrop-blur-md animate-fade-in" />

      <div className="relative w-full max-w-sm animate-blur-in">
        {/* Amber glow */}
        <div
          className="absolute inset-0 rounded-2xl blur-2xl opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 40%, oklch(0.745 0.17 72), transparent 70%)" }}
        />

        <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-amber/60 to-transparent" />

          <div className="px-7 py-7 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-amber/70 mb-1">
                  Personal note
                </p>
                <h2 className="font-display text-xl font-light tracking-wide text-foreground leading-tight">
                  {bookName}{" "}
                  <span className="text-muted-foreground font-normal">{chapter}</span>
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

            {/* Auth gate */}
            {!user ? (
              <div className="text-center py-4 space-y-3">
                <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                  Sign in to write and save personal notes for this chapter.
                </p>
                <button
                  onClick={() => { onClose(); onSignInRequest(); }}
                  className="text-[11px] font-sans uppercase tracking-[0.14em] text-amber hover:text-amber/80 transition-colors"
                >
                  Sign in →
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => { setContent(e.target.value.slice(0, 2000)); setStatus("idle"); }}
                    placeholder="Write a reflection on this chapter…"
                    rows={6}
                    maxLength={2000}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3.5 text-sm font-sans text-foreground placeholder:text-muted-foreground/40 resize-none outline-none transition-all duration-200 focus:border-amber/50 focus:ring-2 focus:ring-amber/15 leading-relaxed"
                  />
                  <span className="absolute bottom-3 right-3 text-[10px] font-mono text-muted-foreground/30 pointer-events-none">
                    {content.length}/2000
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-lg border border-border py-2.5 text-sm font-sans text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={status === "saving"}
                    className="flex-1 rounded-lg bg-amber text-amber-foreground font-sans text-sm font-medium py-2.5 transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                  >
                    {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save note"}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-amber/30 to-transparent" />
        </div>
      </div>
    </div>,
    document.body,
  );
}
