"use client";

import {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  useEffect,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { ChapterContextPayload } from "@/lib/supabase/client";

const PEEK = 12; // px of adjacent card visible on each side
const GAP = 16;  // px gap between cards

const SECTION_META = [
  {
    icon: "⏳",
    iconBg: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300",
    title: "Historical background",
  },
  {
    icon: "◎",
    iconBg: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    title: "People & places",
  },
  {
    icon: "⚖",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    title: "Cultural & religious context",
  },
  {
    icon: "✦",
    iconBg: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
    title: "Themes & takeaway",
  },
];

interface Props {
  payload: ChapterContextPayload;
}

export function ContextCarousel({ payload }: Props) {
  const [index, setIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  // Measure container on mount and resize
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setCardWidth(el.offsetWidth - PEEK * 2);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIndex((i) => Math.min(3, i + 1)), []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  const trackOffset =
    cardWidth > 0 ? -(index * (cardWidth + GAP)) + PEEK : 0;

  return (
    <div className="space-y-4">
      {/* Navigation — sits above the carousel */}
      <div className="flex items-center justify-between">
        {/* Current section name */}
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {SECTION_META[index].title}
        </p>

        <div className="flex items-center gap-3">
          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {SECTION_META.map((s, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={s.title}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  i === index
                    ? "w-5 bg-amber-500"
                    : "w-1.5 bg-border hover:bg-muted-foreground/40",
                )}
              />
            ))}
          </div>

          <button
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous section"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={next}
            disabled={index === 3}
            aria-label="Next section"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Track */}
      <div
        ref={containerRef}
        className="overflow-hidden"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const delta = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(delta) > 50) delta < 0 ? next() : prev();
        }}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            gap: `${GAP}px`,
            transform: `translateX(${trackOffset}px)`,
          }}
        >
          {/* Card 0 — Historical */}
          <SectionCard
            meta={SECTION_META[0]}
            width={cardWidth}
            active={index === 0}
          >
            <dl className="space-y-4 text-sm">
              {(
                [
                  ["Date written",      payload.historical.date_written],
                  ["Historical period", payload.historical.period],
                  ["Author",            payload.historical.author],
                  ["Original audience", payload.historical.audience],
                  ["Purpose",           payload.historical.purpose],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <dt className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="leading-relaxed">{value}</dd>
                </div>
              ))}
            </dl>
          </SectionCard>

          {/* Card 1 — People & Places */}
          <SectionCard
            meta={SECTION_META[1]}
            width={cardWidth}
            active={index === 1}
          >
            {payload.people_places.people.length === 0 &&
            payload.people_places.places.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No specific named people or places in this chapter.
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                <NamedGroup
                  heading="People"
                  items={payload.people_places.people}
                />
                <NamedGroup
                  heading="Places"
                  items={payload.people_places.places}
                />
              </div>
            )}
          </SectionCard>

          {/* Card 2 — Cultural & Religious */}
          <SectionCard
            meta={SECTION_META[2]}
            width={cardWidth}
            active={index === 2}
          >
            <div className="space-y-5">
              <BulletGroup
                heading="Customs of the era"
                items={payload.cultural_religious.customs}
              />
              {payload.cultural_religious.surrounding_cultures.length > 0 && (
                <>
                  <Separator />
                  <BulletGroup
                    heading="Surrounding cultures"
                    items={payload.cultural_religious.surrounding_cultures}
                  />
                </>
              )}
              {payload.cultural_religious.audience_beliefs.length > 0 && (
                <>
                  <Separator />
                  <BulletGroup
                    heading="What the original audience believed"
                    items={payload.cultural_religious.audience_beliefs}
                  />
                </>
              )}
            </div>
          </SectionCard>

          {/* Card 3 — Themes & Takeaway */}
          <SectionCard
            meta={SECTION_META[3]}
            width={cardWidth}
            active={index === 3}
          >
            <div className="space-y-5">
              {payload.themes_takeaway.main_themes.length > 0 && (
                <div className="space-y-2">
                  <SectionLabel>Main themes</SectionLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {payload.themes_takeaway.main_themes.map((theme) => (
                      <Badge
                        key={theme}
                        variant="outline"
                        className="text-xs"
                      >
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {payload.themes_takeaway.cross_references.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <SectionLabel>Cross-references</SectionLabel>
                    <ul className="space-y-2">
                      {payload.themes_takeaway.cross_references.map((ref) => (
                        <li
                          key={ref.reference}
                          className="flex gap-2 text-sm"
                        >
                          <Badge
                            variant="secondary"
                            className="shrink-0 font-mono text-[10px] tracking-wide"
                          >
                            {ref.reference}
                          </Badge>
                          <span className="text-muted-foreground leading-relaxed">
                            {ref.note}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {payload.themes_takeaway.application && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <SectionLabel>Application</SectionLabel>
                    <p className="text-sm leading-relaxed">
                      {payload.themes_takeaway.application}
                    </p>
                  </div>
                </>
              )}
            </div>
          </SectionCard>
        </div>
      </div>

    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────── */

function SectionCard({
  meta,
  width,
  active,
  children,
}: {
  meta: (typeof SECTION_META)[number];
  width: number;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden={!active}
      style={{
        width: width > 0 ? `${width}px` : "calc(100% - 1.5rem)",
        flexShrink: 0,
        flexGrow: 0,
        minWidth: 0,
      }}
    >
      <Card className="w-full gap-0 overflow-hidden transition-shadow duration-200 hover:shadow-md">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm",
                meta.iconBg,
              )}
            >
              {meta.icon}
            </span>
            <CardTitle className="text-base font-semibold">
              {meta.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-5">{children}</CardContent>
      </Card>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

function NamedGroup({
  heading,
  items,
}: {
  heading: string;
  items: { name: string; description: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2">
      <SectionLabel>{heading}</SectionLabel>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.name} className="text-sm leading-relaxed">
            <span className="font-medium">{item.name}</span>
            <span className="text-muted-foreground"> — {item.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BulletGroup({
  heading,
  items,
}: {
  heading: string;
  items: string[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2">
      <SectionLabel>{heading}</SectionLabel>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
