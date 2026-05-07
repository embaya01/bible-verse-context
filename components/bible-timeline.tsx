"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { EVENTS, yearToLabel, TIMELINE_START, TIMELINE_END } from "@/lib/bible/timeline";
import type { TimelineEvent } from "@/lib/bible/timeline";
import { cn } from "@/lib/utils";

const MIN_RANGE = 40;
const MAX_RANGE = TIMELINE_END - TIMELINE_START; // 4200
const INITIAL_RANGE = 300;

// Which events to render at each zoom level (tiered for readability)
const PRIORITY_1 = new Set([
  "Creation", "The Flood", "Abraham's Call", "The Exodus",
  "David captures Jerusalem", "Jerusalem falls to Babylon",
  "Cyrus's decree — return from exile", "Birth of Jesus",
  "Crucifixion & Resurrection", "Revelation written",
]);

const PRIORITY_2 = new Set([
  "Tower of Babel", "Moses born", "Saul anointed king",
  "Temple built in Jerusalem", "Kingdom divides",
  "Isaiah's ministry begins", "Fall of Northern Kingdom",
  "Ezekiel's visions begin", "Temple rebuilt & dedicated",
  "Esther saves the Jews", "Malachi — last OT prophet",
  "Maccabean revolt", "Herod the Great rules",
  "Baptism of Jesus", "Pentecost & the Church born",
  "Paul's conversion", "Paul's first missionary journey",
  "Jerusalem destroyed",
]);

function getEvents(range: number): TimelineEvent[] {
  if (range > 1500) return EVENTS.filter((e) => PRIORITY_1.has(e.label));
  if (range > 500)  return EVENTS.filter((e) => PRIORITY_1.has(e.label) || PRIORITY_2.has(e.label));
  return EVENTS;
}

// Subtle alternating era bands for spatial orientation
const ERA_BANDS = [
  { name: "Primeval",         start: -4100, end: -2000 },
  { name: "Patriarchs",       start: -2000, end: -1500 },
  { name: "Egypt & Exodus",   start: -1500, end: -1375 },
  { name: "Judges",           start: -1375, end: -1050 },
  { name: "Kingdom",          start: -1050, end:  -586 },
  { name: "Exile & Return",   start:  -586, end:  -332 },
  { name: "Intertestamental", start:  -332, end:    -5 },
  { name: "Life of Jesus",    start:    -5, end:    30 },
  { name: "Early Church",     start:    30, end:   100 },
] as const;

type View = { start: number; end: number };

interface Props {
  timelineYear: number;
  chapterLabel: string;
}

export function BibleTimeline({ timelineYear, chapterLabel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [view, setView] = useState<View>(() => ({
    start: Math.max(TIMELINE_START, timelineYear - INITIAL_RANGE / 2),
    end:   Math.min(TIMELINE_END,   timelineYear + INITIAL_RANGE / 2),
  }));
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const range = view.end - view.start;
  const toPercent = (year: number) => ((year - view.start) / range) * 100;

  // ── Zoom ────────────────────────────────────────────────────────
  const zoom = useCallback((factor: number, focalX?: number) => {
    const width = containerRef.current?.offsetWidth ?? 800;
    setView((prev) => {
      const r = prev.end - prev.start;
      const frac = focalX != null ? Math.max(0, Math.min(1, focalX / width)) : 0.5;
      const focalYear = prev.start + frac * r;
      const newRange = Math.max(MIN_RANGE, Math.min(MAX_RANGE, r * factor));
      let s = focalYear - frac * newRange;
      let e = s + newRange;
      if (s < TIMELINE_START) { s = TIMELINE_START; e = s + newRange; }
      if (e > TIMELINE_END)   { e = TIMELINE_END;   s = e - newRange; }
      return { start: s, end: e };
    });
  }, []);

  const reset = useCallback(() => {
    setView({
      start: Math.max(TIMELINE_START, timelineYear - INITIAL_RANGE / 2),
      end:   Math.min(TIMELINE_END,   timelineYear + INITIAL_RANGE / 2),
    });
  }, [timelineYear]);

  // ── Wheel zoom (must be non-passive to call preventDefault) ─────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoom(e.deltaY > 0 ? 1.25 : 0.8, e.clientX - rect.left);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoom]);

  // ── Prevent page scroll during pinch-zoom ───────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const prevent = (e: TouchEvent) => {
      if (e.touches.length >= 2) e.preventDefault();
    };
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => el.removeEventListener("touchmove", prevent);
  }, []);

  // ── Mouse pan ────────────────────────────────────────────────────
  const dragRef = useRef<{ startX: number; startView: View } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragRef.current = { startX: e.clientX, startView: view };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current || !containerRef.current) return;
    const { startX, startView } = dragRef.current;
    const w = containerRef.current.offsetWidth;
    const r = startView.end - startView.start;
    const delta = -(e.clientX - startX) / w * r;
    let s = startView.start + delta;
    let en = startView.end + delta;
    if (s < TIMELINE_START) { s = TIMELINE_START; en = s + r; }
    if (en > TIMELINE_END)  { en = TIMELINE_END;  s  = en - r; }
    setView({ start: s, end: en });
  };

  const stopDrag = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  // ── Touch pan / pinch ────────────────────────────────────────────
  const touchRef = useRef<{
    mode: "pan" | "pinch";
    startX: number;
    startView: View;
    lastDist: number;
  } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchRef.current = {
        mode: "pan", startX: e.touches[0].clientX,
        startView: view, lastDist: 0,
      };
    } else if (e.touches.length === 2) {
      const dist = Math.abs(e.touches[1].clientX - e.touches[0].clientX);
      touchRef.current = {
        mode: "pinch", startX: 0,
        startView: view, lastDist: dist,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchRef.current || !containerRef.current) return;
    const w = containerRef.current.offsetWidth;
    const rect = containerRef.current.getBoundingClientRect();

    if (touchRef.current.mode === "pan" && e.touches.length === 1) {
      const { startX, startView } = touchRef.current;
      const r = startView.end - startView.start;
      const delta = -(e.touches[0].clientX - startX) / w * r;
      let s = startView.start + delta;
      let en = startView.end + delta;
      if (s < TIMELINE_START) { s = TIMELINE_START; en = s + r; }
      if (en > TIMELINE_END)  { en = TIMELINE_END;  s  = en - r; }
      setView({ start: s, end: en });
    } else if (touchRef.current.mode === "pinch" && e.touches.length === 2) {
      const newDist = Math.abs(e.touches[1].clientX - e.touches[0].clientX);
      if (touchRef.current.lastDist > 0 && newDist > 0) {
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
        zoom(touchRef.current.lastDist / newDist, midX);
      }
      touchRef.current.lastDist = newDist;
    }
  };

  const handleTouchEnd = () => { touchRef.current = null; };

  // ── Render ───────────────────────────────────────────────────────
  const events = getEvents(range);
  const showEraNames = range > 600;
  const chapterPct = toPercent(timelineYear);

  return (
    <div className="rounded-xl border border-border bg-card p-3 space-y-2">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
          {yearToLabel(Math.round(view.start))} – {yearToLabel(Math.round(view.end))}
        </span>
        <div className="flex gap-1">
          <ToolBtn onClick={() => zoom(0.7)}  title="Zoom in">  <ZoomIn    className="h-3 w-3" /></ToolBtn>
          <ToolBtn onClick={() => zoom(1.43)} title="Zoom out"> <ZoomOut   className="h-3 w-3" /></ToolBtn>
          <ToolBtn onClick={reset}            title="Reset">    <RotateCcw className="h-3 w-3" /></ToolBtn>
        </div>
      </div>

      {/* Timeline — no overflow-hidden so tooltips can escape upward */}
      <div
        ref={containerRef}
        className={cn(
          "relative h-28 select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Era background bands */}
        {ERA_BANDS.map((era, i) => {
          const lPct = toPercent(era.start);
          const rPct = toPercent(era.end);
          if (rPct < 0 || lPct > 100) return null;
          const left  = Math.max(0, lPct);
          const width = Math.min(100, rPct) - left;
          if (width <= 0) return null;
          return (
            <div
              key={era.name}
              className="absolute inset-y-0"
              style={{ left: `${left}%`, width: `${width}%` }}
            >
              {i % 2 === 0 && (
                <div className="absolute inset-0 rounded bg-muted/40" />
              )}
              {showEraNames && width > 8 && (
                <span className="pointer-events-none absolute top-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-widest text-muted-foreground/40">
                  {era.name}
                </span>
              )}
            </div>
          );
        })}

        {/* Baseline */}
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border" />

        {/* Event dots */}
        {events.map((ev) => {
          const pct = toPercent(ev.year);
          if (pct < -0.5 || pct > 100.5) return null;
          const active    = activeEvent === ev.label;
          const nearRight = pct > 82;
          const nearLeft  = pct < 18;

          return (
            <div
              key={ev.label}
              className="absolute"
              style={{ left: `${pct}%`, top: "50%", transform: "translate(-50%, -50%)" }}
            >
              <button
                className="group relative focus:outline-none"
                onMouseEnter={() => !isDragging && setActiveEvent(ev.label)}
                onMouseLeave={() => setActiveEvent(null)}
                onFocus={() => setActiveEvent(ev.label)}
                onBlur={() => setActiveEvent(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveEvent(active ? null : ev.label);
                }}
                aria-label={`${ev.label}, ${yearToLabel(ev.year)}`}
              >
                <span className="block h-2 w-2 rounded-full bg-muted-foreground/30 transition-colors group-hover:bg-muted-foreground/70" />

                {/* Hover/tap tooltip — same at every zoom level */}
                {active && (
                  <div
                    className={cn(
                      "pointer-events-none absolute bottom-5 z-30 w-max max-w-[200px] rounded-lg border border-border bg-popover px-2.5 py-1.5 shadow-md",
                      nearRight ? "right-0"
                        : nearLeft ? "left-0"
                        : "left-1/2 -translate-x-1/2",
                    )}
                  >
                    <p className="text-xs font-medium text-foreground leading-tight">{ev.label}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{yearToLabel(ev.year)}</p>
                    {ev.book && (
                      <p className="mt-0.5 text-[10px] text-amber-600 dark:text-amber-400">{ev.book}</p>
                    )}
                  </div>
                )}
              </button>
            </div>
          );
        })}

        {/* Chapter dot — amber, always visible when in range */}
        {chapterPct >= -0.5 && chapterPct <= 100.5 && (
          <div
            className="pointer-events-none absolute z-10"
            style={{ left: `${chapterPct}%`, top: "50%", transform: "translate(-50%, -50%)" }}
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-40" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500 ring-2 ring-amber-500/30" />
            </span>
            <span
              className={cn(
                "absolute bottom-5 whitespace-nowrap text-[11px] font-medium text-amber-600 dark:text-amber-400",
                chapterPct > 85 ? "right-0" : chapterPct < 15 ? "left-0" : "left-1/2 -translate-x-1/2",
              )}
            >
              {chapterLabel} · {yearToLabel(timelineYear)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ToolBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
    >
      {children}
    </button>
  );
}
