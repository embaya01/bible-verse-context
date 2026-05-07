import { Skeleton } from "@/components/ui/skeleton";

export default function ChapterLoading() {
  return (
    <div className="space-y-10 animate-fade-in">

      {/* Back link skeleton */}
      <Skeleton className="h-3 w-24 rounded" />

      {/* Chapter header */}
      <div className="space-y-6">

        {/* Testament label + book name + ornament */}
        <div className="space-y-2">
          <Skeleton className="h-2.5 w-28 rounded" />
          <Skeleton className="h-16 w-72 rounded" />
          <div className="flex items-center gap-3 pt-1">
            <Skeleton className="h-px w-10" />
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-px w-10" />
          </div>
        </div>

        {/* Synopsis pull-quote */}
        <div className="border-l-2 border-border/40 pl-4 space-y-2">
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-5 w-[92%] rounded" />
          <Skeleton className="h-5 w-[78%] rounded" />
        </div>

        {/* Timeline placeholder */}
        <Skeleton className="h-[7.5rem] w-full rounded-xl" />
      </div>

      {/* Carousel nav + card */}
      <div className="space-y-4">
        {/* Nav row */}
        <div className="flex items-center justify-between px-0.5">
          <Skeleton className="h-4 w-44 rounded" />
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-1.5 rounded-full"
                  style={{ width: i === 0 ? "20px" : "6px" }}
                />
              ))}
            </div>
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-7 w-7 rounded-full" />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border bg-card ring-1 ring-foreground/5 overflow-hidden">
          {/* Card header */}
          <div className="border-b border-border/60 px-5 pt-5 pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-12 w-10 rounded" />
                <Skeleton className="h-2.5 w-40 rounded" />
              </div>
              <Skeleton className="h-7 w-7 rounded-md" />
            </div>
          </div>

          {/* Card content rows */}
          <div className="px-5 py-5 space-y-5">
            {[
              [28, 88],
              [28, 65],
              [28, 45],
              [28, 78],
              [28, 92],
            ].map(([lw, vw], i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-2 rounded" style={{ width: `${lw}%` }} />
                <Skeleton className="h-4 rounded" style={{ width: `${vw}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
