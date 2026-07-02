import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  role: z.enum(["SUB", "GC"]),
  companyName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
});

// Production note: once Prisma is live, this should create a User row
// (role: SUB | GC) plus a draft Subcontractor/GeneralContractor profile for
// the founder/ops team to verify before publishing — see DECISIONS.md
// guardrail #5 ("seed then consent").
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
