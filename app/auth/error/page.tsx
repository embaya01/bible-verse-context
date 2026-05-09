import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 animate-slide-up">
      <span className="font-display text-amber text-4xl leading-none">✦</span>
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-light tracking-wide text-foreground">
          Sign-in link expired
        </h1>
        <p className="text-sm text-muted-foreground max-w-xs">
          Magic links expire after a few minutes. Request a new one and try again.
        </p>
      </div>
      <Link
        href="/"
        className="text-[11px] font-sans uppercase tracking-[0.14em] text-amber hover:text-amber/80 transition-colors duration-150"
      >
        ← Back to Unveiled
      </Link>
    </div>
  );
}
