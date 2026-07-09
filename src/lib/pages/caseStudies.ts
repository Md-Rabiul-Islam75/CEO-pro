/**
 * "Clients & Case Studies" page content — a banner, a client logo wall, and
 * detailed case-study cards. Stored under key "page:case-studies".
 * (Client-safe: no Prisma here.)
 */

export type Client = { id: string; logo: string; name: string; link: string };

export type Study = {
  id: string;
  image: string;
  client: string;
  title: string;
  summary: string;
  link: string;
};

export type CaseStudiesContent = {
  banner: { image: string; headline: string; intro: string };
  clients: Client[];
  studies: Study[];
};

export const DEFAULT_CASE_STUDIES: CaseStudiesContent = {
  banner: {
    image: "",
    headline: "Clients & Case Studies",
    intro:
      "Operators, utilities and enterprises I've delivered mission-critical systems for — and a closer look at a few of the projects.",
  },
  clients: [
    { id: "cl1", logo: "", name: "GrameenPhone", link: "" },
    { id: "cl2", logo: "", name: "GETCO Telecom", link: "" },
    { id: "cl3", logo: "", name: "UMEME (Uganda)", link: "" },
    { id: "cl4", logo: "", name: "DPDC", link: "" },
    { id: "cl5", logo: "", name: "DESCO", link: "" },
    { id: "cl6", logo: "", name: "Fortune Securities", link: "" },
  ],
  studies: [
    { id: "s1", image: "", client: "GrameenPhone", title: "Telecom Roaming System", summary: "Built the roaming platform and UAT process for one of Asia's largest operators.", link: "" },
    { id: "s2", image: "", client: "UMEME, Uganda", title: "STS/CTS Prepaid Vending", summary: "Designed secure STS/CTS vending and Field Data Management for a national utility.", link: "" },
  ],
};

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);

function coerceClient(v: Partial<Client>, i: number): Client {
  return {
    id: str(v.id) || `cl-${i}`,
    logo: str(v.logo),
    name: str(v.name),
    link: str(v.link),
  };
}

function coerceStudy(v: Partial<Study>, i: number): Study {
  return {
    id: str(v.id) || `s-${i}`,
    image: str(v.image),
    client: str(v.client),
    title: str(v.title),
    summary: str(v.summary),
    link: str(v.link),
  };
}

export function withCaseStudiesDefaults(value: unknown): CaseStudiesContent {
  const v = (value ?? {}) as Partial<CaseStudiesContent>;
  return {
    banner: { ...DEFAULT_CASE_STUDIES.banner, ...(v.banner ?? {}) },
    clients: Array.isArray(v.clients)
      ? v.clients.map(coerceClient)
      : DEFAULT_CASE_STUDIES.clients,
    studies: Array.isArray(v.studies)
      ? v.studies.map(coerceStudy)
      : DEFAULT_CASE_STUDIES.studies,
  };
}
