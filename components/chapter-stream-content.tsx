"use client";

import { useState, useEffect } from "react";
import { BibleTimeline } from "@/components/bible-timeline";
import { ContextCarousel } from "@/components/context-carousel";
import type { ChapterContextPayload } from "@/lib/supabase/client";

interface Props {
  bookSlug: string;
  bookName: string;
  chapter: number;
  initialPayload: ChapterContextPayload | null;
}

function isComplete(p: Partial<ChapterContextPayload> | null): p is ChapterContextPayload {
  if (!p) return false;
  return !!(
    p.synopsis &&
    p.timeline_year != null &&
    p.historical?.purpose &&
    p.people_places &&
    p.cultural_religious?.customs !== undefined &&
    p.themes_takeaway?.application &&
    p.scholarly_basis?.length
  );
}

export function ChapterStreamContent({ bookSlug, bookName, chapter, initialPayload }: Props) {
  const [payload, setPayload] = useState<Partial<ChapterContextPayload> | null>(initialPayload);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPayload) return;

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch("/api/generate-stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookSlug, chapter }),
          signal: controller.signal,
        });

        if (res.status === 429) {
          setError("Daily generation limit reached. Try again tomorrow.");
          return;
        }
        if (!res.ok) throw new Error(`${res.status}`);

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buf = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop()!;
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const partial = JSON.parse(line) as Partial<ChapterContextPayload>;
              setPayload(partial);
            } catch {}
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Failed to generate context. Please refresh the page.");
        }
      }
    })();

    return () => controller.abort();
  }, [bookSlug, chapter, initialPayload]);

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card px-6 py-8 text-center space-y-2">
        <p className="text-sm font-sans text-muted-foreground">{error}</p>
      </div>
    );
  }

  const done = isComplete(payload);

  return (
    <div className="space-y-6">
      {/* Synopsis */}
      {payload?.synopsis ? (
        <p className="font-display text-[1.2rem] font-normal italic leading-relaxed text-muted-foreground max-w-prose border-l-2 border-amber/30 pl-4 animate-fade-in">
          {payload.synopsis}
        </p>
      ) : (
        <div className="space-y-2 border-l-2 border-amber/20 pl-4">
          <div className="h-4 w-full rounded-md bg-muted animate-pulse" />
          <div className="h-4 w-5/6 rounded-md bg-muted animate-pulse" />
          <div className="h-4 w-4/6 rounded-md bg-muted animate-pulse" />
        </div>
      )}

      {/* Timeline */}
      {payload?.timeline_year != null ? (
        <BibleTimeline
          timelineYear={payload.timeline_year}
          chapterLabel={`${bookName} ${chapter}`}
        />
      ) : (
        <div className="h-14 w-full rounded-xl bg-muted animate-pulse" />
      )}

      {/* Carousel */}
      {done ? (
        <ContextCarousel payload={payload as ChapterContextPayload} />
      ) : (
        <CarouselSkeleton />
      )}
    </div>
  );
}

function CarouselSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-0.5">
        <div className="h-4 w-36 rounded-md bg-muted animate-pulse" />
        <div className="flex gap-2">
          <div className="h-7 w-7 rounded-full bg-muted animate-pulse" />
          <div className="h-7 w-7 rounded-full bg-muted animate-pulse" />
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border/60 px-5 pt-5 pb-4">
          <div className="h-16 w-12 rounded-md bg-muted animate-pulse mb-2" />
          <div className="h-3 w-32 rounded-md bg-muted animate-pulse" />
        </div>
        <div className="px-5 py-5 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-2.5 w-20 rounded-md bg-muted animate-pulse" />
              <div className="h-4 w-full rounded-md bg-muted animate-pulse" />
              <div className="h-4 w-4/5 rounded-md bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
