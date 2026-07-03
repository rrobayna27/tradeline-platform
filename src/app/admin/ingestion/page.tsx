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

      <IngestionTrigger
        endpoint="/api/admin/ingest/bidlog"
        label="Bid log 2023–2026 — 1,981 jobs from our own bid history"
      />

      <div className="rounded-xl border border-border bg-surface p-5 text-sm text-muted-foreground">
        <p className="mb-2 font-medium text-foreground">How this works</p>
        <p>
          Pulls building permits (over $100k estimated value) from Miami-Dade County&apos;s official
          public ArcGIS open-data feed, updated weekly by the county. Each permit becomes a real
          project (status Permitted or Completed), with the contractor of record matched or created
          as a General Contractor. Running it again is safe — it updates existing records instead of
          duplicating them. Runs automatically every day — see Cron Jobs in the Vercel dashboard.
        </p>
        <p className="mt-2">
          The bid log import loads the founder&apos;s own 2023–2026 bid history (cleaned and
          deduplicated — one record per unique job, with the most recent GC relationship attached).
          GC names and contact emails from it are Pro-gated on the public site. Safe to run more
          than once: already-imported jobs are recognized and never duplicated.
        </p>
        <p className="mt-2">
          Broward, Palm Beach, and Monroe County don&apos;t currently publish an equivalent public,
          queryable permit feed (Broward&apos;s is login-gated; Palm Beach&apos;s isn&apos;t
          internet-reachable; Monroe&apos;s permitting system has no public API). They&apos;ll be
          added if/when that changes, or via a manual data import instead.
        </p>
      </div>
    </div>
  );
}
