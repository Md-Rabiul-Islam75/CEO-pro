"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-green";

export default function ContactForm({ subjects }: { subjects: string[] }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: subjects[0] ?? "",
    message: "",
  });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setState("sent");
      } else {
        setState("error");
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setError("Network error. Please try again.");
    }
  }

  if (state === "sent") {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-brand-green-soft bg-brand-green-tint p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green text-white">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="mt-4 text-xl font-extrabold tracking-tight text-ink">
          Message sent
        </h3>
        <p className="mt-2 text-ink-soft">
          Thanks for reaching out — I&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm({ name: "", email: "", subject: subjects[0] ?? "", message: "" });
            setState("idle");
          }}
          className="mt-6 text-sm font-semibold text-brand-green hover:text-brand-green-dark"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Name
          </span>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} placeholder="Your name" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Email
          </span>
          <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} placeholder="you@example.com" />
        </label>
      </div>

      {subjects.length > 0 && (
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Subject
          </span>
          <select value={form.subject} onChange={(e) => set("subject", e.target.value)} className={inputClass}>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Message
        </span>
        <textarea required rows={5} value={form.message} onChange={(e) => set("message", e.target.value)} className={`${inputClass} resize-y`} placeholder="How can I help?" />
      </label>

      {state === "error" && (
        <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand-green px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-brand-green-dark disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
