import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/** POST /api/contact — a public contact-form submission. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = str(body.name).slice(0, 200);
  const email = str(body.email).slice(0, 200);
  const subject = str(body.subject).slice(0, 200);
  const message = str(body.message).slice(0, 5000);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are required." },
      { status: 400 }
    );
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  await prisma.contactMessage.create({
    data: { name, email, subject: subject || null, message },
  });

  return NextResponse.json({ ok: true });
}
