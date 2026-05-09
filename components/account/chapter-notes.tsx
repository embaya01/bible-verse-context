"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { User } from "@supabase/supabase-js";

interface ChapterNotesProps {
  book: string;
  chapter: number;
  user: User | null;
  initialContent: string;
  onSignInRequest: () => void;
}

export function ChapterNotes({
  book,
  chapter,
  user,
  initialContent,
  onSignInRequest,
}: ChapterNotesProps) {
  const [content, setContent] = useState(initialContent);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [expanded, setExpanded] = useState(!!initialContent);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabase = createClient();

  const save = useCallback(
    async (value: string) => {
      if (!user) return;
      setSaveStatus("saving");
      if (value.trim()) {
        await supabase.from("notes").upsert({
          user_id: user.id,
          book,
          chapter,
          content: value.trim(),
          updated_at: new Date().toISOString(),
        });
      } else {
        await supabase
          .from("notes")
          .delete()
          .eq("user_id", user.id)
          .eq("book", book)
          .eq("chapter", chapter);
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    },
    [user, book, chapter, supabase],
  );

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value.slice(0, 2000);
    setContent(value);
    setSaveStatus("idle");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => save(value), 1200);
  }

  if (!user) {
    return (
      <div className="space-y-2">
        <SectionLabel />
        <button
          onClick={onSignInRequest}
          className="w-full rounded-xl border border-dashed border-border/60 px-4 py-6 text-center text-xs font-sans text-muted-foreground/60 hover:border-amber/30 hover:text-muted-foreground transition-all duration-150"
        >
          Sign in to write personal notes for this chapter
        </button>
      </div>
    );
  }

  if (!expanded) {
    return (
      <div className="space-y-2">
        <SectionLabel />
        <button
          onClick={() => setExpanded(true)}
          className="w-full rounded-xl border border-dashed border-border/60 px-4 py-5 text-center text-xs font-sans text-muted-foreground/50 hover:border-amber/30 hover:text-muted-foreground/80 transition-all duration-150"
        >
          + Add a personal reflection…
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <SectionLabel />
        <span
          className={`text-[10px] font-sans uppercase tracking-[0.14em] transition-opacity duration-300 ${
            saveStatus === "saving"
              ? "text-muted-foreground/50 opacity-100"
              : saveStatus === "saved"
              ? "text-amber/70 opacity-100"
              : "opacity-0"
          }`}
        >
          {saveStatus === "saving" ? "Saving…" : "Saved"}
        </span>
      </div>

      <div className="relative">
        <textarea
          value={content}
          onChange={handleChange}
          placeholder="Write a personal reflection on this chapter…"
          maxLength={2000}
          autoFocus
          rows={4}
          className="w-full rounded-xl border border-input bg-card px-4 py-3.5 text-sm font-sans text-foreground placeholder:text-muted-foreground/40 resize-none outline-none transition-all duration-200 focus:border-amber/50 focus:ring-2 focus:ring-amber/15 leading-relaxed"
        />
        <span className="absolute bottom-3 right-3 text-[10px] font-mono text-muted-foreground/30">
          {content.length}/2000
        </span>
      </div>
    </div>
  );
}

function SectionLabel() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px w-6 bg-amber/40" />
      <p className="text-[10px] font-sans uppercase tracking-[0.22em] text-muted-foreground/60">
        My notes
      </p>
      <div className="h-px flex-1 bg-border/40" />
    </div>
  );
}
