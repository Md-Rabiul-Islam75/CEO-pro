"use client";

import { useEffect, useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import EditorHeader from "@/components/admin/EditorHeader";
import BlockCard from "@/components/admin/BlockCard";
import Field from "@/components/admin/Field";
import ImageField from "@/components/admin/ImageField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { usePageStatus } from "@/components/admin/usePageStatus";
import {
  DEFAULT_SPEAKING,
  withSpeakingDefaults,
  type SpeakingEvent,
  type Talk,
} from "@/lib/pages/speaking";

let seq = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${seq++}`;

export default function SpeakingEditor() {
  const [hero, setHero] = useState(DEFAULT_SPEAKING.hero);
  const [intro, setIntro] = useState(DEFAULT_SPEAKING.intro);
  const [topics, setTopics] = useState<string[]>(DEFAULT_SPEAKING.topics);
  const [events, setEvents] = useState<SpeakingEvent[]>(DEFAULT_SPEAKING.events);
  const [talks, setTalks] = useState<Talk[]>(DEFAULT_SPEAKING.talks);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const ps = usePageStatus("/speaking");

  useEffect(() => {
    fetch("/api/pages/speaking")
      .then((r) => r.json())
      .then((d) => {
        const c = withSpeakingDefaults(d);
        setHero(c.hero);
        setIntro(c.intro);
        setTopics(c.topics);
        setEvents(c.events);
        setTalks(c.talks);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setEvent = (id: string, f: keyof SpeakingEvent, v: string) =>
    setEvents((xs) => xs.map((x) => (x.id === id ? { ...x, [f]: v } : x)));
  const setTalk = (id: string, f: keyof Talk, v: string) =>
    setTalks((xs) => xs.map((x) => (x.id === id ? { ...x, [f]: v } : x)));

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/pages/speaking", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero, intro, topics: topics.filter(Boolean), events, talks }),
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
        title="Edit: Speaking & Consulting"
        description="Hero, speaking intro, topics, upcoming events, past talks, and a booking CTA."
        viewHref="/speaking"
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
          {/* Hero */}
          <BlockCard label="Hero">
            <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
              <ImageField
                value={hero.image}
                onChange={(v) => setHero((h) => ({ ...h, image: v }))}
                label="Hero image"
                boxClass="aspect-video w-full"
              />
              <div className="space-y-4">
                <Field label="Headline" value={hero.headline} onChange={(v) => setHero((h) => ({ ...h, headline: v }))} />
                <Field label="Video URL (optional)" value={hero.video} onChange={(v) => setHero((h) => ({ ...h, video: v }))} placeholder="YouTube link — plays muted behind the hero" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Button label" value={hero.ctaLabel} onChange={(v) => setHero((h) => ({ ...h, ctaLabel: v }))} />
                  <Field label="Button link" value={hero.ctaLink} onChange={(v) => setHero((h) => ({ ...h, ctaLink: v }))} placeholder="/contact or https://…" />
                </div>
              </div>
            </div>
          </BlockCard>

          {/* Intro */}
          <BlockCard label="Intro" hint="what you speak & consult on">
            <RichTextEditor initialHTML={intro} onChange={setIntro} />
          </BlockCard>

          {/* Topics */}
          <BlockCard label="Topics" hint="what I speak on — one per line">
            <div className="space-y-2">
              {topics.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={t}
                    onChange={(e) => setTopics((xs) => xs.map((x, j) => (j === i ? e.target.value : x)))}
                    className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
                  />
                  <button
                    type="button"
                    onClick={() => setTopics((xs) => xs.filter((_, j) => j !== i))}
                    className="rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove topic"
                  >
                    <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setTopics((xs) => [...xs, "New topic"])}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
            >
              <AdminIcon name="plus" className="h-4 w-4" /> Add topic
            </button>
          </BlockCard>

          {/* Upcoming events */}
          <BlockCard label="Upcoming events" hint="title · date · location · link">
            <div className="space-y-3">
              {events.map((e) => (
                <div key={e.id} className="flex gap-3 rounded-lg border border-line p-4">
                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    <Field label="Title" value={e.title} onChange={(v) => setEvent(e.id, "title", v)} />
                    <Field label="Date" value={e.date} onChange={(v) => setEvent(e.id, "date", v)} placeholder="12 Aug 2026" />
                    <Field label="Location" value={e.location} onChange={(v) => setEvent(e.id, "location", v)} />
                    <Field label="Link" value={e.link} onChange={(v) => setEvent(e.id, "link", v)} placeholder="https://…" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setEvents((xs) => xs.filter((x) => x.id !== e.id))}
                    className="h-fit rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove event"
                  >
                    <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setEvents((xs) => [...xs, { id: uid("ev"), title: "New event", date: "", location: "", link: "" }])}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
            >
              <AdminIcon name="plus" className="h-4 w-4" /> Add event
            </button>
          </BlockCard>

          {/* Past talks */}
          <BlockCard label="Watch past talks" hint="title · YouTube link">
            <div className="space-y-3">
              {talks.map((t) => (
                <div key={t.id} className="flex gap-3 rounded-lg border border-line p-4">
                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    <Field label="Title" value={t.title} onChange={(v) => setTalk(t.id, "title", v)} />
                    <Field label="YouTube URL" value={t.video} onChange={(v) => setTalk(t.id, "video", v)} placeholder="https://youtube.com/watch?v=…" />
                    <Field label="Thumbnail URL (optional)" value={t.thumbnail} onChange={(v) => setTalk(t.id, "thumbnail", v)} className="sm:col-span-2" placeholder="auto from YouTube if blank" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setTalks((xs) => xs.filter((x) => x.id !== t.id))}
                    className="h-fit rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                    aria-label="Remove talk"
                  >
                    <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setTalks((xs) => [...xs, { id: uid("tk"), title: "New talk", video: "", thumbnail: "", link: "" }])}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
            >
              <AdminIcon name="plus" className="h-4 w-4" /> Add talk
            </button>
          </BlockCard>
        </>
      )}
    </div>
  );
}
