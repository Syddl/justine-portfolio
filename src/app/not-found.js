import Link from "next/link";
import { inter, jetbrainsMono } from "./fonts";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex-grow mx-auto max-w-3xl w-full px-6 py-24 flex flex-col items-start text-[#A8ADB2]">
      <p className={`${jetbrainsMono.className} text-neutral-500 mb-3`}>
        {`// 404`}
      </p>
      <h1 className={`${inter.className} text-4xl font-bold text-gray-100 mb-3`}>
        This page doesn&apos;t exist.
      </h1>
      <p className={`${inter.className} leading-relaxed max-w-md mb-8`}>
        The link may be old, or the page may have moved. Everything worth
        seeing is one click away:
      </p>
      <div className={`${inter.className} flex items-center gap-4`}>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-lg bg-neutral-100 text-neutral-900 font-medium text-sm hover:bg-white transition-colors duration-200"
        >
          Back to home
        </Link>
        <Link
          href="/projects"
          className="text-sm text-neutral-400 hover:text-neutral-100 underline underline-offset-4 decoration-neutral-700 transition-colors"
        >
          See my work
        </Link>
      </div>
    </main>
  );
}
