/**
 * "Speaking & Consulting" page content — hero, intro, speaking topics, upcoming
 * events, past talks, and a booking CTA. Stored under key "page:speaking".
 * (Client-safe: no Prisma here.)
 */

export type SpeakingEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  link: string;
};

export type Talk = {
  id: string;
  title: string;
  video: string; // YouTube URL
  thumbnail: string;
  link: string;
};

export type SpeakingContent = {
  hero: {
    image: string;
    video: string;
    headline: string;
    ctaLabel: string;
    ctaLink: string;
  };
  intro: string; // rich-text HTML
  topics: string[];
  events: SpeakingEvent[];
  talks: Talk[];
};

export const DEFAULT_SPEAKING: SpeakingContent = {
  hero: {
    image: "",
    video: "",
    headline: "Speaking & Consulting",
    ctaLabel: "Book me",
    ctaLink: "/contact",
  },
  intro:
    "<p>ABM Whaiduzzaman speaks and consults on software architecture, smart metering & AMI, telecom billing, healthcare IT (HL7/DICOM), SaaS at scale, and disciplined entrepreneurship — with multi-country keynote and consulting experience.</p>",
  topics: [
    "Software architecture at scale",
    "Smart metering & AMI/MDM",
    "Telecom billing & mediation",
    "Healthcare IT — HL7 & DICOM",
    "Building SaaS products",
    "Disciplined entrepreneurship",
  ],
  events: [],
  talks: [],
};

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

function coerceEvent(v: Partial<SpeakingEvent>, i: number): SpeakingEvent {
  return {
    id: str(v.id) || `ev-${i}`,
    title: str(v.title),
    date: str(v.date),
    location: str(v.location),
    link: str(v.link),
  };
}

function coerceTalk(v: Partial<Talk>, i: number): Talk {
  return {
    id: str(v.id) || `tk-${i}`,
    title: str(v.title),
    video: str(v.video),
    thumbnail: str(v.thumbnail),
    link: str(v.link),
  };
}

export function withSpeakingDefaults(value: unknown): SpeakingContent {
  const v = (value ?? {}) as Partial<SpeakingContent>;
  return {
    hero: { ...DEFAULT_SPEAKING.hero, ...(v.hero ?? {}) },
    intro: typeof v.intro === "string" ? v.intro : DEFAULT_SPEAKING.intro,
    topics: Array.isArray(v.topics)
      ? v.topics.map((t) => str(t)).filter(Boolean)
      : DEFAULT_SPEAKING.topics,
    events: Array.isArray(v.events) ? v.events.map(coerceEvent) : DEFAULT_SPEAKING.events,
    talks: Array.isArray(v.talks) ? v.talks.map(coerceTalk) : DEFAULT_SPEAKING.talks,
  };
}
