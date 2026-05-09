"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/browser";
import type { User } from "@supabase/supabase-js";

interface HistoryLoggerProps {
  book: string;
  chapter: number;
  user: User | null;
}

export function HistoryLogger({ book, chapter, user }: HistoryLoggerProps) {
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase.from("reading_history").insert({ user_id: user.id, book, chapter }).then();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
