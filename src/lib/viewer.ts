// Who is looking at the page, and what are they allowed to see?
//
// Pro-gated content (GC/sub contact emails, full company names on projects)
// is hidden from anonymous and free-tier visitors and shown to paying Pro
// members. Admins always see everything. See DECISIONS.md — pricing is
// Sub Pro $9/mo, GC Pro $49/mo; the gated contact info is the core paid value.
import { auth } from "@/auth";

export interface Viewer {
  isSignedIn: boolean;
  isPro: boolean;
}

export async function getViewer(): Promise<Viewer> {
  const session = await auth();
  const user = session?.user;
  return {
    isSignedIn: Boolean(user),
    isPro: user ? user.role === "ADMIN" || user.planTier === "PRO" : false,
  };
}
