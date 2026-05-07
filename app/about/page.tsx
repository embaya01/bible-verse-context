export default function AboutPage() {
  return (
    <article className="space-y-10 animate-slide-up max-w-2xl">

      {/* Header */}
      <header className="space-y-3">
        <p className="text-[10px] font-sans uppercase tracking-[0.22em] text-amber/80">
          About
        </p>
        <h1 className="font-display font-light text-[clamp(2.4rem,7vw,3.8rem)] leading-[1.05] tracking-tight">
          Unveiled
        </h1>
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-amber/40" />
          <p className="font-display text-base italic text-muted-foreground">
            The story behind every chapter.
          </p>
        </div>
      </header>

      {/* Body */}
      <div className="space-y-8 text-sm leading-relaxed text-foreground/85">

        <Section title="What it does">
          <p>
            Unveiled generates plain-English background information for any chapter of
            the Bible — historical setting, key people and places, cultural and religious
            context of the original audience, main themes, and a brief modern application.
          </p>
        </Section>

        <Section title="How it works">
          <p>
            When you request a chapter, the app calls Anthropic&apos;s Claude API to produce
            a structured context document, then caches the result so the next request for
            the same chapter returns instantly. The timeline locates each chapter in
            Biblical history.
          </p>
        </Section>

        <Section title="Theological framing">
          <p>
            The content is written from a traditional evangelical Protestant
            perspective — traditional authorship (e.g., Moses for the Pentateuch,
            Paul for the Pastoral Epistles), conservative dating, and a
            faith-affirming tone. If you come from a different tradition, treat the
            content as one perspective rather than the only one.
          </p>
        </Section>

        <Section title="Caveats">
          <ul className="space-y-2 list-none pl-0">
            {[
              "The context is AI-generated. Treat it as a starting point for further study, not authoritative commentary.",
              "Bible text display (KJV / WEB toggle) and an interactive map of named locations are coming in V2.",
              "Found something wrong? The cached output can be regenerated server-side when prompts improve — feedback is welcome.",
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-[0.35rem] h-1 w-1 shrink-0 rounded-full bg-amber/60" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

      </div>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-amber/80 shrink-0">
          {title}
        </h2>
        <div className="h-px flex-1 bg-border/60" />
      </div>
      <div className="text-sm leading-relaxed text-foreground/85">{children}</div>
    </div>
  );
}
