import Link from "next/link";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex-grow mx-auto max-w-col w-full px-6 py-24 flex flex-col items-start text-body">
      <h1 className="text-[2.125rem] font-medium tracking-[-0.02em] leading-tight text-ink mb-3">
        This page doesn&apos;t exist.
      </h1>
      <p className="leading-relaxed max-w-md mb-8">
        The link may be old, or the page may have moved. Everything worth
        seeing is one click away:
      </p>
      <div className="flex items-center gap-4">
        <Link href="/" className="pill">
          Back to home
        </Link>
        <Link
          href="/projects"
          className="text-sm text-muted hover:text-ink underline underline-offset-4 decoration-line-strong transition-colors"
        >
          See my work
        </Link>
      </div>
    </main>
  );
}
