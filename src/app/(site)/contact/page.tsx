import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContact } from "@/lib/pages/getContact";
import { getSettings } from "@/lib/getSettings";
import { isPagePublished } from "@/lib/getPageStatus";
import { SOCIAL_PLATFORMS } from "@/lib/siteSettings";
import type { SocialLink } from "@/lib/navigation";
import SocialIcon from "@/components/SocialIcon";
import ContactForm from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact — ABM Whaiduzzaman",
  description: "Get in touch with ABM Whaiduzzaman — speaking, consulting, partnerships.",
};

const SOCIAL_ICONS: Partial<Record<string, SocialLink["icon"]>> = {
  X: "x",
  Facebook: "facebook",
  LinkedIn: "linkedin",
  YouTube: "youtube",
  Instagram: "instagram",
};

export default async function ContactPage() {
  if (!(await isPagePublished("/contact"))) notFound();

  const [content, settings] = await Promise.all([getContact(), getSettings()]);
  const { heading, intro, showForm, subjects } = content;
  const { contact, social } = settings;

  const details = [
    contact.email && {
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
      icon: (
        <path d="M3 5h18v14H3z M3 7l9 6 9-6" />
      ),
    },
    contact.phone && {
      label: "Phone",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/[^0-9+]/g, "")}`,
      icon: (
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.98.36 1.92.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.89.34 1.83.57 2.81.7A2 2 0 0 1 22 16.92z" />
      ),
    },
    contact.address && {
      label: "Address",
      value: contact.address,
      href: `https://maps.google.com/?q=${encodeURIComponent(contact.address)}`,
      icon: (
        <>
          <path d="M12 21s-7-6.3-7-11a7 7 0 1 1 14 0c0 4.7-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </>
      ),
    },
  ].filter(Boolean) as {
    label: string;
    value: string;
    href: string;
    icon: React.ReactNode;
  }[];

  const socialLinks = SOCIAL_PLATFORMS.filter((p) => social[p]?.trim()).map((p) => ({
    platform: p,
    url: social[p],
    icon: SOCIAL_ICONS[p],
  }));

  return (
    <div>
      {/* ── Header ─────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-tint via-white to-brand-green-tint" />
        <div className="relative mx-auto max-w-5xl px-6 py-20 sm:py-24 lg:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue">
            Contact
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-[1.1] tracking-tight text-brand-green sm:text-5xl">
            {heading}
          </h1>
          {intro && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
              {intro}
            </p>
          )}
        </div>
      </section>

      {/* ── Details + form ─────────────────────────── */}
      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-12">
        <div className={`grid gap-10 ${showForm ? "lg:grid-cols-[320px_1fr]" : ""}`}>
          {/* Details */}
          <div className="space-y-4">
            {details.map((d) => (
              <a
                key={d.label}
                href={d.href}
                {...(d.label === "Address" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-start gap-4 rounded-2xl border border-line bg-white p-5 transition-colors hover:border-brand-blue-soft"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue-tint text-brand-blue">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {d.icon}
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold uppercase tracking-wide text-ink-faint">
                    {d.label}
                  </span>
                  <span className="mt-0.5 block break-words font-semibold text-ink group-hover:text-brand-blue">
                    {d.value}
                  </span>
                </span>
              </a>
            ))}

            {socialLinks.length > 0 && (
              <div className="rounded-2xl border border-line bg-white p-5">
                <span className="block text-xs font-bold uppercase tracking-wide text-ink-faint">
                  Follow
                </span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {socialLinks.map((s) => (
                    <a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.platform}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-brand-green hover:bg-brand-green hover:text-white"
                      title={s.platform}
                    >
                      {s.icon ? (
                        <SocialIcon icon={s.icon} className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-bold">{s.platform.charAt(0)}</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          {showForm && <ContactForm subjects={subjects} />}
        </div>
      </div>
    </div>
  );
}
