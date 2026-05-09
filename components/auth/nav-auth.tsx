"use client";

import { useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/browser";
import { SignInModal } from "./sign-in-modal";

interface NavAuthProps {
  user: User | null;
}

export function NavAuth({ user }: NavAuthProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  if (!user) {
    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          className="text-[11px] font-sans text-muted-foreground hover:text-foreground transition-colors duration-150 uppercase tracking-[0.14em]"
        >
          Sign in
        </button>
        <SignInModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  const initials = (user.email ?? "?")
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="flex items-center justify-center w-7 h-7 rounded-full bg-amber/20 border border-amber/30 hover:bg-amber/30 transition-colors duration-150 font-display text-[11px] font-medium text-amber leading-none"
        aria-label="Account menu"
        aria-expanded={menuOpen}
      >
        {initials}
      </button>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-9 z-50 w-44 rounded-xl border border-border bg-card shadow-xl animate-blur-in overflow-hidden">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-amber/40 to-transparent" />
            <div className="py-1">
              <p className="px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60 font-sans truncate">
                {user.email}
              </p>
              <div className="h-px bg-border/60 mx-3 my-1" />
              <Link
                href="/account"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-xs font-sans text-foreground hover:text-amber hover:bg-muted/60 transition-colors duration-100"
              >
                Profile
              </Link>
              <button
                onClick={signOut}
                className="w-full text-left px-4 py-2 text-xs font-sans text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors duration-100"
              >
                Sign out
              </button>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </>
      )}
    </div>
  );
}
