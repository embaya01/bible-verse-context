import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getUser, createClient } from "@/lib/supabase/server";
import { getBookBySlug } from "@/lib/bible/books";
import { AccountTabs } from "@/components/account/account-tabs";
import { ProfileHeader } from "@/components/account/profile-header";

export const metadata: Metadata = { title: "Profile" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getUser();
  if (!user) redirect("/");

  const supabase = await createClient();

  const [
    { data: history },
    { data: favs },
    { data: noteRows },
    { data: profileRow },
  ] = await Promise.all([
    supabase
      .from("reading_history")
      .select("book, chapter, visited_at")
      .eq("user_id", user.id)
      .order("visited_at", { ascending: false })
      .limit(120),
    supabase
      .from("favorites")
      .select("book, chapter, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("notes")
      .select("book, chapter, content, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("display_name, bio, denomination, location")
      .eq("id", user.id)
      .maybeSingle(),
  ]);

  // Deduplicate history — newest visit per chapter
  const seen = new Set<string>();
  const deduped = (history ?? []).filter(({ book, chapter }) => {
    const key = `${book}/${chapter}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  function enriched<T extends { book: string; chapter: number }>(rows: T[]) {
    return rows.map((row) => ({
      ...row,
      bookName: getBookBySlug(row.book)?.name ?? row.book,
    }));
  }

  const historyItems = enriched(deduped);
  const favoriteItems = enriched(favs ?? []);
  const noteItems = enriched(
    (noteRows ?? []).filter((n) => n.content.trim().length > 0),
  );

  // Stats derived from fetched data
  const booksOpened = new Set(deduped.map((d) => d.book)).size;

  const profile = {
    display_name: profileRow?.display_name ?? "",
    bio:          profileRow?.bio          ?? "",
    denomination: profileRow?.denomination ?? "evangelical",
    location:     profileRow?.location     ?? "",
  };

  return (
    <div className="space-y-8 animate-slide-up">

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-colors duration-150"
      >
        ← All chapters
      </Link>

      <ProfileHeader
        userId={user.id}
        email={user.email ?? ""}
        profile={profile}
        chaptersExplored={historyItems.length}
        booksOpened={booksOpened}
        saved={favoriteItems.length}
        notes={noteItems.length}
      />

      <AccountTabs
        history={historyItems}
        favorites={favoriteItems}
        notes={noteItems}
      />
    </div>
  );
}
