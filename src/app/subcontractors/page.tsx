import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { SubCard } from "@/components/company/sub-card";
import { SubFilters } from "@/components/company/sub-filters";
import { getCounties, getTrades, searchSubcontractors } from "@/lib/repositories";
import type { SubcontractorSearchFilters } from "@/lib/types";

export const metadata: Metadata = {
  title: "Subcontractor Directory",
  description: "Search South Florida subcontractors by trade, county, license, years in business, and project type.",
};

export default async function SubcontractorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (key: string) => (typeof sp[key] === "string" ? (sp[key] as string) : undefined);

  const filters: SubcontractorSearchFilters = {
    trade: get("trade"),
    county: get("county"),
    name: get("name"),
    minYears: get("minYears") ? Number(get("minYears")) : undefined,
    pageSize: 24,
  };

  const [{ items, total }, counties, trades] = await Promise.all([
    searchSubcontractors(filters),
    getCounties(),
    getTrades(),
  ]);

  return (
    <Section className="pt-10">
      <div className="mb-8">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-accent">Directory</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Subcontractors</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {total} subcontractors registered across every trade category, from concrete to millwork.
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-border bg-surface p-5">
        <SubFilters counties={counties} trades={trades} />
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No subcontractors match those filters yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((sub) => (
            <SubCard key={sub.id} sub={sub} />
          ))}
        </div>
      )}
    </Section>
  );
}
