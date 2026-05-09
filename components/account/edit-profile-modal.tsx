"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/lib/supabase/browser";

export type ProfileData = {
  display_name: string;
  bio: string;
  denomination: string;
  location: string;
};

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  initial: ProfileData;
  onSave: (data: ProfileData) => void;
}

const DENOMINATIONS = [
  { value: "evangelical",  label: "Evangelical Protestant" },
  { value: "reformed",     label: "Reformed / Calvinist" },
  { value: "catholic",     label: "Catholic" },
  { value: "orthodox",     label: "Eastern Orthodox" },
  { value: "mainline",     label: "Mainline Protestant" },
  { value: "nondenominal", label: "Non-denominational" },
  { value: "other",        label: "Other / Prefer not to say" },
];

export function EditProfileModal({
  open,
  onClose,
  userId,
  initial,
  onSave,
}: EditProfileModalProps) {
  const [form, setForm] = useState<ProfileData>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const supabase = createClient();

  useEffect(() => {
    if (open) {
      setForm(initial);
      setStatus("idle");
    }
  }, [open, initial]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  function set(field: keyof ProfileData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    await supabase.from("profiles").upsert({
      id: userId,
      ...form,
      updated_at: new Date().toISOString(),
    });
    setStatus("saved");
    onSave(form);
    setTimeout(onClose, 600);
  }

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={(e) => { if (e.currentTarget === e.target) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Edit profile"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md animate-fade-in" />

      <div className="relative w-full max-w-sm animate-blur-in">
        <div className="absolute inset-0 rounded-2xl opacity-10 blur-2xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 40%, oklch(0.745 0.17 72), transparent 70%)" }}
        />

        <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-amber/60 to-transparent" />

          <form onSubmit={handleSave} className="px-7 py-8 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-xl font-light tracking-wide text-foreground">
                  Edit profile
                </h2>
                <p className="text-[11px] text-muted-foreground font-sans mt-0.5">
                  Visible only to you.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-muted-foreground/50 hover:text-foreground transition-colors text-lg leading-none mt-0.5"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Display name */}
            <Field label="Display name">
              <input
                type="text"
                value={form.display_name}
                onChange={(e) => set("display_name", e.target.value.slice(0, 60))}
                placeholder="How you'd like to be called"
                className={inputCls}
              />
            </Field>

            {/* Bio */}
            <Field label="Bio" hint={`${form.bio.length}/140`}>
              <textarea
                value={form.bio}
                onChange={(e) => set("bio", e.target.value.slice(0, 140))}
                placeholder="A short line about your faith journey…"
                rows={2}
                className={`${inputCls} resize-none`}
              />
            </Field>

            {/* Denomination */}
            <Field label="Tradition / denomination">
              <select
                value={form.denomination}
                onChange={(e) => set("denomination", e.target.value)}
                className={`${inputCls} pr-8`}
              >
                {DENOMINATIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </Field>

            {/* Location */}
            <Field label="Location">
              <input
                type="text"
                value={form.location}
                onChange={(e) => set("location", e.target.value.slice(0, 60))}
                placeholder="City, country (optional)"
                className={inputCls}
              />
            </Field>

            {/* Save */}
            <button
              type="submit"
              disabled={status === "saving"}
              className="w-full rounded-lg bg-amber text-amber-foreground font-sans text-sm font-medium py-3 transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save changes"}
            </button>
          </form>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-amber/30 to-transparent" />
        </div>
      </div>
    </div>,
    document.body,
  );
}

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm font-sans text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-amber/60 focus:ring-2 focus:ring-amber/15";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-sans uppercase tracking-[0.16em] text-muted-foreground/80">
          {label}
        </label>
        {hint && (
          <span className="text-[10px] font-mono text-muted-foreground/40">{hint}</span>
        )}
      </div>
      {children}
    </div>
  );
}
