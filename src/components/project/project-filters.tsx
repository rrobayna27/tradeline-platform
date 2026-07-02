"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select, Input, FieldLabel } from "@/components/ui/form-controls";
import { PROJECT_STATUS_LABELS, PROJECT_TYPE_LABELS } from "@/lib/constants";
import type { City, County, Developer, GeneralContractor, Trade } from "@/lib/types";
import { useCallback, useTransition } from "react";

export function ProjectFilters({
  counties,
  cities,
  developers,
  generalContractors,
  trades,
}: {
  counties: County[];
  cities: City[];
  developers: Developer[];
  generalContractors: GeneralContractor[];
  trades: Trade[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    },
    [pathname, router, searchParams, startTransition]
  );

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <div className="col-span-2 sm:col-span-3 lg:col-span-2 xl:col-span-2">
        <FieldLabel>Keyword</FieldLabel>
        <Input
          defaultValue={searchParams.get("keyword") ?? ""}
          placeholder="Project name, address…"
          onChange={(e) => update("keyword", e.target.value)}
        />
      </div>
      <div>
        <FieldLabel>County</FieldLabel>
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
        <FieldLabel>City</FieldLabel>
        <Select defaultValue={searchParams.get("city") ?? ""} onChange={(e) => update("city", e.target.value)}>
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <FieldLabel>Status</FieldLabel>
        <Select defaultValue={searchParams.get("status") ?? ""} onChange={(e) => update("status", e.target.value)}>
          <option value="">All statuses</option>
          {Object.entries(PROJECT_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <FieldLabel>Project type</FieldLabel>
        <Select defaultValue={searchParams.get("projectType") ?? ""} onChange={(e) => update("projectType", e.target.value)}>
          <option value="">All types</option>
          {Object.entries(PROJECT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <FieldLabel>Developer</FieldLabel>
        <Select defaultValue={searchParams.get("developer") ?? ""} onChange={(e) => update("developer", e.target.value)}>
          <option value="">All developers</option>
          {developers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <FieldLabel>General contractor</FieldLabel>
        <Select
          defaultValue={searchParams.get("generalContractor") ?? ""}
          onChange={(e) => update("generalContractor", e.target.value)}
        >
          <option value="">All GCs</option>
          {generalContractors.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <FieldLabel>Trade needed</FieldLabel>
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
        <FieldLabel>Completion year</FieldLabel>
        <Input
          type="number"
          placeholder="2027"
          defaultValue={searchParams.get("completionYear") ?? ""}
          onChange={(e) => update("completionYear", e.target.value)}
        />
      </div>
    </div>
  );
}
