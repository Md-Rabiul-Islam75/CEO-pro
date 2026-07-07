"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminIcon from "@/components/admin/AdminIcon";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import RichTextEditor from "@/components/admin/RichTextEditor";

type Module = { id: string; title: string; description: string };

const ABOUT =
  "<p>One-Focus trains entrepreneurs and SME owners to build focused, disciplined businesses — cutting the noise and executing on the one thing that moves the needle each week.</p><p>Drawn from ABM Whaiduzzaman's two decades building and scaling technology companies.</p>";

const INITIAL_MODULES: Module[] = [
  { id: "m1", title: "Find your one focus", description: "Identify the single lever that drives your business right now." },
  { id: "m2", title: "Build the system", description: "Design a simple, repeatable operating rhythm around that focus." },
  { id: "m3", title: "Execute weekly", description: "Ship, measure and adjust every week with accountability." },
];

let mid = 4;

const FORM_FIELDS = ["Full name", "Email", "WhatsApp number", "Message"];

export default function ProgramEditor() {
  const params = useParams();
  const slug = String(params.slug ?? "");

  const [name, setName] = useState("One-Focus");
  const [tagline, setTagline] = useState("trains entrepreneurs");
  const [banner, setBanner] = useState("");
  const [, setAbout] = useState(ABOUT);
  const [modules, setModules] = useState<Module[]>(INITIAL_MODULES);
  const [formHeading, setFormHeading] = useState("Book a Session");
  const [formIntro, setFormIntro] = useState(
    "Enrollment is open while the program runs. Apply below and I'll reach out on WhatsApp."
  );
  const [ctaLabel, setCtaLabel] = useState("Enroll now");

  const setM = (id: string, f: "title" | "description", v: string) =>
    setModules((ms) => ms.map((m) => (m.id === id ? { ...m, [f]: v } : m)));

  return (
    <div>
      <Link
        href="/admin/training"
        className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink"
      >
        ← Back to Programs & Masterclasses
      </Link>
      <EditorHeader
        title={`Edit program: ${name}`}
        description="The program's landing page (in the Programs & Master Classes dropdown) plus its Book-a-Session enrollment form."
        viewHref={`/training/${slug}`}
      />

      {/* Hero */}
      <BlockCard label="Hero">
        <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
          <ImageField value={banner} onChange={setBanner} label="Hero image" boxClass="aspect-video w-full" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Program name" value={name} onChange={setName} />
            <Field label="Tagline" value={tagline} onChange={setTagline} />
          </div>
        </div>
      </BlockCard>

      {/* About */}
      <BlockCard label="About">
        <RichTextEditor initialHTML={ABOUT} onChange={setAbout} />
      </BlockCard>

      {/* What's included */}
      <BlockCard label="What's included" hint="curriculum / modules">
        <div className="space-y-3">
          {modules.map((m) => (
            <div key={m.id} className="flex gap-3 rounded-lg border border-line p-4">
              <div className="flex-1 space-y-3">
                <Field label="Title" value={m.title} onChange={(v) => setM(m.id, "title", v)} />
                <Field label="Description" textarea value={m.description} onChange={(v) => setM(m.id, "description", v)} />
              </div>
              <button
                type="button"
                onClick={() => setModules((ms) => ms.filter((x) => x.id !== m.id))}
                className="h-fit rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                aria-label="Remove module"
              >
                <AdminIcon name="trash" className="h-[18px] w-[18px]" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setModules((ms) => [...ms, { id: `m${mid++}`, title: "", description: "" }])}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
        >
          <AdminIcon name="plus" className="h-4 w-4" /> Add module
        </button>
      </BlockCard>

      {/* Book a Session — enrollment form */}
      <BlockCard
        label="Book a Session"
        tone="amber"
        hint="enrollment form"
        action={
          <Link
            href="/admin/enrollments"
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-brand-green-dark hover:bg-brand-green-soft"
          >
            View enrollments →
          </Link>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Form heading" value={formHeading} onChange={setFormHeading} />
          <Field label="Button label" value={ctaLabel} onChange={setCtaLabel} />
          <div className="sm:col-span-2">
            <Field label="Intro text" textarea value={formIntro} onChange={setFormIntro} />
          </div>
        </div>

        <p className="mt-4 mb-2 text-sm text-ink-soft">
          Fields collected from every applicant:
        </p>
        <div className="flex flex-wrap gap-2">
          {FORM_FIELDS.map((f) => (
            <span key={f} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-ink-soft">
              {f}
            </span>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-faint">
          <AdminIcon name="external" className="h-3.5 w-3.5" />
          Submissions land in the Enrollments screen with a one-click WhatsApp
          link. The form shows only while this program is active.
        </p>
      </BlockCard>
    </div>
  );
}
