import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { ChapterContextPayload } from "@/lib/supabase/client";

type Props = { payload: ChapterContextPayload };

const CARDS = [
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

export function ContextSections({ payload }: Props) {
  return (
    <div className="space-y-4">
      {/* Historical */}
      <AnimatedCard index={0} {...CARDS[0]}>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
          {(
            [
              ["Date written", payload.historical.date_written],
              ["Historical period", payload.historical.period],
              ["Author", payload.historical.author],
              ["Original audience", payload.historical.audience],
              ["Purpose", payload.historical.purpose],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="font-medium text-muted-foreground whitespace-nowrap pt-0.5">
                {label}
              </dt>
              <dd className="leading-relaxed">{value}</dd>
            </div>
          ))}
        </dl>
      </AnimatedCard>

      {/* People & Places */}
      <AnimatedCard index={1} {...CARDS[1]}>
        {payload.people_places.people.length === 0 &&
        payload.people_places.places.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No specific named people or places in this chapter.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            <NamedGroup heading="People" items={payload.people_places.people} />
            <NamedGroup heading="Places" items={payload.people_places.places} />
          </div>
        )}
      </AnimatedCard>

      {/* Cultural & Religious */}
      <AnimatedCard index={2} {...CARDS[2]}>
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
      </AnimatedCard>

      {/* Themes & Takeaway */}
      <AnimatedCard index={3} {...CARDS[3]}>
        <div className="space-y-5">
          {payload.themes_takeaway.main_themes.length > 0 && (
            <div className="space-y-2">
              <SectionLabel>Main themes</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                {payload.themes_takeaway.main_themes.map((theme) => (
                  <Badge key={theme} variant="outline" className="text-xs">
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
                    <li key={ref.reference} className="flex gap-2 text-sm">
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
      </AnimatedCard>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────── */

function AnimatedCard({
  index,
  icon,
  iconBg,
  title,
  children,
}: {
  index: number;
  icon: string;
  iconBg: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="animate-slide-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
    >
      <Card className="gap-0 overflow-hidden transition-shadow duration-200 hover:shadow-md">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm",
                iconBg,
              )}
            >
              {icon}
            </span>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
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

function BulletGroup({ heading, items }: { heading: string; items: string[] }) {
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
