import type { Metadata } from "next";
import Link from "next/link";
import BrandSignature from "@/components/BrandSignature";

export const metadata: Metadata = {
  title: "Page not found — ABM Whaiduzzaman",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-blue-tint via-white to-brand-green-tint px-6 py-16 text-center">
      {/* Watermark 404 */}
      <span
        aria-hidden
        className="pointer-events-none absolute select-none text-[42vw] font-extrabold leading-none tracking-tighter text-brand-blue/5 sm:text-[26rem]"
      >
        404
      </span>

      <div className="relative flex flex-col items-center">
        <Link href="/" aria-label="Home" className="mb-10">
          <BrandSignature className="h-12 w-auto text-brand-blue" />
        </Link>

        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-green">
          Error 404
        </p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
          This page doesn&apos;t exist.
        </h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
          The page you&apos;re looking for may have moved, been renamed, or
          isn&apos;t ready just yet. Let&apos;s get you back on track.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-brand-green px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-brand-green-dark"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition-colors hover:border-brand-blue hover:text-brand-blue"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}
