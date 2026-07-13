import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSession, SESSION_COOKIE, SESSION_TTL_MS } from "@/lib/session";
import { adminEmail, adminPassword, safeEqual } from "@/lib/adminCredentials";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/auth/login — verify credentials, set a signed session cookie. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  // Trim surrounding whitespace on both sides so autofill/paste artifacts
  // (a stray trailing space) can't cause a false "invalid password".
  const password = typeof body?.password === "string" ? body.password.trim() : "";

  const ok =
    safeEqual(email, adminEmail()) && safeEqual(password, adminPassword().trim());

  // Small fixed delay to blunt brute-forcing.
  await new Promise((r) => setTimeout(r, 300));

  if (!ok) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const token = await createSession(adminEmail());
  // Secure flag only when actually served over HTTPS (so local http still works).
  const isHttps =
    new URL(req.url).protocol === "https:" ||
    req.headers.get("x-forwarded-proto") === "https";

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });

  return NextResponse.json({ ok: true });
}
