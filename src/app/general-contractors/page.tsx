import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { GCCard } from "@/components/company/gc-card";
import { getGeneralContractors } from "@/lib/repositories";

export const metadata: Metadata = {
  title: "General Contractor Directory",
  description: "Browse general contractors active in South Florida construction, with markets served, company size, and current projects.",
};

export default async function GeneralContractorsPage() {
  const gcs = await getGeneralContractors();

  return (
    <Section className="pt-10">
      <div className="mb-8">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-accent">Directory</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">General contractors</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {gcs.length} general contractors tracked across Southeast Florida.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {gcs.map((gc) => (
          <GCCard key={gc.id} gc={gc} />
        ))}
      </div>
    </Section>
  );
}
