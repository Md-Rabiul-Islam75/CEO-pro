"use client";

import { useState } from "react";
import Link from "next/link";
import AdminIcon from "@/components/admin/AdminIcon";
import { Card, PageHeader, StatusPill, Toggle, btnPrimary } from "@/components/admin/ui";

type Program = {
  id: string;
  name: string;
  tagline: string;
  slug: string;
  isActive: boolean;
};

// Mock — these appear in the "Training Entrepreneurs / SME" dropdown under
// ABM Whaiduzzaman on the public site. DB-backed later.
const INITIAL: Program[] = [
  {
    id: "1",
    name: "One-Focus",
    tagline: "trains entrepreneurs",
    slug: "one-focus",
    isActive: true,
  },
];

let nextId = 2;

export default function TrainingPage() {
  const [programs, setPrograms] = useState<Program[]>(INITIAL);

  function toggle(id: string) {
    setPrograms((p) =>
      p.map((x) => (x.id === id ? { ...x, isActive: !x.isActive } : x))
    );
  }

  function move(id: string, dir: -1 | 1) {
    setPrograms((p) => {
      const i = p.findIndex((x) => x.id === id);
      const j = i + dir;
      if (j < 0 || j >= p.length) return p;
      const copy = [...p];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  function remove(id: string) {
    setPrograms((p) => p.filter((x) => x.id !== id));
  }

  function add() {
    setPrograms((p) => [
      ...p,
      {
        id: String(nextId++),
        name: "New Program",
        tagline: "tagline",
        slug: "new-program",
        isActive: false,
      },
    ]);
  }

  return (
    <div>
      <PageHeader
        title="Programs & Masterclasses"
        description="Programs in the “Programs and Master Classes” dropdown under ABM. Each is a landing page with its own Book-a-Session enrollment form."
        action={
          <button type="button" onClick={add} className={btnPrimary}>
            <AdminIcon name="plus" className="h-4 w-4" />
            New program
          </button>
        }
      />

      <Card>
        <ul className="divide-y divide-line">
          {programs.map((p, i) => (
            <li
              key={p.id}
              className={`flex items-center gap-4 px-4 py-3.5 ${
                p.isActive ? "" : "bg-slate-50/60"
              }`}
            >
              <div className="flex flex-col text-ink-faint">
                <button
                  type="button"
                  onClick={() => move(p.id, -1)}
                  disabled={i === 0}
                  className="rounded p-0.5 hover:text-ink disabled:opacity-30"
                  aria-label="Move up"
                >
                  <AdminIcon name="chevronUp" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(p.id, 1)}
                  disabled={i === programs.length - 1}
                  className="rounded p-0.5 hover:text-ink disabled:opacity-30"
                  aria-label="Move down"
                >
                  <AdminIcon name="chevronDown" className="h-4 w-4" />
                </button>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-green-tint">
                <AdminIcon name="training" className="h-5 w-5 text-brand-green" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`truncate font-semibold ${
                      p.isActive ? "text-ink" : "text-ink-faint"
                    }`}
                  >
                    {p.name}
                  </p>
                  <StatusPill variant={p.isActive ? "active" : "inactive"}>
                    {p.isActive ? "In dropdown" : "Hidden"}
                  </StatusPill>
                </div>
                <p className="truncate text-xs text-ink-faint">
                  /training/{p.slug} · {p.tagline}
                </p>
              </div>

              <Toggle
                checked={p.isActive}
                onChange={() => toggle(p.id)}
                label={`Toggle ${p.name}`}
              />

              <div className="flex shrink-0 items-center gap-1 text-ink-faint">
                <Link
                  href={`/admin/training/${p.slug}`}
                  className="rounded-md px-2.5 py-1 text-xs font-semibold text-brand-blue hover:bg-brand-blue-tint"
                >
                  Edit page
                </Link>
                <button
                  type="button"
                  onClick={() => remove(p.id)}
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
        Toggle a program off when it finishes (e.g. One-Focus) — it disappears
        from the dropdown without being deleted.
      </p>
    </div>
  );
}
