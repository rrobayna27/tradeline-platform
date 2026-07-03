import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateArticle } from "@/lib/repositories";

const ALLOWED_FIELDS = [
  "headline",
  "summary",
  "body",
  "category",
  "status",
  "location",
  "timelineNote",
  "whyItMatters",
  "marketImpact",
  "metaTitle",
  "metaDescription",
] as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) data[key] = body[key];
  }

  try {
    // `data` is a whitelisted subset of the request body (see ALLOWED_FIELDS
    // above); this cast reflects that boundary rather than re-deriving the
    // same shape structurally.
    const article = await updateArticle(id, data as Parameters<typeof updateArticle>[1]);
    return NextResponse.json(article);
  } catch (err) {
    console.error("Failed to update article", err);
    return NextResponse.json(
      { error: "Failed to update article", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
