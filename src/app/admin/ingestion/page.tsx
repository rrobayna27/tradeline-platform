import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { IngestionTrigger } from "./ingestion-trigger";

export default function AdminIngestionPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <AdminPageHeader
        title="Data ingestion"
        description="Pull real projects and news in from public sources. Nothing here scrapes a paid/ToS-protected platform like DemandStar or LinkedIn — see DECISIONS.md."
      />

      <IngestionTrigger
        endpoint="/api/admin/ingest/bidlog"
        label="Your bid log — Current Projects List 2026"
        statKeys={[
          ["fetched", "Jobs"],
          ["created", "Created"],
          ["updated", "Already imported"],
          ["skipped", "Skipped"],
          ["errors", "Errors"],
        ]}
      />

      <div className="rounded-xl border border-border bg-surface p-5 text-sm text-muted-foreground">
        <p className="mb-2 font-medium text-foreground">How this works</p>
        <p>
          Imports your own real bid history — 1,981 unique jobs and 509 general contractors,
          deduplicated from &quot;Current Projects List 2026.numbers&quot; (2023–2026). Contact emails
          land on the matching GC profile as Pro-only content. Safe to re-run — jobs are keyed so it
          never creates duplicates.
        </p>
      </div>

      <IngestionTrigger
        endpoint="/api/admin/ingest/miami-dade-permits"
        label="Miami-Dade County — building permits"
        statKeys={[
          ["fetched", "Fetched"],
          ["eligible", "Eligible"],
          ["created", "Created"],
          ["updated", "Updated"],
          ["skipped", "Skipped"],
          ["errors", "Errors"],
        ]}
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
          Broward, Palm Beach, and Monroe County don&apos;t currently publish an equivalent public,
          queryable permit feed (Broward&apos;s is login-gated; Palm Beach&apos;s isn&apos;t
          internet-reachable; Monroe&apos;s permitting system has no public API). They&apos;ll be
          added if/when that changes, or via a manual data import instead.
        </p>
      </div>

      <IngestionTrigger
        endpoint="/api/admin/newsroom/generate"
        label="Newsroom — draft articles from public news"
        statKeys={[
          ["searched", "Searched"],
          ["newSources", "New sources"],
          ["drafted", "Drafted"],
          ["skippedNotConfident", "Skipped"],
          ["errors", "Errors"],
        ]}
      />

      <div className="rounded-xl border border-border bg-surface p-5 text-sm text-muted-foreground">
        <p className="mb-2 font-medium text-foreground">How this works</p>
        <p>
          Searches the public web (via the Brave Search News API — a licensed search API, not
          scraping) for South Florida construction and CRE news, then asks Claude to draft an{" "}
          <strong>original</strong> article from the facts it finds — never copied or closely
          paraphrased from the source. Every draft lands in{" "}
          <Link href="/admin/articles" className="text-accent underline">
            Articles
          </Link>{" "}
          with status &quot;In review&quot; and is never auto-published — you review, edit, and
          publish (or discard) each one by hand. Runs automatically every day.
        </p>
      </div>
    </div>
  );
}
