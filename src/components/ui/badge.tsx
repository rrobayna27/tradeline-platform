import { cn } from "@/lib/utils";
import { PROJECT_STATUS_COLOR_VAR, PROJECT_STATUS_LABELS } from "@/lib/constants";
import type { HTMLAttributes } from "react";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface-raised px-2.5 py-1 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const colorVar = PROJECT_STATUS_COLOR_VAR[status] ?? "--color-status-proposed";
  const label = PROJECT_STATUS_LABELS[status] ?? status;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-2.5 py-1 text-xs font-semibold tabular-nums",
        className
      )}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: `var(${colorVar})` }}
        aria-hidden
      />
      {label}
    </span>
  );
}

export function SampleDataBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-500",
        className
      )}
      title="Illustrative sample data — not a real project, company, or article."
    >
      Sample data
    </span>
  );
}
