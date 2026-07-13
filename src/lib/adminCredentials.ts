/**
 * Admin login credentials — read from the environment so the same product can
 * be reused for another client by simply changing these values (no code edits).
 * Defaults are provided for local/first-run use; override in production.
 *
 * Server-only (used by the login route). Do NOT import from the Edge middleware.
 */

export function adminEmail(): string {
  return (process.env.ADMIN_EMAIL || "ceo@gmail.com").trim().toLowerCase();
}

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "amiceo1";
}

/** Constant-time-ish string comparison to avoid trivial timing leaks. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
