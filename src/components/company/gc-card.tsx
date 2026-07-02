import Link from "next/link";
import { CardHover } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompanyAvatar } from "./company-avatar";
import { METRO_LABELS } from "@/lib/constants";
import type { GeneralContractor } from "@/lib/types";

export function GCCard({ gc }: { gc: GeneralContractor }) {
  return (
    <Link href={`/general-contractors/${gc.slug}`}>
      <CardHover className="flex h-full flex-col p-5">
        <div className="mb-3 flex items-center gap-3">
          <CompanyAvatar name={gc.name} className="h-11 w-11" />
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-foreground group-hover:text-accent">{gc.name}</h3>
            <p className="text-xs text-muted-foreground">
              {gc.marketsServed.map((m) => METRO_LABELS[m]).join(", ")}
            </p>
          </div>
        </div>
        <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">{gc.description}</p>
        <div className="flex items-center gap-2 border-t border-border pt-3">
          {gc.isClaimed && <Badge className="border-accent/30 bg-accent/10 text-accent">Verified</Badge>}
          {gc.planTier === "PRO" && <Badge className="border-highlight/40 bg-highlight/10 text-highlight">Pro</Badge>}
        </div>
      </CardHover>
    </Link>
  );
}
