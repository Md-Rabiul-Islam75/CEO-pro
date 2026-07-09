/**
 * "Contact" page content — the editable heading/intro and form subjects. The
 * contact details themselves (phone, email, address, social) come from Site
 * Settings. Stored under key "page:contact". (Client-safe: no Prisma here.)
 */

export type ContactContent = {
  heading: string;
  intro: string;
  showForm: boolean;
  subjects: string[];
};

export const DEFAULT_CONTACT: ContactContent = {
  heading: "Let's talk.",
  intro:
    "Speaking, consulting, partnerships, or a focused founder session — tell me what you have in mind and I'll get back to you.",
  showForm: true,
  subjects: [
    "Speaking / keynote",
    "Consulting engagement",
    "Partnership / venture",
    "Media / press",
    "Something else",
  ],
};

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

export function withContactDefaults(value: unknown): ContactContent {
  const v = (value ?? {}) as Partial<ContactContent>;
  return {
    heading: typeof v.heading === "string" ? v.heading : DEFAULT_CONTACT.heading,
    intro: typeof v.intro === "string" ? v.intro : DEFAULT_CONTACT.intro,
    showForm: v.showForm !== false,
    subjects: Array.isArray(v.subjects)
      ? v.subjects.map((s) => str(s)).filter(Boolean)
      : DEFAULT_CONTACT.subjects,
  };
}
