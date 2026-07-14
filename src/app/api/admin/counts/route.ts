import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withSubscribersDefaults } from "@/lib/subscribers";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/counts — counts for the admin sidebar badges: new enrollments,
 * new messages, and total subscribers. (Admin-only; the proxy requires a session.)
 */
export async function GET() {
  const [enrollments, messages, subsRow] = await Promise.all([
    prisma.enrollment.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.setting.findUnique({ where: { key: "subscribers" } }),
  ]);
  const subscribers = withSubscribersDefaults(subsRow?.value).subscribers.length;
  return NextResponse.json({ enrollments, messages, subscribers });
}
