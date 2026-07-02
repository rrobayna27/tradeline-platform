import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { IngestionTrigger } from "./ingestion-trigger";

export default function AdminIngestionPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <AdminPageHeader
        title="Data ingestion"
        description="Pull real projects in from public data sources. Each source only reads from the government agency's own public feed — never from a paid aggregator like DemandStar or ConstructConnect."
      />

      <IngestionTrigger
        endpoint="/api/admin/ingest/miami-dade-permits"
        label="Miami-Dade County — building permits"
      />

      <div className="rounded-xl border border-border bg-surface p-5 text-sm text-muted-foreground">
        <p className="mb-2 font-medium text-foreground">How this works</p>
        <p>
          Pulls building permits (over $250k estimated value) from Miami-Dade County&apos;s official
          public ArcGIS open-data feed, updated weekly by the county. Each permit becomes a real
          project (status Permitted or Completed), with the contractor of record matched or created
          as a General Contractor. Running it again is safe — it updates existing records instead of
          duplicating them.
        </p>
        <p className="mt-2">
          Broward, Palm Beach, and Monroe County sources can be added the same way once this one is
          verified working.
        </p>
      </div>
    </div>
  );
}
