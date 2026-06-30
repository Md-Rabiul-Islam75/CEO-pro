"use client";

import { useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import { Card, PageHeader, StatusPill, btnPrimary } from "@/components/admin/ui";

type Section = {
  id: string;
  title: string;
  tagline: string;
  accent: "green" | "blue";
  pages: number;
  isActive: boolean;
};

// Mock data mirroring the current sidebar — replaced by DB reads later.
// Two stable pillars; training programs (One-Focus, etc.) live under
// "Training Programs", not here.
const INITIAL: Section[] = [
  { id: "1", title: "ABM Whaiduzzaman", tagline: "builds technology", accent: "blue", pages: 11, isActive: true },
  { id: "2", title: "Ventures", tagline: "creates brands", accent: "blue", pages: 4, isActive: true },
];

let nextId = 3;

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>(INITIAL);

  function toggle(id: string) {
    setSections((s) =>
      s.map((x) => (x.id === id ? { ...x, isActive: !x.isActive } : x))
    );
  }

  function move(id: string, dir: -1 | 1) {
    setSections((s) => {
      const i = s.findIndex((x) => x.id === id);
      const j = i + dir;
      if (j < 0 || j >= s.length) return s;
      const copy = [...s];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  function remove(id: string) {
    setSections((s) => s.filter((x) => x.id !== id));
  }

  function add() {
    setSections((s) => [
      ...s,
      {
        id: String(nextId++),
        title: "New Section",
        tagline: "tagline",
        accent: "green",
        pages: 0,
        isActive: false,
      },
    ]);
  }

  return (
    <div>
      <PageHeader
        title="Sections"
        description="The sidebar pillars. Toggle a section off when it's finished, add new ones, and drag to reorder."
        action={
          <button type="button" onClick={add} className={btnPrimary}>
            <AdminIcon name="plus" className="h-4 w-4" />
            New section
          </button>
        }
      />

      <Card>
        <ul className="divide-y divide-line">
          {sections.map((s, i) => (
            <li
              key={s.id}
              className={`flex items-center gap-4 px-4 py-3.5 ${
                s.isActive ? "" : "bg-slate-50/60"
              }`}
            >
              {/* Reorder */}
              <div className="flex flex-col text-ink-faint">
                <button
                  type="button"
                  onClick={() => move(s.id, -1)}
                  disabled={i === 0}
                  className="rounded p-0.5 hover:text-ink disabled:opacity-30"
                  aria-label="Move up"
                >
                  <AdminIcon name="chevronUp" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(s.id, 1)}
                  disabled={i === sections.length - 1}
                  className="rounded p-0.5 hover:text-ink disabled:opacity-30"
                  aria-label="Move down"
                >
                  <AdminIcon name="chevronDown" className="h-4 w-4" />
                </button>
              </div>

              {/* Accent dot */}
              <span
                className={`h-3 w-3 shrink-0 rounded-full ${
                  s.accent === "green" ? "bg-brand-green" : "bg-brand-blue"
                }`}
              />

              {/* Title */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`truncate font-semibold ${
                      s.isActive ? "text-ink" : "text-ink-faint"
                    }`}
                  >
                    {s.title}
                  </p>
                  <StatusPill variant={s.isActive ? "active" : "inactive"}>
                    {s.isActive ? "Live" : "Hidden"}
                  </StatusPill>
                </div>
                <p className="truncate text-[13px] uppercase tracking-wide text-ink-faint">
                  {s.tagline}
                </p>
              </div>

              {/* Pages count */}
              <span className="hidden shrink-0 text-sm text-ink-soft sm:block">
                {s.pages} {s.pages === 1 ? "page" : "pages"}
              </span>

              {/* Active toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={s.isActive}
                onClick={() => toggle(s.id)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  s.isActive ? "bg-brand-green" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    s.isActive ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-1 text-ink-faint">
                <button
                  type="button"
                  className="rounded-md p-1.5 hover:bg-slate-100 hover:text-ink"
                  aria-label="Edit"
                >
                  <AdminIcon name="edit" className="h-[18px] w-[18px]" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  className="rounded-md p-1.5 hover:bg-red-50 hover:text-red-500"
                  aria-label="Delete"
                >
                  <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <p className="mt-4 text-xs text-ink-faint">
        Tip: turning a section off (e.g. One-Focus) instantly hides it and all
        its pages from the sidebar — without deleting anything.
      </p>
    </div>
  );
}
