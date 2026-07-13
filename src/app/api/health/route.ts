import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Lightweight liveness probe for Docker/compose healthchecks and load balancers. */
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
