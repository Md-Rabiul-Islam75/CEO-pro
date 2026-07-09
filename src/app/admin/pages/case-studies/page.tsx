"use client";

import { useEffect, useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import { SortableList, SortableItem } from "@/components/admin/Sortable";
import { usePageStatus } from "@/components/admin/usePageStatus";
import {
  DEFAULT_CASE_STUDIES,
  withCaseStudiesDefaults,
  type Client,
  type Study,
} from "@/lib/pages/caseStudies";

let clid = 0;
let sid = 0;
const clUid = () => `cl-${Date.now().toString(36)}-${clid++}`;
const sUid = () => `s-${Date.now().toString(36)}-${sid++}`;

export default function CaseStudiesEditor() {
  const [banner, setBanner] = useState(DEFAULT_CASE_STUDIES.banner);
  const [clients, setClients] = useState<Client[]>(DEFAULT_CASE_STUDIES.clients);
  const [studies, setStudies] = useState<Study[]>(DEFAULT_CASE_STUDIES.studies);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const ps = usePageStatus("/case-studies");

  useEffect(() => {
    fetch("/api/pages/case-studies")
      .then((r) => r.json())
      .then((d) => {
        const c = withCaseStudiesDefaults(d);
        setBanner(c.banner);
        setClients(c.clients);
        setStudies(c.studies);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setClient = (id: string, f: keyof Client, v: string) =>
    setClients((cs) => cs.map((c) => (c.id === id ? { ...c, [f]: v } : c)));
  const setStudy = (id: string, f: keyof Study, v: string) =>
    setStudies((ss) => ss.map((s) => (s.id === id ? { ...s, [f]: v } : s)));

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/pages/case-studies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banner, clients, studies }),
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
        title="Edit: Clients & Case Studies"
        description="A client logo wall, plus detailed case-study cards."
        viewHref="/case-studies"
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
          <BlockCard label="Banner">
            <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
              <ImageField
                value={banner.image}
                onChange={(v) => setBanner((b) => ({ ...b, image: v }))}
                label="Banner image"
                boxClass="aspect-video w-full"
              />
              <div className="space-y-4">
                <Field label="Headline" value={banner.headline} onChange={(v) => setBanner((b) => ({ ...b, headline: v }))} />
                <Field label="Intro" textarea value={banner.intro} onChange={(v) => setBanner((b) => ({ ...b, intro: v }))} />
              </div>
            </div>
          </BlockCard>

          {/* Client logo wall */}
          <BlockCard label="Client logos" tone="slate" hint="logo · name · link">
            <div className="grid gap-3 sm:grid-cols-2">
              {clients.map((c) => (
                <div key={c.id} className="flex items-center gap-3 rounded-lg border border-line p-3">
                  <ImageField value={c.logo} onChange={(v) => setClient(c.id, "logo", v)} label="Logo" boxClass="h-14 w-20" />
                  <div className="flex-1 space-y-2">
                    <Field label="Name" value={c.name} onChange={(v) => setClient(c.id, "name", v)} />
                    <Field label="Link" value={c.link} placeholder="https://…" onChange={(v) => setClient(c.id, "link", v)} />
                  </div>
                  <button type="button" onClick={() => setClients((cs) => cs.filter((x) => x.id !== c.id))} className="h-fit rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500" aria-label="Remove client">
                    <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setClients((cs) => [...cs, { id: clUid(), logo: "", name: "New client", link: "" }])} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark">
              <AdminIcon name="plus" className="h-4 w-4" /> Add client
            </button>
          </BlockCard>

          {/* Case study cards */}
          <BlockCard label="Case studies" hint="drag to reorder">
            <SortableList
              ids={studies.map((s) => s.id)}
              onReorder={(ids) =>
                setStudies((ss) => {
                  const by = new Map(ss.map((s) => [s.id, s]));
                  return ids.map((i) => by.get(i)!).filter(Boolean);
                })
              }
            >
              <div className="space-y-3">
                {studies.map((s) => (
                  <SortableItem key={s.id} id={s.id}>
                    {({ setNodeRef, style, handleProps, isDragging }) => (
                      <div ref={setNodeRef} style={style} className={`flex gap-4 rounded-lg border border-line bg-white p-4 ${isDragging ? "shadow-lg ring-1 ring-brand-blue-soft" : ""}`}>
                        <button {...handleProps} className="mt-1 h-fit cursor-grab touch-none rounded p-1 text-ink-faint hover:bg-slate-100 active:cursor-grabbing" aria-label="Drag">
                          <AdminIcon name="grip" className="h-4 w-4" />
                        </button>
                        <ImageField value={s.image} onChange={(v) => setStudy(s.id, "image", v)} label="Image" boxClass="h-20 w-28" />
                        <div className="grid flex-1 gap-3 sm:grid-cols-2">
                          <Field label="Client" value={s.client} onChange={(v) => setStudy(s.id, "client", v)} />
                          <Field label="Title" value={s.title} onChange={(v) => setStudy(s.id, "title", v)} />
                          <div className="sm:col-span-2">
                            <Field label="Summary" textarea value={s.summary} onChange={(v) => setStudy(s.id, "summary", v)} />
                          </div>
                          <Field label="Link" value={s.link} placeholder="https://…" onChange={(v) => setStudy(s.id, "link", v)} className="sm:col-span-2" />
                        </div>
                        <button type="button" onClick={() => setStudies((ss) => ss.filter((x) => x.id !== s.id))} className="h-fit rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500" aria-label="Remove case study">
                          <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                        </button>
                      </div>
                    )}
                  </SortableItem>
                ))}
              </div>
            </SortableList>
            <button type="button" onClick={() => setStudies((ss) => [...ss, { id: sUid(), image: "", client: "", title: "New case study", summary: "", link: "" }])} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark">
              <AdminIcon name="plus" className="h-4 w-4" /> Add case study
            </button>
          </BlockCard>
        </>
      )}
    </div>
  );
}
