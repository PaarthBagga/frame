import { NextRequest, NextResponse } from "next/server";
import { resetStore } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Called nightly by the Vercel cron in vercel.json to put the live demo back
// to its sample data. Vercel sends "Authorization: Bearer <CRON_SECRET>".
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (process.env.DEMO_MODE !== "1") {
    return NextResponse.json({ error: "Reset is only allowed in demo mode" }, { status: 403 });
  }
  await resetStore();
  return NextResponse.json({ ok: true });
}
