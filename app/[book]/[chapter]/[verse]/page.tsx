import { redirect } from "next/navigation";
import { getBookBySlug } from "@/lib/bible/books";

export const dynamic = "force-dynamic";

export default async function VersePage({
  params,
}: {
  params: Promise<{ book: string; chapter: string; verse: string }>;
}) {
  const { book: bookSlug, chapter: chapterStr } = await params;

  const book = getBookBySlug(bookSlug);
  const chapter = parseInt(chapterStr, 10);

  if (book && chapter >= 1) {
    redirect(`/${book.slug}/${chapter}`);
  }

  redirect("/");
}
