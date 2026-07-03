import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { runNewsroomGeneration } from "@/lib/newsroom/generate-articles";

export const maxDuration = 60;

async function isAuthorized(request: Request) {
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
    const summary = await runNewsroomGeneration();
    return NextResponse.json(summary);
  } catch (err) {
    console.error("Newsroom generation failed", err);
    return NextResponse.json(
      { error: "Newsroom generation failed", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return handle(request);
}

export async function GET(request: Request) {
  return handle(request);
}
