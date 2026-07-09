"use client";

import type { PageStatus } from "@/lib/pageStatus";

/** Clear segmented control for a page's Published / Draft status. */
export default function StatusToggle({
  value,
  onChange,
}: {
  value: PageStatus;
  onChange: (v: PageStatus) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-line bg-white p-0.5">
      <button
        type="button"
        onClick={() => onChange("PUBLISHED")}
        aria-pressed={value === "PUBLISHED"}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
          value === "PUBLISHED"
            ? "bg-brand-green text-white shadow-sm"
            : "text-ink-faint hover:text-ink"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            value === "PUBLISHED" ? "bg-white" : "bg-brand-green"
          }`}
        />
        Published
      </button>
      <button
        type="button"
        onClick={() => onChange("DRAFT")}
        aria-pressed={value === "DRAFT"}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
          value === "DRAFT"
            ? "bg-amber-500 text-white shadow-sm"
            : "text-ink-faint hover:text-ink"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            value === "DRAFT" ? "bg-white" : "bg-amber-500"
          }`}
        />
        Draft
      </button>
    </div>
  );
}
