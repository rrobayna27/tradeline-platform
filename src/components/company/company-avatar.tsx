import { cn } from "@/lib/utils";

const PALETTE = ["bg-navy-900", "bg-teal-600", "bg-amber-500"];

function hashIndex(input: string, mod: number) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) hash = (hash * 31 + input.charCodeAt(i)) % 997;
  return hash % mod;
}

export function CompanyAvatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .filter((w) => w.length > 2 || /[A-Z]/.test(w[0]))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const color = PALETTE[hashIndex(name, PALETTE.length)];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white",
        color,
        className
      )}
    >
      {initials || name.slice(0, 2).toUpperCase()}
    </div>
  );
}
