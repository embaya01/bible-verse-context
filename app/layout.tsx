import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { NavAuth } from "@/components/auth/nav-auth";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Unveiled", template: "%s — Unveiled" },
  description:
    "The story behind every chapter. Historical, cultural and devotional context for any Bible passage — in plain English.",
  twitter: { card: "summary_large_image" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Apply .dark class based on system preference without FOUC */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 border-b border-amber/20 bg-background/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3.5">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-display text-amber text-xl leading-none select-none">
                ✦
              </span>
              <span className="font-display text-[1.05rem] tracking-[0.18em] uppercase text-foreground/90 group-hover:text-foreground transition-colors duration-200">
                Unveiled
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/about"
                className="text-[11px] font-sans text-muted-foreground hover:text-foreground transition-colors duration-150 uppercase tracking-[0.14em]"
              >
                About
              </Link>
              <NavAuth user={user} />
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
          {children}
        </main>

        <footer className="border-t border-border/60 px-4 py-7 text-center space-y-1">
          <p className="text-xs text-muted-foreground tracking-wide">
            AI-assisted context. Treat as a starting point, not authoritative commentary.
          </p>
          <p className="font-display text-sm italic text-amber/50">✦ Unveiled</p>
        </footer>
      </body>
    </html>
  );
}
