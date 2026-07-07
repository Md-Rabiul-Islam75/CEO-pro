import type { ReactNode } from "react";

/** Page header with title, optional description, and a right-aligned action slot. */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/** White surface card. */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-line bg-white ${className}`}>
      {children}
    </div>
  );
}

type PillVariant = "active" | "inactive" | "draft" | "published" | "green" | "blue";

const PILL: Record<PillVariant, string> = {
  active: "bg-brand-green-soft text-brand-green-dark",
  published: "bg-brand-green-soft text-brand-green-dark",
  green: "bg-brand-green-soft text-brand-green-dark",
  blue: "bg-brand-blue-soft text-brand-blue-dark",
  inactive: "bg-slate-100 text-ink-faint",
  draft: "bg-amber-100 text-amber-700",
};

export function StatusPill({
  variant,
  children,
}: {
  variant: PillVariant;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${PILL[variant]}`}
    >
      {children}
    </span>
  );
}

/** Clean iOS-style on/off switch. */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-brand-green" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

/** Primary button styling helper (apply to <button> or <Link>). */
export const btnPrimary =
  "inline-flex items-center gap-1.5 rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-green-dark";

export const btnGhost =
  "inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-brand-blue hover:text-brand-blue";
