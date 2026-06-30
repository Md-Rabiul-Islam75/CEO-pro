"use client";

import { useState } from "react";
import Link from "next/link";
import AdminIcon from "@/components/admin/AdminIcon";
import ImageField from "@/components/admin/ImageField";
import { Card, PageHeader, btnPrimary, btnGhost } from "@/components/admin/ui";

type CompanyCard = {
  id: string;
  title: string;
  description: string;
  badge: string;
  link: string;
  logo?: string; // optional image URL
};
type Group = { id: string; heading: string; cards: CompanyCard[] };

// Pre-filled from the résumé — role-grouped cards, mirroring the
// garyvaynerchuk.com "Builds Businesses" structure. Mock state (no DB yet).
const INITIAL_BANNER = {
  image: "",
  headline:
    "I architect software that powers utilities, telecom, hospitals and banks.",
  intro:
    "ABM Whaiduzzaman is a software architect and technology leader — CTO of Nexalinx and former CEO of Automation Services Ltd, PMP-certified — with 18+ years building large-scale billing, metering and enterprise systems across Asia, Africa and the USA.",
};

const INITIAL_GROUPS: Group[] = [
  {
    id: "g1",
    heading: "Chief Technology Officer",
    cards: [
      {
        id: "c1",
        title: "Nexalinx",
        description:
          "SaaS platforms for healthcare and government — Hospital ERP and Government MIS on a micro-service architecture, HL7 & DICOM compliant. USA & Dhaka.",
        badge: "2022 – Present",
        link: "",
      },
    ],
  },
  {
    id: "g2",
    heading: "Chief Executive Officer",
    cards: [
      {
        id: "c2",
        title: "Automation Services Ltd",
        description:
          "Utility & telecom product company — AMI/MDM, Field Data Management, telecom billing and hospital management solutions delivered across multiple countries.",
        badge: "2020 – 2022",
        link: "",
      },
    ],
  },
  {
    id: "g3",
    heading: "System Consultant",
    cards: [
      {
        id: "c3",
        title: "Ideal Electrical Enterprise",
        description:
          "Smart-metering & prepayment for national utilities (DPDC, DESCO, BREB, NESCO) — HES/AMI, MDM and agent management.",
        badge: "2014 – Present",
        link: "",
      },
      {
        id: "c4",
        title: "Jiangsu Linyang Energy (China)",
        description:
          "STS/CTS vending solutions for Uganda UMEME and CTS for Bangladesh utilities; HES integration.",
        badge: "2018 – 2020",
        link: "",
      },
      {
        id: "c5",
        title: "Shenzhen Inhemeter (China)",
        description:
          "AMI and Meter Data Management systems; led the development team.",
        badge: "2017 – 2018",
        link: "",
      },
    ],
  },
];

let gid = 4;
let cid = 6;

function Field({
  label,
  value,
  onChange,
  textarea,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full resize-y rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-green"
        />
      )}
    </label>
  );
}

export default function BuildsSoftwareEditor() {
  const [banner, setBanner] = useState(INITIAL_BANNER);
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);

  const setG = (id: string, fn: (g: Group) => Group) =>
    setGroups((gs) => gs.map((g) => (g.id === id ? fn(g) : g)));

  const updateCard = (
    gId: string,
    cId: string,
    field: keyof CompanyCard,
    value: string
  ) =>
    setG(gId, (g) => ({
      ...g,
      cards: g.cards.map((c) => (c.id === cId ? { ...c, [field]: value } : c)),
    }));

  return (
    <div>
      <Link
        href="/admin/pages"
        className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink"
      >
        ← Back to Pages
      </Link>

      <PageHeader
        title="Edit: Builds Software"
        description="A banner, then role-grouped company cards (logo · title · description · badge)."
        action={
          <div className="flex gap-2">
            <Link href="/builds-software" target="_blank" className={btnGhost}>
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
        Choose a file to preview it instantly (or paste an image URL). Saving the
        file to the live site activates once Firebase Storage is connected —
        until then, picked files are preview-only. Logos are optional.
      </p>

      {/* ── Banner block ─────────────────────────────── */}
      <Card className="mb-6 p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded bg-brand-blue-tint px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-blue-dark">
            Banner
          </span>
        </div>
        <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
          <ImageField
            value={banner.image}
            onChange={(v) => setBanner((b) => ({ ...b, image: v }))}
            label="Banner image"
            boxClass="aspect-video w-full"
          />
          <div className="space-y-4">
            <Field
              label="Headline / quote"
              value={banner.headline}
              onChange={(v) => setBanner((b) => ({ ...b, headline: v }))}
            />
            <Field
              label="Intro paragraph"
              textarea
              value={banner.intro}
              onChange={(v) => setBanner((b) => ({ ...b, intro: v }))}
            />
          </div>
        </div>
      </Card>

      {/* ── Role groups ──────────────────────────────── */}
      {groups.map((group) => (
        <Card key={group.id} className="mb-6 p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-700">
              Group
            </span>
            <input
              value={group.heading}
              onChange={(e) =>
                setG(group.id, (g) => ({ ...g, heading: e.target.value }))
              }
              className="flex-1 rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-ink outline-none focus:border-brand-green"
            />
            <button
              type="button"
              onClick={() =>
                setGroups((gs) => gs.filter((g) => g.id !== group.id))
              }
              className="rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
              aria-label="Remove group"
            >
              <AdminIcon name="trash" className="h-[18px] w-[18px]" />
            </button>
          </div>

          <div className="space-y-3">
            {group.cards.map((card) => (
              <div
                key={card.id}
                className="flex gap-4 rounded-lg border border-line p-4"
              >
                <ImageField
                  value={card.logo ?? ""}
                  onChange={(v) => updateCard(group.id, card.id, "logo", v)}
                  label="Logo (optional)"
                  boxClass="h-20 w-28"
                />
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="Title"
                    value={card.title}
                    onChange={(v) => updateCard(group.id, card.id, "title", v)}
                  />
                  <Field
                    label="Badge (date / note)"
                    value={card.badge}
                    placeholder="e.g. 2022 – Present, or Acquired by…"
                    onChange={(v) => updateCard(group.id, card.id, "badge", v)}
                  />
                  <div className="sm:col-span-2">
                    <Field
                      label="Description"
                      textarea
                      value={card.description}
                      onChange={(v) =>
                        updateCard(group.id, card.id, "description", v)
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Field
                      label="Link (optional)"
                      value={card.link}
                      placeholder="https://…"
                      onChange={(v) => updateCard(group.id, card.id, "link", v)}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setG(group.id, (g) => ({
                      ...g,
                      cards: g.cards.filter((c) => c.id !== card.id),
                    }))
                  }
                  className="self-start rounded-md p-1.5 text-ink-faint hover:bg-red-50 hover:text-red-500"
                  aria-label="Remove card"
                >
                  <AdminIcon name="trash" className="h-[18px] w-[18px]" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              setG(group.id, (g) => ({
                ...g,
                cards: [
                  ...g.cards,
                  {
                    id: `c${cid++}`,
                    title: "New company",
                    description: "",
                    badge: "",
                    link: "",
                  },
                ],
              }))
            }
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-dark"
          >
            <AdminIcon name="plus" className="h-4 w-4" />
            Add card
          </button>
        </Card>
      ))}

      <button
        type="button"
        onClick={() =>
          setGroups((gs) => [
            ...gs,
            { id: `g${gid++}`, heading: "New Role", cards: [] },
          ])
        }
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-brand-green hover:text-brand-green"
      >
        <AdminIcon name="plus" className="h-4 w-4" />
        Add role group
      </button>
    </div>
  );
}
