import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ingestMiamiDadePermits } from "@/lib/ingestion/miami-dade-permits";

// Vercel: give this route more time than the 10s default, since it does a
// remote fetch plus a batch of upserts.
export const maxDuration = 60;

async function isAuthorized(request: Request) {
  // Allow a scheduled Vercel Cron job (see vercel.json) to call this route
  // using a shared secret instead of a logged-in session.
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;

  const session = await auth();
  return session?.user?.role === "ADMIN";
}

async function handle(request: Request) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await ingestMiamiDadePermits();
    return NextResponse.json(summary);
  } catch (err) {
    console.error("Miami-Dade permit ingestion failed", err);
    return NextResponse.json(
      { error: "Ingestion failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return handle(request);
}

// Vercel Cron sends GET requests to the configured path.
export async function GET(request: Request) {
  return handle(request);
}
