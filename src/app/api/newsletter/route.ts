import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });

// Production note: once Prisma is wired to a live Postgres instance (see
// src/lib/types.ts for why it isn't in this sandbox build), this handler
// should upsert into the NewsletterSubscriber model, e.g.:
//
//   await prisma.newsletterSubscriber.upsert({
//     where: { email },
//     update: { isActive: true },
//     create: { email },
//   });
//
// For now it validates input and returns success so the UI flow (and any
// integration tests around it) can be built and verified end to end.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
