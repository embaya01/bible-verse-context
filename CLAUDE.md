@AGENTS.md

## Commands

```bash
npm run dev    # dev server at http://localhost:3000
npm run build  # production build
npm run lint   # eslint
```

## Environment

Copy `.env.local.example` → `.env.local` and fill in:
- `ANTHROPIC_API_KEY` — from console.anthropic.com
- `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` — from Supabase project settings
- `RATE_LIMIT_PER_HOUR` / `DAILY_GENERATION_CEILING` — optional, defaults 30/200

## Architecture

Two generation paths — both cache in Supabase `chapter_context` table:
1. `app/api/generate/route.ts` — client-side fetch (enforces per-IP rate limit + daily ceiling)
2. `app/[book]/[chapter]/page.tsx` — SSR (enforces daily ceiling only)

Key directories:
- `lib/claude/` — Anthropic SDK wrapper + system prompt
- `lib/cache/` — Supabase read/write for cached context
- `lib/bible/` — book list, chapter counts, timeline data
- `components/` — UI; `ContextCarousel` is used on the chapter page; `context-sections.tsx` is unused

## Database

Run `lib/db/schema.sql` once in the Supabase SQL editor to create the cache table.

## Gotchas

- **Bump `PROMPT_VERSION`** in `lib/claude/system-prompt.ts` whenever the system prompt changes — old cached rows use the old version and won't be regenerated otherwise.
- **Rate limiter is in-memory**: resets on cold start; on Vercel with multiple instances it's a soft cap per instance, not a hard global limit.
