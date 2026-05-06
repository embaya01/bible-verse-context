import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Unveiled", template: "%s — Unveiled" },
  description:
    "The story behind every chapter. Historical, cultural and devotional context for any Bible passage — in plain English.",
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-lg leading-none">✦</span>
              <span className="font-semibold tracking-tight text-sm text-foreground group-hover:text-foreground/80 transition-colors">
                Unveiled
              </span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link
                href="/about"
                className="hover:text-foreground transition-colors duration-150"
              >
                About
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
          {children}
        </main>

        <footer className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground">
          AI-assisted context. Treat as a starting point, not authoritative commentary.
        </footer>
      </body>
    </html>
  );
}
