"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { User } from "@supabase/supabase-js";

interface BookmarkButtonProps {
  book: string;
  chapter: number;
  user: User | null;
  initialSaved: boolean;
  onSignInRequest: () => void;
}

export function BookmarkButton({
  book,
  chapter,
  user,
  initialSaved,
  onSignInRequest,
}: BookmarkButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);
  const supabase = createClient();

  const toggle = useCallback(async () => {
    if (!user) {
      onSignInRequest();
      return;
    }
    if (pending) return;
    setPending(true);

    if (saved) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("book", book)
        .eq("chapter", chapter);
      setSaved(false);
    } else {
      await supabase
        .from("favorites")
        .upsert({ user_id: user.id, book, chapter });
      setSaved(true);
    }
    setPending(false);
  }, [user, book, chapter, saved, pending, supabase, onSignInRequest]);

  return (
    <button
      onClick={toggle}
      disabled={pending}
      aria-label={saved ? "Remove bookmark" : "Bookmark this chapter"}
      title={saved ? "Remove bookmark" : "Bookmark this chapter"}
      className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-200 ${
        saved
          ? "border-amber/60 bg-amber/10 text-amber hover:bg-amber/20"
          : "border-border text-muted-foreground/50 hover:border-amber/40 hover:text-amber/70 hover:bg-amber/5"
      } ${pending ? "opacity-50" : ""}`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
