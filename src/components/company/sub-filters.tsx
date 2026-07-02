"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select, Input, FieldLabel } from "@/components/ui/form-controls";
import type { County, Trade } from "@/lib/types";
import { useCallback, useTransition } from "react";

export function SubFilters({ counties, trades }: { counties: County[]; trades: Trade[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    },
    [pathname, router, searchParams, startTransition]
  );

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div className="col-span-2">
        <FieldLabel>Company name</FieldLabel>
        <Input
          defaultValue={searchParams.get("name") ?? ""}
          placeholder="Search subcontractors…"
          onChange={(e) => update("name", e.target.value)}
        />
      </div>
      <div>
        <FieldLabel>Trade</FieldLabel>
        <Select defaultValue={searchParams.get("trade") ?? ""} onChange={(e) => update("trade", e.target.value)}>
          <option value="">All trades</option>
          {trades.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <FieldLabel>County served</FieldLabel>
        <Select defaultValue={searchParams.get("county") ?? ""} onChange={(e) => update("county", e.target.value)}>
          <option value="">All counties</option>
          {counties.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <FieldLabel>Min. years in business</FieldLabel>
        <Input
          type="number"
          defaultValue={searchParams.get("minYears") ?? ""}
          onChange={(e) => update("minYears", e.target.value)}
        />
      </div>
    </div>
  );
}
