"use client";

import { useState } from "react";
import Link from "next/link";
import AdminIcon from "@/components/admin/AdminIcon";
import ImageField from "@/components/admin/ImageField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Card, PageHeader, btnPrimary, btnGhost } from "@/components/admin/ui";

type Milestone = { id: string; image: string; year: string; text: string };

// Pre-filled timeline from the résumé. Mock state (no DB yet).
const INITIAL: Milestone[] = [
  {
    id: "m1",
    image: "",
    year: "2007",
    text: "Graduated in Computer Science & Engineering from East West University and began his career as a programmer.",
  },
  {
    id: "m2",
    image: "",
    year: "2016",
    text: "Completed his MS at Jahangirnagar University — thesis on a Unified Electricity Pre-payment System — while leading telecom billing teams at IBCS-PRIMAX.",
  },
  {
    id: "m3",
    image: "",
    year: "2018",
    text: "Designed metering & STS/CTS vending solutions across China and Bangladesh, including prepayment systems for Uganda's UMEME utility.",
  },
  {
    id: "m4",
    image: "",
    year: "2020",
    text: "Became CEO of Automation Services Ltd, delivering AMI/MDM, telecom billing and hospital management solutions internationally.",
  },
  {
    id: "m5",
    image: "",
    year: "2022",
    text: "Joined Nexalinx as CTO, architecting Hospital ERP and Government MIS on a micro-service, HL7/DICOM-compliant SaaS platform across the USA and Bangladesh.",
  },
];

const INITIAL_STORY = `<h2>ABM Whaiduzzaman's Story</h2>
<p>ABM Whaiduzzaman is a software architect and technology leader based in Dhaka, Bangladesh. Over more than 18 years he has grown from a programmer into a CTO and CEO, designing large-scale systems for utilities, telecom, healthcare and banking across Bangladesh, China, the USA and Africa.</p>
<p>He began his career in 2007 as a programmer, and at IBCS-PRIMAX rose to System Analyst and Manager — building telecom billing (ICX/IGW) and roaming systems for operators such as GrameenPhone. In 2016 he completed his MS at Jahangirnagar University with a thesis on a Unified Electricity Pre-payment System.</p>
<p>He went on to lead metering and prepayment platforms at Shenzhen Inhemeter and Jiangsu Linyang in China — including STS/CTS vending for Uganda's UMEME. As CEO of Automation Services Ltd he delivered AMI/MDM, telecom billing and hospital management solutions internationally, and since 2022 he serves as CTO of Nexalinx, architecting Hospital ERP and Government MIS on a micro-service, HL7/DICOM-compliant SaaS platform.</p>
<p>He is PMP-certified, a member of BASIS and the Bangladesh Computer Society, and passionate about problem-solving, generating new ideas, and training the next generation of entrepreneurs through One-Focus.</p>`;

let mid = 6;

export default function MyStoryEditor() {
  const [items, setItems] = useState<Milestone[]>(INITIAL);
  // Story HTML kept in state for save (RichTextEditor is uncontrolled internally).
  const [, setStory] = useState(INITIAL_STORY);

  const update = (id: string, field: keyof Milestone, value: string) =>
    setItems((xs) =>
      xs.map((x) => (x.id === id ? { ...x, [field]: value } : x))
    );

  const move = (id: string, dir: -1 | 1) =>
    setItems((xs) => {
      const i = xs.findIndex((x) => x.id === id);
      const j = i + dir;
      if (j < 0 || j >= xs.length) return xs;
      const copy = [...xs];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  return (
    <div>
      <Link
        href="/admin/pages"
        className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink"
      >
        ← Back to Pages
      </Link>

      <PageHeader
        title="Edit: My Story"
        description="A timeline carousel (image · year · text), then the full story with rich-text formatting."
        action={
          <div className="flex gap-2">
            <Link href="/my-story" target="_blank" className={btnGhost}>
              <AdminIcon name="external" className="h-4 w-4" />
              View page
            </Link>
            <button type="button" className={btnPrimary}>
              Save changes
            </button>
          </div>
        }
      />

      <p className="mb-5 rounded-lg border border-brand-blue-soft bg-brand-blue-tint px-3 py-2 text-xs text-brand-blue-dark">
        Choose a file to preview an image (or paste a URL). Saving images to the
        live site activates with Firebase Storage.
      </p>

      {/* ── Timeline carousel ─────────────────────────── */}
      <Card className="mb-6 p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded bg-brand-green-soft px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-green-dark">
            Timeline
          </span>
          <span className="text-xs text-ink-faint">
            Each card is a slide in the carousel.
          </span>
        </div>

        <div className="space-y-3">
          {items.map((m, i) => (
            <div key={m.id} className="flex gap-4 rounded-lg border border-line p-4">
              <div className="flex flex-col text-ink-faint">
                <button
                  type="button"
                  onClick={() => move(m.id, -1)}
                  disabled={i === 0}
                  className="rounded p-0.5 hover:text-ink disabled:opacity-30"
                  aria-label="Move up"
                >
                  <AdminIcon name="chevronUp" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(m.id, 1)}
                  disabled={i === items.length - 1}
                  className="rounded p-0.5 hover:text-ink disabled:opacity-30"
                  aria-label="Move down"
                >
                  <AdminIcon name="chevronDown" className="h-4 w-4" />
                </button>
              </div>

              <ImageField
                value={m.image}
                onChange={(v) => update(m.id, "image", v)}
                label="Photo"
                boxClass="aspect-[3/4] w-28"
              />

              <div className="flex-1 space-y-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    Year
                  </span>
                  <input
                    value={m.year}
                    onChange={(e) => update(m.id, "year", e.target.value)}
                    className="w-32 rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold text-ink outline-none focus:border-brand-green"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    Text
                  </span>
                  <textarea
                    value={m.text}
                    onChange={(e) => update(m.id, "text", e.target.value)}
                    rows={3}
                    className="w-full resize-y rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => setItems((xs) => xs.filter((x) => x.id !== m.id))}
                className="self-start rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                aria-label="Remove milestone"
              >
                <AdminIcon name="trash" className="h-[18px] w-[18px]" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setItems((xs) => [
              ...xs,
              { id: `m${mid++}`, image: "", year: "", text: "" },
            ])
          }
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:text-brand-green-dark"
        >
          <AdminIcon name="plus" className="h-4 w-4" />
          Add milestone
        </button>
      </Card>

      {/* ── Story (rich text) ─────────────────────────── */}
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded bg-brand-blue-tint px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-blue-dark">
            Story
          </span>
          <span className="text-xs text-ink-faint">
            Write freely — use headings, bold, bullets and links.
          </span>
        </div>
        <RichTextEditor initialHTML={INITIAL_STORY} onChange={setStory} />
      </Card>
    </div>
  );
}
