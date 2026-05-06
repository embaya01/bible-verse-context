import { Skeleton } from "@/components/ui/skeleton";

export default function ChapterLoading() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-64" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>

      {/* 4 card skeletons */}
      {[
        { rows: [60, 40, 40, 40, 40] },
        { rows: [40, 30, 40, 30] },
        { rows: [30, 30, 30, 40, 40, 30] },
        { rows: [30, 30, 40, 30, 80] },
      ].map((card, i) => (
        <div
          key={i}
          className="space-y-4 rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {/* Card header */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-7 rounded-lg" />
            <Skeleton className="h-5 w-36" />
          </div>
          {/* Content rows */}
          <div className="space-y-2.5">
            {card.rows.map((w, j) => (
              <Skeleton key={j} className="h-3.5 rounded" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
