import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <span className="relative flex h-6 w-6 items-center justify-center rounded-md bg-navy-900 dark:bg-teal-600">
        <span className="h-2 w-2 rounded-sm bg-amber-500" />
      </span>
      <span className="text-lg leading-none">
        Tradeline
      </span>
    </span>
  );
}
