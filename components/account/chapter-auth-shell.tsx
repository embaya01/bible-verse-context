"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { SignInModal } from "@/components/auth/sign-in-modal";
import { BookmarkButton } from "./bookmark-button";
import { ChapterNotes } from "./chapter-notes";
import { HistoryLogger } from "./history-logger";

interface ChapterAuthShellProps {
  book: string;
  chapter: number;
  user: User | null;
  initialSaved: boolean;
  initialNote: string;
  bookmarkOnly?: boolean;
  notesOnly?: boolean;
}

export function ChapterAuthShell({
  book,
  chapter,
  user,
  initialSaved,
  initialNote,
  bookmarkOnly,
  notesOnly,
}: ChapterAuthShellProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Bookmark — absolute top-right anchor inside header */}
      {bookmarkOnly && (
        <div className="absolute top-0 right-0">
          <BookmarkButton
            book={book}
            chapter={chapter}
            user={user}
            initialSaved={initialSaved}
            onSignInRequest={() => setModalOpen(true)}
          />
        </div>
      )}

      {/* Notes section + silent history log */}
      {notesOnly && (
        <>
          <HistoryLogger book={book} chapter={chapter} user={user} />
          <ChapterNotes
            book={book}
            chapter={chapter}
            user={user}
            initialContent={initialNote}
            onSignInRequest={() => setModalOpen(true)}
          />
        </>
      )}

      <SignInModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
