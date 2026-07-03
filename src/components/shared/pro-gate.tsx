// Paywall UI for Pro-gated contact info (emails, full company names).
// Server components pass `isPro` from getViewer() in src/lib/viewer.ts and
// render either the real value or one of these locked placeholders. The
// real value is never sent to the browser for non-Pro viewers — gating
// happens server-side, not with CSS tricks a user could undo in dev tools.
import Link from "next/link";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

/** Inline locked placeholder for a single value (an email, a company name). */
export function ProLockedValue({
  label = "Pro members only",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <Link
      href="/join"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-dashed border-accent/40 bg-accent/5 px-2 py-0.5 text-xs font-medium text-accent hover:bg-accent/10",
        className
      )}
    >
      <Lock size={11} aria-hidden /> {label}
    </Link>
  );
}

/** Block-level upsell used where a whole contact section is gated. */
export function ProUpsell({ what }: { what: string }) {
  return (
    <div className="rounded-lg border border-dashed border-accent/40 bg-accent/5 p-3 text-xs text-muted-foreground">
      <p className="mb-2 flex items-center gap-1.5 font-medium text-foreground">
        <Lock size={12} aria-hidden /> {what} is available to Pro members
      </p>
      <Link href="/join" className="font-semibold text-accent hover:underline">
        Upgrade to Pro →
      </Link>
    </div>
  );
}
