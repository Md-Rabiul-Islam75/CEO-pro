import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withStatusDefaults } from "@/lib/pageStatus";

export const dynamic = "force-dynamic";

const KEY = "pageStatus";

/** GET /api/page-status — the page publish-status override map. */
export async function GET() {
  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  return NextResponse.json(withStatusDefaults(row?.value));
}

/** PUT /api/page-status — save the page publish-status override map. */
export async function PUT(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const value = withStatusDefaults(body);
  const row = await prisma.setting.upsert({
    where: { key: KEY },
    create: { key: KEY, value },
    update: { value },
  });
  return NextResponse.json(withStatusDefaults(row.value));
}
