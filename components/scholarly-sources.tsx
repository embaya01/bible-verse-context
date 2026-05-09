interface ScholarlySourcesProps {
  sources: string[];
}

export function ScholarlySource({ sources }: ScholarlySourcesProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-6 space-y-3">
      {/* Thin amber divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-amber/25 to-transparent" />

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 px-0.5">
        <span className="font-display text-[11px] italic text-amber/60 shrink-0 tracking-wide">
          Scholarly basis
        </span>
        <div className="flex flex-wrap gap-1.5">
          {sources.map((source) => (
            <span
              key={source}
              className="inline-block rounded-full border border-amber/20 px-2.5 py-0.5 font-sans text-[10px] tracking-wide text-muted-foreground/70"
            >
              {source}
            </span>
          ))}
        </div>
      </div>

      <p className="px-0.5 font-sans text-[10px] leading-relaxed text-muted-foreground/40">
        AI-synthesized from these commentary traditions. Not a direct quotation or citation.
      </p>
    </div>
  );
}
