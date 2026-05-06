export default function AboutPage() {
  return (
    <article className="prose prose-zinc max-w-none dark:prose-invert">
      <h1>About</h1>
      <p>
        Unveiled generates plain-English background information for
        any chapter of the Bible — historical setting, key people and places,
        cultural and religious context of the original audience, main themes,
        and a brief modern application.
      </p>

      <h2>How it works</h2>
      <p>
        When you request a chapter, the app calls Anthropic&apos;s Claude API
        to produce a structured context document, then caches the result so the
        next request for the same chapter returns instantly.
      </p>

      <h2>Theological framing</h2>
      <p>
        The content is written from a traditional evangelical Protestant
        perspective — traditional authorship (e.g., Moses for the Pentateuch,
        Paul for the Pastoral Epistles), conservative dating, and a
        faith-affirming tone. If you come from a different tradition, treat the
        content as one perspective rather than the only one.
      </p>

      <h2>Caveats</h2>
      <ul>
        <li>
          The context is AI-generated. Treat it as a starting point for further
          study, not authoritative commentary.
        </li>
        <li>
          Bible text display (KJV / WEB toggle) and an interactive map of named
          locations are coming next.
        </li>
        <li>
          Found something wrong? The cached output can be regenerated server-side
          when prompts improve — feedback is welcome.
        </li>
      </ul>
    </article>
  );
}
