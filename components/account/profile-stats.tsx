"use client";

interface Stat {
  value: number;
  label: string;
  sublabel?: string;
}

interface ProfileStatsProps {
  chaptersExplored: number;
  booksOpened: number;
  saved: number;
  notes: number;
}

export function ProfileStats({
  chaptersExplored,
  booksOpened,
  saved,
  notes,
}: ProfileStatsProps) {
  const stats: Stat[] = [
    { value: chaptersExplored, label: "Chapters",   sublabel: "explored" },
    { value: booksOpened,      label: "Books",      sublabel: "opened" },
    { value: saved,            label: "Saved",      sublabel: "chapters" },
    { value: notes,            label: "Notes",      sublabel: "written" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map(({ value, label, sublabel }) => (
        <div
          key={label}
          className="relative rounded-xl border border-border bg-card px-3 py-4 text-center overflow-hidden group hover:border-amber/30 transition-colors duration-200"
        >
          {/* Subtle amber corner glow on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 120%, oklch(0.745 0.17 72 / 0.08), transparent 70%)" }}
          />

          {/* Number */}
          <p className="font-display text-[2rem] font-light leading-none text-amber tabular-nums">
            {value}
          </p>

          {/* Label */}
          <p className="mt-1.5 text-[9px] font-sans uppercase tracking-[0.18em] text-foreground/70">
            {label}
          </p>
          {sublabel && (
            <p className="text-[9px] font-sans text-muted-foreground/50 tracking-wide">
              {sublabel}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
