import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPressKit } from "@/lib/pages/getPressKit";
import { isPagePublished } from "@/lib/getPageStatus";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Press Kit — ABM Whaiduzzaman",
  description: "Biography, one-sheet, headshots and recent press for ABM Whaiduzzaman.",
};

export default async function PressKitPage() {
  if (!(await isPagePublished("/press-kit"))) notFound();

  const { banner, bio, oneSheet, photos, press } = await getPressKit();
  const hasImage = !!banner.image;
  const sheetUrl = oneSheet.url
    ? /^https?:\/\//.test(oneSheet.url) || oneSheet.url.startsWith("/")
      ? oneSheet.url
      : `https://${oneSheet.url}`
    : "";

  return (
    <div>
      {/* ── Banner ─────────────────────────────────── */}
      <section
        className={`relative flex flex-col overflow-hidden ${
          hasImage ? "min-h-[340px] justify-end lg:min-h-[46vh]" : ""
        }`}
      >
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={banner.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : null}
        {hasImage ? (
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/5" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-tint via-white to-brand-green-tint" />
        )}
        <div
          className={`relative w-full max-w-4xl px-6 lg:px-12 ${
            hasImage ? "pb-12 pt-24 text-white" : "py-20 sm:py-24"
          }`}
        >
          <p className={`text-sm font-semibold uppercase tracking-[0.22em] ${hasImage ? "text-white/80" : "text-brand-blue"}`}>
            Press Kit
          </p>
          <h1 className={`mt-4 max-w-3xl text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl ${hasImage ? "text-white" : "text-brand-green"}`}>
            {banner.headline}
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-12">
        {/* ── Biography + one-sheet ────────────────── */}
        <section className="grid gap-10 lg:grid-cols-[1fr_260px]">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">
              Biography
            </h2>
            <div
              className="mt-4 [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-ink-soft [&_p:first-child]:mt-0 [&_strong]:font-semibold [&_strong]:text-ink"
              dangerouslySetInnerHTML={{ __html: bio }}
            />
          </div>

          {sheetUrl && (
            <aside className="lg:pt-8">
              <div className="rounded-2xl border border-line bg-slate-50 p-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green-soft text-brand-green-dark">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p className="mt-3 text-sm text-ink-soft">Everything in one file.</p>
                <a
                  href={sheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green-dark"
                >
                  {oneSheet.label || "Download one-sheet"}
                </a>
              </div>
            </aside>
          )}
        </section>

        {/* ── Headshots ────────────────────────────── */}
        {photos.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">
              Headshots &amp; photos
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {photos.filter((p) => p.url).map((p) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={p.id}
                  src={p.url}
                  alt="Headshot"
                  className="aspect-[3/4] w-full rounded-2xl border border-line object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Recent press ─────────────────────────── */}
        {press.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-faint">
              Recent press
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {press.map((p) => {
                const Wrapper = p.link ? "a" : "div";
                return (
                  <Wrapper
                    key={p.id}
                    {...(p.link ? { href: p.link, target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={`group flex flex-col rounded-2xl border border-line bg-white p-6 transition-all duration-300 ${
                      p.link ? "hover:-translate-y-1 hover:border-brand-blue-soft hover:shadow-[0_14px_34px_-14px_rgba(2,132,199,0.3)]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-blue">
                      {p.outlet && <span>{p.outlet}</span>}
                      {p.outlet && p.date && <span className="text-ink-faint">·</span>}
                      {p.date && <span className="text-ink-faint">{p.date}</span>}
                    </div>
                    <h3 className="mt-2 text-lg font-extrabold leading-snug tracking-tight text-ink">
                      {p.title}
                    </h3>
                    {p.link && (
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue">
                        Read article
                        <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </Wrapper>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
