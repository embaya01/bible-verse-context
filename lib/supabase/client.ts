import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local",
    );
  }
  cached = createClient(url, serviceKey, { auth: { persistSession: false } });
  return cached;
}

export type ChapterContextRow = {
  id: string;
  book: string;
  chapter: number;
  payload: ChapterContextPayload;
  model: string;
  prompt_version: number;
  generated_at: string;
};

export type ChapterContextPayload = {
  synopsis: string;
  timeline_year: number;
  historical: {
    date_written: string;
    period: string;
    author: string;
    audience: string;
    purpose: string;
  };
  people_places: {
    people: { name: string; description: string }[];
    places: { name: string; description: string }[];
  };
  cultural_religious: {
    customs: string[];
    surrounding_cultures: string[];
    audience_beliefs: string[];
  };
  themes_takeaway: {
    main_themes: string[];
    cross_references: { reference: string; note: string }[];
    application: string;
  };
};
