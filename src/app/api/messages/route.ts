import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ContactStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

/** GET /api/messages — all contact submissions, newest first. */
export async function GET() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ messages });
}

/** PATCH /api/messages — update a message's status. Body: { id, status }. */
export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  const status = body?.status as ContactStatus;
  if (!id || !["NEW", "READ", "REPLIED"].includes(status)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const updated = await prisma.contactMessage.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json({ message: updated });
}

/** DELETE /api/messages?id=… — delete a message. */
export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  await prisma.contactMessage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
