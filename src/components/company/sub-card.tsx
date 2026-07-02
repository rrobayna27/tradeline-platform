import Link from "next/link";
import { CardHover } from "@/components/ui/card";
import { Badge, SampleDataBadge } from "@/components/ui/badge";
import { CompanyAvatar } from "./company-avatar";
import { ShieldCheck } from "lucide-react";
import type { Subcontractor } from "@/lib/types";

export function SubCard({ sub }: { sub: Subcontractor }) {
  const tradeNames = sub.tradeNames ?? [];

  return (
    <Link href={`/subcontractors/${sub.slug}`}>
      <CardHover className="flex h-full flex-col p-5">
        <div className="mb-3 flex items-center gap-3">
          <CompanyAvatar name={sub.name} className="h-11 w-11" />
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-foreground group-hover:text-accent">{sub.name}</h3>
            <p className="text-xs text-muted-foreground">{tradeNames.join(" · ")}</p>
          </div>
        </div>
        <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">{sub.description}</p>
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          {sub.insuranceVerified && (
            <Badge className="border-accent/30 bg-accent/10 text-accent">
              <ShieldCheck size={12} className="mr-1" /> Insured
            </Badge>
          )}
          {sub.yearsInBusiness && <Badge>{sub.yearsInBusiness} yrs in business</Badge>}
          {sub.isSample && <SampleDataBadge />}
        </div>
      </CardHover>
    </Link>
  );
}
