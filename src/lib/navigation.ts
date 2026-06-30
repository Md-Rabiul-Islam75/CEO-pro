/**
 * Sidebar navigation model.
 *
 * Two stable pillars drive the sidebar:
 *   ABM Whaiduzzaman · builds technology   (with a Training dropdown)
 *   Ventures         · creates brands
 *
 * Training programs (One-Focus, etc.) are NOT a pillar — they're a dynamic
 * dropdown under ABM. Admin creates a program, flips it active, and it appears
 * here. Each program is a single landing page (/training/<slug>).
 *
 * Kept as plain data so it can later be sourced from the database.
 */

export type NavLink = {
  label: string;
  href: string;
};

/** Expandable "Training Entrepreneurs / SME" dropdown, listing active programs. */
export type TrainingGroup = {
  label: string;
  programs: NavLink[];
};

export type NavSection = {
  title: string;
  tagline: string;
  accent: "green" | "blue";
  links: NavLink[];
  /** Optional "Programs and Master Classes" dropdown, rendered after `links`. */
  training?: TrainingGroup;
  /** Links rendered after the dropdown (e.g. The Book, Blog, Podcast…). */
  linksAfter?: NavLink[];
};

export const BRAND = {
  name: "ABM WHAIDUZZAMAN",
  tagline: "builds technology",
};

/** Standalone global link shown at the bottom of the sidebar (above social). */
export const CONTACT_LINK: NavLink = { label: "Contact", href: "/contact" };

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "ABM WHAIDUZZAMAN",
    tagline: "builds technology",
    accent: "blue",
    links: [
      { label: "Builds Software", href: "/builds-software" },
      { label: "My Story", href: "/my-story" },
      { label: "Nexalinx · ASL", href: "/nexalinx-asl" },
      { label: "Products & Platforms", href: "/products" },
      { label: "Clients & Case Studies", href: "/case-studies" },
      { label: "Press Kit", href: "/press-kit" },
      { label: "Speaking & Consulting", href: "/speaking" },
    ],
    training: {
      label: "Programs and Master Classes",
      programs: [
        // Active programs (admin-managed). One-Focus is the first.
        { label: "One-Focus", href: "/training/one-focus" },
      ],
    },
    linksAfter: [
      { label: "The Book", href: "/the-book" },
      { label: "Blog & Articles", href: "/blog" },
      { label: "Podcast & Videos", href: "/podcast" },
      { label: "Free Resources", href: "/resources" },
    ],
  },
  {
    title: "VENTURES",
    tagline: "creates brands",
    accent: "blue",
    links: [
      { label: "Zariya Living", href: "/ventures/zariya-living" },
      { label: "Heritique", href: "/ventures/heritique" },
      { label: "AVA", href: "/ventures/ava" },
      { label: "Invest & Partner", href: "/ventures/invest" },
    ],
  },
];

export type SocialLink = {
  label: string;
  href: string;
  icon: "x" | "facebook" | "linkedin" | "youtube" | "instagram";
};

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "X", href: "#", icon: "x" },
  { label: "Facebook", href: "#", icon: "facebook" },
  { label: "LinkedIn", href: "#", icon: "linkedin" },
  { label: "YouTube", href: "#", icon: "youtube" },
  { label: "Instagram", href: "#", icon: "instagram" },
];
