import Link from "next/link";
import AdminIcon from "@/components/admin/AdminIcon";
import { Card, PageHeader } from "@/components/admin/ui";
import type { IconName } from "@/components/admin/AdminIcon";

// Mock numbers for the design pass — wired to the DB in a later step.
const STATS: { label: string; value: number; href: string; icon: IconName }[] = [
  { label: "Sections", value: 2, href: "/admin/sections", icon: "sections" },
  { label: "Pages", value: 16, href: "/admin/pages", icon: "pages" },
  { label: "Programs", value: 1, href: "/admin/training", icon: "training" },
  { label: "Enrollments", value: 3, href: "/admin/enrollments", icon: "enrollments" },
];

const QUICK: { label: string; href: string; icon: IconName }[] = [
  { label: "Manage sections", href: "/admin/sections", icon: "sections" },
  { label: "Programs & classes", href: "/admin/training", icon: "training" },
  { label: "Enrollments", href: "/admin/enrollments", icon: "enrollments" },
  { label: "Upload media", href: "/admin/media", icon: "media" },
];

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Manage every part of the site — sidebar, pages, and content."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="p-5 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green-tint">
                  <AdminIcon name={s.icon} className="h-5 w-5 text-brand-green" />
                </span>
                <AdminIcon name="external" className="h-4 w-4 text-ink-faint" />
              </div>
              <p className="mt-4 text-3xl font-extrabold tracking-tight text-ink">
                {s.value}
              </p>
              <p className="text-sm text-ink-soft">{s.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 mt-10 text-xs font-bold uppercase tracking-[0.16em] text-ink-faint">
        Quick actions
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK.map((q) => (
          <Link key={q.label} href={q.href}>
            <Card className="flex items-center gap-3 p-4 transition-shadow hover:shadow-md">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue-tint">
                <AdminIcon name={q.icon} className="h-5 w-5 text-brand-blue" />
              </span>
              <span className="text-sm font-semibold text-ink">{q.label}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
