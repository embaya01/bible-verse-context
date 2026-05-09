"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/lib/supabase/browser";

interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

export function SignInModal({ open, onClose }: SignInModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (open) {
      setStatus("idle");
      setEmail("");
      setErrorMsg("");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Sign in to Unveiled"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md animate-fade-in" />

      {/* Card */}
      <div className="relative w-full max-w-sm animate-blur-in">
        {/* Subtle amber glow behind card */}
        <div
          className="absolute inset-0 rounded-2xl opacity-20 dark:opacity-10 blur-2xl"
          style={{ background: "radial-gradient(ellipse at 50% 40%, oklch(0.745 0.17 72), transparent 70%)" }}
        />

        <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
          {/* Top ornament strip */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-amber/60 to-transparent" />

          <div className="px-8 py-9 space-y-7">
            {/* Header */}
            <div className="text-center space-y-2">
              <span className="font-display text-amber text-2xl leading-none block">✦</span>
              <h2 className="font-display text-[1.6rem] font-light tracking-wide text-foreground leading-tight">
                Continue your<br />reading journey
              </h2>
              <p className="text-xs text-muted-foreground font-sans tracking-wide">
                Save chapters, write notes, and build your history.
              </p>
            </div>

            {status === "sent" ? (
              <div className="text-center space-y-3 py-4 animate-fade-in">
                <div className="text-amber text-3xl">✉︎</div>
                <p className="font-display text-lg italic text-foreground/90">
                  Check your inbox
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We sent a magic link to <strong className="text-foreground/80">{email}</strong>.
                  <br />Click it to sign in — no password needed.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-colors mt-2"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <>
                {/* Magic link form */}
                <form onSubmit={handleMagicLink} className="space-y-3">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm font-sans text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-200 focus:border-amber/60 focus:ring-2 focus:ring-amber/20"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-xs text-destructive font-sans animate-fade-in">
                      {errorMsg || "Something went wrong. Please try again."}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full rounded-lg bg-amber text-amber-foreground font-sans text-sm font-medium py-3 px-4 transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? "Sending…" : "Send magic link →"}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60 font-sans">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Google OAuth */}
                <button
                  onClick={handleGoogle}
                  className="w-full flex items-center justify-center gap-3 rounded-lg border border-border bg-background hover:bg-muted py-3 px-4 text-sm font-sans text-foreground transition-all duration-200 hover:border-amber/30 active:scale-[0.98]"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
              </>
            )}

            {/* Scripture footer */}
            <div className="text-center pt-1">
              <p className="font-display text-xs italic text-muted-foreground/60 leading-relaxed">
                "Your word is a lamp to my feet and a light to my path."
              </p>
              <p className="text-[10px] font-sans tracking-[0.12em] text-muted-foreground/40 mt-0.5">
                Psalm 119:105
              </p>
            </div>
          </div>

          {/* Bottom ornament strip */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-amber/40 to-transparent" />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
