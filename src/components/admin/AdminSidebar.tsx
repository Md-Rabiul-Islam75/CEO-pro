"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV } from "@/lib/adminNav";
import AdminIcon from "./AdminIcon";

/** Brand + nav + footer — shared by the desktop sidebar and the mobile drawer. */
function SidebarInner({
  pathname,
  counts,
  onNavigate,
  onSignOut,
  onClose,
}: {
  pathname: string;
  counts: Record<string, number>;
  onNavigate?: () => void;
  onSignOut: () => void;
  onClose?: () => void;
}) {
  return (
    <>
      {/* Brand — generic panel identity (used by multiple managers) */}
      <div className="flex items-center gap-2.5 px-6 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-green text-white">
          <AdminIcon name="settings" className="h-[18px] w-[18px]" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-tight text-ink">Admin Panel</p>
          <p className="text-[11px] text-ink-faint">Content manager</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="ml-auto rounded-md p-1.5 text-ink-faint hover:bg-slate-100 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scroll-slim px-3 py-2">
        {ADMIN_NAV.map((group, i) => (
          <div key={group.heading ?? i} className="mb-4">
            {group.heading && (
              <p className="px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-faint">
                {group.heading}
              </p>
            )}
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-brand-green-tint text-brand-green-dark"
                          : "text-ink-soft hover:bg-slate-50 hover:text-ink"
                      }`}
                    >
                      <AdminIcon
                        name={item.icon}
                        className={`h-[18px] w-[18px] ${
                          active ? "text-brand-green" : "text-ink-faint"
                        }`}
                      />
                      <span className="flex-1">{item.label}</span>
                      {counts[item.href] > 0 && (
                        <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-green px-1.5 text-[11px] font-bold text-white">
                          {counts[item.href]}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-line p-3">
        <Link
          href="/"
          target="_blank"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-slate-50 hover:text-ink"
        >
          <AdminIcon name="external" className="h-[18px] w-[18px] text-ink-faint" />
          View site
        </Link>
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-slate-50 hover:text-ink"
        >
          <AdminIcon name="logout" className="h-[18px] w-[18px] text-ink-faint" />
          Sign out
        </button>
      </div>
    </>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false); // mobile drawer

  // Poll unread/new counts for the notification badges; also refresh on
  // navigation (so marking items read updates the badge promptly).
  useEffect(() => {
    let active = true;
    const load = () =>
      fetch("/api/admin/counts")
        .then((r) => r.json())
        .then((d) => {
          if (active)
            setCounts({
              "/admin/enrollments": d.enrollments || 0,
              "/admin/messages": d.messages || 0,
              "/admin/subscribers": d.subscribers || 0,
            });
        })
        .catch(() => {});
    load();
    const t = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [pathname]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function signOut() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = "/login";
    }
  }

  const totalNew =
    (counts["/admin/enrollments"] || 0) + (counts["/admin/messages"] || 0);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-white lg:flex">
        <SidebarInner pathname={pathname} counts={counts} onSignOut={signOut} />
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center gap-3 border-b border-line bg-white px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="relative rounded-md p-1.5 text-ink hover:bg-slate-100"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
          {totalNew > 0 && (
            <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-brand-green ring-2 ring-white" />
          )}
        </button>
        <span className="text-sm font-bold tracking-tight text-ink">Admin Panel</span>
        <Link href="/" className="ml-auto text-xs font-medium text-brand-green">
          View site
        </Link>
      </div>

      {/* Mobile drawer + overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] transform flex-col bg-white shadow-xl transition-transform duration-200 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarInner
          pathname={pathname}
          counts={counts}
          onSignOut={signOut}
          onNavigate={() => setOpen(false)}
          onClose={() => setOpen(false)}
        />
      </aside>
    </>
  );
}
