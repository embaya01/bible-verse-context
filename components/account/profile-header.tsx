"use client";

import { useState } from "react";
import { EditProfileModal, type ProfileData } from "./edit-profile-modal";
import { ProfileStats } from "./profile-stats";

interface ProfileHeaderProps {
  userId: string;
  email: string;
  profile: ProfileData;
  chaptersExplored: number;
  booksOpened: number;
  saved: number;
  notes: number;
}

export function ProfileHeader({
  userId,
  email,
  profile: initialProfile,
  chaptersExplored,
  booksOpened,
  saved,
  notes,
}: ProfileHeaderProps) {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [editOpen, setEditOpen] = useState(false);

  const displayName =
    profile.display_name.trim() ||
    email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const denominationLabel: Record<string, string> = {
    evangelical:  "Evangelical Protestant",
    reformed:     "Reformed / Calvinist",
    catholic:     "Catholic",
    orthodox:     "Eastern Orthodox",
    mainline:     "Mainline Protestant",
    nondenominal: "Non-denominational",
    other:        "Other",
  };

  return (
    <>
      {/* Name + action buttons */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 min-w-0">
          <p className="text-[10px] font-sans uppercase tracking-[0.22em] text-amber/80">
            Your profile
          </p>
          <h1 className="font-display font-light uppercase tracking-tight leading-[0.92] text-[clamp(2.2rem,7vw,4.2rem)] text-foreground truncate">
            {displayName}
          </h1>
          {profile.bio && (
            <p className="font-display text-sm italic text-muted-foreground leading-relaxed">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-6 shrink-0">
          <button
            onClick={() => setEditOpen(true)}
            title="Edit profile"
            aria-label="Edit profile"
            className="flex items-center justify-center w-8 h-8 rounded-full border border-border text-muted-foreground/60 hover:border-amber/40 hover:text-amber transition-colors duration-150 text-sm"
          >
            ✎
          </button>
        </div>
      </div>

      {/* Email + meta ornament */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
        <div className="h-px w-8 bg-amber/50 shrink-0" />
        <span className="font-sans text-[11px] text-muted-foreground/70">
          {email}
        </span>
        {profile.denomination && profile.denomination !== "evangelical" && (
          <>
            <span className="text-muted-foreground/30 text-xs">·</span>
            <span className="font-sans text-[11px] text-muted-foreground/50">
              {denominationLabel[profile.denomination] ?? profile.denomination}
            </span>
          </>
        )}
        {profile.location && (
          <>
            <span className="text-muted-foreground/30 text-xs">·</span>
            <span className="font-sans text-[11px] text-muted-foreground/50">
              {profile.location}
            </span>
          </>
        )}
        <div className="h-px flex-1 bg-amber/20" />
      </div>

      {/* Stats dashboard */}
      <ProfileStats
        chaptersExplored={chaptersExplored}
        booksOpened={booksOpened}
        saved={saved}
        notes={notes}
      />

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        userId={userId}
        initial={profile}
        onSave={setProfile}
      />
    </>
  );
}
