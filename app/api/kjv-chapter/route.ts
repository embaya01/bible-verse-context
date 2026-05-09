import { NextResponse } from "next/server";

type ApiVerse = { verse: number; text: string };
type ApiResponse = { reference: string; verses: ApiVerse[]; error?: string };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookName = searchParams.get("book");
  const chapter  = searchParams.get("chapter");

  if (!bookName || !chapter) {
    return NextResponse.json({ error: "Missing book or chapter" }, { status: 400 });
  }

  const slug = `${bookName} ${chapter}`.replace(/\s+/g, "+");
  const url  = `https://bible-api.com/${slug}?translation=kjv`;

  const res = await fetch(url, { next: { revalidate: 86_400 } });

  if (!res.ok) {
    return NextResponse.json(
      { error: `bible-api.com returned ${res.status}` },
      { status: 502 },
    );
  }

  const data: ApiResponse = await res.json();

  return NextResponse.json({
    reference: data.reference,
    verses: data.verses.map((v) => ({
      verse: v.verse,
      text: v.text.trim().replace(/\n/g, " "),
    })),
  });
}
