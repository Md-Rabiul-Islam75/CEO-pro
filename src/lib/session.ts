/**
 * Minimal, dependency-free admin session tokens — HMAC-signed with the Web
 * Crypto API so the same code runs in both the Edge middleware and Node route
 * handlers. A token is `base64url(payload).base64url(hmac)`; the payload holds
 * the admin email and an expiry timestamp.
 *
 * The signing secret comes from AUTH_SECRET (set a strong value per deployment).
 */

export const SESSION_COOKIE = "admin_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

const DEFAULT_SECRET = "dev-insecure-secret-change-me";

function secret(): string {
  return process.env.AUTH_SECRET || DEFAULT_SECRET;
}

function b64urlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(str: string): Uint8Array {
  const s = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
  const bin = atob(s + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return new Uint8Array(sig);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export type SessionPayload = { email: string; exp: number };

/** Create a signed session token for the given admin email. */
export async function createSession(
  email: string,
  ttlMs: number = SESSION_TTL_MS
): Promise<string> {
  const payload: SessionPayload = { email, exp: Date.now() + ttlMs };
  const body = b64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = b64urlEncode(await hmac(body));
  return `${body}.${sig}`;
}

/** Verify a token's signature + expiry; returns the payload or null. */
export async function verifySession(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = b64urlEncode(await hmac(body));
  if (!timingSafeEqual(sig, expected)) return null;
  try {
    const payload = JSON.parse(
      new TextDecoder().decode(b64urlDecode(body))
    ) as SessionPayload;
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
