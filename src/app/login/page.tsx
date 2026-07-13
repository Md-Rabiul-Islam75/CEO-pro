"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminIcon from "@/components/admin/AdminIcon";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-brand-green";

/** Safe post-login destination: only same-site /admin paths. */
function safeNext(): string {
  if (typeof window === "undefined") return "/admin";
  const n = new URLSearchParams(window.location.search).get("next");
  return n && n.startsWith("/admin") ? n : "/admin";
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [state, setState] = useState<"idle" | "signing" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("signing");
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });
      if (res.ok) {
        // Full navigation so the new cookie is picked up by middleware.
        window.location.href = safeNext();
        return;
      }
      const d = await res.json().catch(() => ({}));
      setState("error");
      setError(d.error || "Sign in failed. Please try again.");
    } catch {
      setState("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-blue-tint via-white to-brand-green-tint px-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green text-lg font-extrabold text-white">
            A
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-ink">Admin sign in</h1>
          <p className="mt-1 text-sm text-ink-soft">Enter your credentials to continue.</p>
        </div>

        <form
          onSubmit={submit}
          autoComplete="off"
          className="rounded-2xl border border-line bg-white p-6 shadow-sm"
        >
          {/* Decoy fields absorb aggressive browser/password-manager autofill. */}
          <input type="text" name="username" autoComplete="username" className="hidden" tabIndex={-1} aria-hidden />
          <input type="password" name="password" autoComplete="current-password" className="hidden" tabIndex={-1} aria-hidden />

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              data-lpignore="true"
              data-1p-ignore
              data-form-type="other"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint">Password</span>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-11`}
                placeholder="••••••••"
                autoComplete="new-password"
                data-lpignore="true"
                data-1p-ignore
                data-form-type="other"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-ink-faint hover:text-ink"
              >
                <AdminIcon name={showPw ? "eyeOff" : "eye"} className="h-[18px] w-[18px]" />
              </button>
            </div>
          </label>

          {state === "error" && (
            <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={state === "signing"}
            className="mt-5 w-full rounded-full bg-brand-green px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-brand-green-dark disabled:opacity-60"
          >
            {state === "signing" ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
