"use client";

import { useEffect, useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Card, PageHeader, StatusPill } from "@/components/admin/ui";

type Status = "NEW" | "READ" | "REPLIED";
type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: Status;
  createdAt: string;
};

const PILL: Record<Status, "draft" | "blue" | "active"> = {
  NEW: "draft",
  READ: "blue",
  REPLIED: "active",
};

function when(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<Message | null>(null);

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((d) => setMessages(Array.isArray(d.messages) ? d.messages : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setStatus = (id: string, status: Status) => {
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, status } : m)));
    fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    }).catch(() => {});
  };

  const remove = (id: string) => {
    setMessages((ms) => ms.filter((m) => m.id !== id));
    fetch(`/api/messages?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
  };

  const unread = messages.filter((m) => m.status === "NEW").length;

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Submissions from the public contact form. Reply by email and track status."
        action={
          unread > 0 ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
              {unread} new
            </span>
          ) : undefined
        }
      />

      {loading ? (
        <p className="text-sm text-ink-faint">Loading…</p>
      ) : messages.length === 0 ? (
        <Card className="p-10 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-ink-faint">
            <AdminIcon name="mail" className="h-6 w-6" />
          </span>
          <p className="mt-3 font-semibold text-ink">No messages yet</p>
          <p className="mt-1 text-sm text-ink-faint">
            Submissions from the contact form will show up here.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <Card
              key={m.id}
              className={`p-5 ${m.status === "NEW" ? "border-l-4 border-l-brand-green" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-ink">{m.name}</p>
                    <StatusPill variant={PILL[m.status]}>{m.status}</StatusPill>
                  </div>
                  <a href={`mailto:${m.email}`} className="text-sm text-brand-blue hover:underline">
                    {m.email}
                  </a>
                  {m.subject && (
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                      {m.subject}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-ink-faint">{when(m.createdAt)}</span>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
                {m.message}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                <a
                  href={`mailto:${m.email}?subject=${encodeURIComponent(
                    "Re: " + (m.subject || "your message")
                  )}`}
                  onClick={() => m.status !== "REPLIED" && setStatus(m.id, "REPLIED")}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-green px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-green-dark"
                >
                  <AdminIcon name="external" className="h-3.5 w-3.5" /> Reply
                </a>
                {m.status === "NEW" && (
                  <button
                    type="button"
                    onClick={() => setStatus(m.id, "READ")}
                    className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-brand-blue hover:text-brand-blue"
                  >
                    Mark read
                  </button>
                )}
                {m.status !== "NEW" && (
                  <button
                    type="button"
                    onClick={() => setStatus(m.id, "NEW")}
                    className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-brand-blue hover:text-brand-blue"
                  >
                    Mark unread
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPendingDelete(m)}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-faint hover:bg-red-50 hover:text-red-500"
                >
                  <AdminIcon name="trash" className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete message"
        message={
          pendingDelete
            ? `Delete the message from ${pendingDelete.name}? This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) remove(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
