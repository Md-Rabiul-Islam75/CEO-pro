import Link from "next/link";
import AdminIcon from "@/components/admin/AdminIcon";
import { Card, PageHeader, StatusPill, btnPrimary } from "@/components/admin/ui";

type Row = {
  title: string;
  slug: string;
  section: string;
  accent?: "green" | "blue";
  status: "PUBLISHED" | "DRAFT";
  blocks: number;
  /** Collection this page displays via a block (UI hint). */
  pullsFrom?: string;
};

// Mock — mirrors the public sidebar exactly (2 pillars + global Contact).
// Program landing pages live under "Programs & Masterclasses", not here.
const PAGES: Row[] = [
  // ABM Whaiduzzaman — before the Programs dropdown
  { title: "Builds Software", slug: "/builds-software", section: "ABM Whaiduzzaman", accent: "blue", status: "PUBLISHED", blocks: 3 },
  { title: "My Story", slug: "/my-story", section: "ABM Whaiduzzaman", accent: "blue", status: "PUBLISHED", blocks: 4 },
  { title: "Nexalinx · ASL", slug: "/nexalinx-asl", section: "ABM Whaiduzzaman", accent: "blue", status: "DRAFT", blocks: 2 },
  { title: "Products & Platforms", slug: "/products", section: "ABM Whaiduzzaman", accent: "blue", status: "DRAFT", blocks: 2 },
  { title: "Clients & Case Studies", slug: "/case-studies", section: "ABM Whaiduzzaman", accent: "blue", status: "DRAFT", blocks: 1 },
  { title: "Press Kit", slug: "/press-kit", section: "ABM Whaiduzzaman", accent: "blue", status: "PUBLISHED", blocks: 3, pullsFrom: "Press" },
  { title: "Speaking & Consulting", slug: "/speaking", section: "ABM Whaiduzzaman", accent: "blue", status: "DRAFT", blocks: 2, pullsFrom: "Events" },
  // ABM Whaiduzzaman — after the Programs dropdown
  { title: "The Book", slug: "/the-book", section: "ABM Whaiduzzaman", accent: "blue", status: "DRAFT", blocks: 2, pullsFrom: "Books" },
  { title: "Blog & Articles", slug: "/blog", section: "ABM Whaiduzzaman", accent: "blue", status: "PUBLISHED", blocks: 1, pullsFrom: "Articles" },
  { title: "Podcast & Videos", slug: "/podcast", section: "ABM Whaiduzzaman", accent: "blue", status: "DRAFT", blocks: 2, pullsFrom: "Videos" },
  { title: "Free Resources", slug: "/resources", section: "ABM Whaiduzzaman", accent: "blue", status: "DRAFT", blocks: 1, pullsFrom: "Resources" },
  // Global standalone link
  { title: "Contact", slug: "/contact", section: "Global", status: "PUBLISHED", blocks: 1 },
  // Ventures
  { title: "Zariya Living", slug: "/ventures/zariya-living", section: "Ventures", accent: "blue", status: "PUBLISHED", blocks: 3 },
  { title: "Heritique", slug: "/ventures/heritique", section: "Ventures", accent: "blue", status: "DRAFT", blocks: 2 },
  { title: "AVA", slug: "/ventures/ava", section: "Ventures", accent: "blue", status: "DRAFT", blocks: 1 },
  { title: "Invest & Partner", slug: "/ventures/invest", section: "Ventures", accent: "blue", status: "DRAFT", blocks: 2 },
];

export default function PagesList() {
  return (
    <div>
      <PageHeader
        title="Pages"
        description="Every sidebar link. Open a page to build it with content blocks."
        action={
          <button type="button" className={btnPrimary}>
            <AdminIcon name="plus" className="h-4 w-4" />
            New page
          </button>
        }
      />

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            <tr>
              <th className="px-4 py-2.5">Page</th>
              <th className="hidden px-4 py-2.5 sm:table-cell">Section</th>
              <th className="hidden px-4 py-2.5 md:table-cell">Blocks</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {PAGES.map((p) => (
              <tr key={p.slug} className="hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <p className="font-semibold text-ink">{p.title}</p>
                  <p className="text-xs text-ink-faint">{p.slug}</p>
                  {p.pullsFrom && (
                    <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-brand-blue">
                      pulls from → {p.pullsFrom}
                    </p>
                  )}
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <span className="inline-flex items-center gap-1.5 text-ink-soft">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        p.accent === "green"
                          ? "bg-brand-green"
                          : p.accent === "blue"
                          ? "bg-brand-blue"
                          : "bg-slate-300"
                      }`}
                    />
                    {p.section}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-ink-soft md:table-cell">
                  {p.blocks}
                </td>
                <td className="px-4 py-3">
                  <StatusPill variant={p.status === "PUBLISHED" ? "published" : "draft"}>
                    {p.status}
                  </StatusPill>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 text-ink-faint">
                    <Link
                      href={
                        p.slug === "/builds-software"
                          ? "/admin/pages/builds-software"
                          : p.slug === "/my-story"
                          ? "/admin/pages/my-story"
                          : "/admin/pages"
                      }
                      className="rounded-md px-2.5 py-1 text-xs font-semibold text-brand-blue hover:bg-brand-blue-tint"
                    >
                      Edit blocks
                    </Link>
                    <button
                      type="button"
                      className="rounded-md p-1.5 hover:bg-red-50 hover:text-red-500"
                      aria-label="Delete"
                    >
                      <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
