import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ingestBidLog } from "@/lib/ingestion/bidlog";

// Batch upserts ~2,500 records — needs more than the 10s default.
export const maxDuration = 60;

export async function POST() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await ingestBidLog();
    return NextResponse.json(summary);
  } catch (err) {
    console.error("Bid log import failed", err);
    return NextResponse.json(
      { error: "Import failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
