"use client";

import { useEffect } from "react";
import { btnGhost } from "./ui";

/** Reusable confirmation modal — a styled replacement for window.confirm(). */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "brand";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  // Close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const danger = tone === "danger";
  const confirmClass = danger
    ? "bg-red-500 hover:bg-red-600"
    : "bg-brand-green hover:bg-brand-green-dark";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-[1px]"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-line bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex gap-4">
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                danger ? "bg-red-50 text-red-500" : "bg-brand-green-soft text-brand-green-dark"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v4M12 17h.01M10.3 3.86l-8.5 14.7A2 2 0 003.5 21.5h17a2 2 0 001.7-2.94l-8.5-14.7a2 2 0 00-3.4 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-ink">{title}</h2>
              {message && <p className="mt-1 text-sm leading-relaxed text-ink-soft">{message}</p>}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-line bg-slate-50 px-6 py-4">
          <button type="button" onClick={onCancel} className={btnGhost}>
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            autoFocus
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
