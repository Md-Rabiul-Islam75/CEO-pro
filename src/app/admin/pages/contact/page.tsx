"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminIcon from "@/components/admin/AdminIcon";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import { Toggle } from "@/components/admin/ui";
import { usePageStatus } from "@/components/admin/usePageStatus";
import { DEFAULT_CONTACT, withContactDefaults } from "@/lib/pages/contact";

export default function ContactEditor() {
  const [heading, setHeading] = useState(DEFAULT_CONTACT.heading);
  const [intro, setIntro] = useState(DEFAULT_CONTACT.intro);
  const [showForm, setShowForm] = useState(DEFAULT_CONTACT.showForm);
  const [subjects, setSubjects] = useState<string[]>(DEFAULT_CONTACT.subjects);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const ps = usePageStatus("/contact");

  useEffect(() => {
    fetch("/api/pages/contact")
      .then((r) => r.json())
      .then((d) => {
        const c = withContactDefaults(d);
        setHeading(c.heading);
        setIntro(c.intro);
        setShowForm(c.showForm);
        setSubjects(c.subjects);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/pages/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heading, intro, showForm, subjects: subjects.filter(Boolean) }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <EditorHeader
        title="Edit: Contact"
        description="The contact page heading, intro, and form. Phone, email, address and social links come from Site Settings."
        viewHref="/contact"
        onSave={save}
        saving={saving}
        saved={saved}
        status={ps.status}
        onStatusChange={ps.change}
      />

      {loading ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : (
        <>
          <p className="mb-5 flex flex-wrap items-center gap-1 rounded-lg border border-brand-blue-soft bg-brand-blue-tint px-3 py-2 text-xs text-brand-blue-dark">
            Phone, email, address and social links are managed in
            <Link href="/admin/settings" className="font-semibold underline">
              Site Settings
            </Link>
            . Form submissions arrive in
            <Link href="/admin/messages" className="font-semibold underline">
              Messages
            </Link>
            .
          </p>

          <BlockCard label="Header">
            <div className="space-y-4">
              <Field label="Heading" value={heading} onChange={setHeading} />
              <Field label="Intro" textarea value={intro} onChange={setIntro} />
            </div>
          </BlockCard>

          <BlockCard label="Contact form">
            <label className="mb-4 flex items-center gap-3 text-sm font-medium text-ink">
              <Toggle checked={showForm} onChange={() => setShowForm((v) => !v)} label="Show contact form" />
              Show the contact form
            </label>

            {showForm && (
              <>
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  Subject options
                </span>
                <div className="space-y-2">
                  {subjects.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={s}
                        onChange={(e) => setSubjects((xs) => xs.map((x, j) => (j === i ? e.target.value : x)))}
                        className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
                      />
                      <button
                        type="button"
                        onClick={() => setSubjects((xs) => xs.filter((_, j) => j !== i))}
                        className="rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                        aria-label="Remove subject"
                      >
                        <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setSubjects((xs) => [...xs, "New subject"])}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
                >
                  <AdminIcon name="plus" className="h-4 w-4" /> Add subject
                </button>
              </>
            )}
          </BlockCard>
        </>
      )}
    </div>
  );
}
