"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { IngestSummary } from "@/lib/ingestion/miami-dade-permits";

export function IngestionTrigger({ endpoint, label }: { endpoint: string; label: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [summary, setSummary] = useState<IngestSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.detail ?? body.error ?? "Ingestion failed");
      setSummary(body as IngestSummary);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        <Button size="sm" onClick={run} disabled={status === "loading"}>
          {status === "loading" ? "Running…" : "Run now"}
        </Button>
      </div>

      {status === "done" && summary && (
        <dl className="grid grid-cols-3 gap-4 text-sm sm:grid-cols-6">
          <Stat label="Fetched" value={summary.fetched} />
          <Stat label="Eligible" value={summary.eligible} />
          <Stat label="Created" value={summary.created} />
          <Stat label="Updated" value={summary.updated} />
          <Stat label="Skipped" value={summary.skipped} />
          <Stat label="Errors" value={summary.errors.length} />
        </dl>
      )}
      {status === "done" && summary && summary.errors.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs text-status-cancelled">
          {summary.errors.slice(0, 10).map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}
      {status === "error" && <p className="text-sm text-status-cancelled">{error}</p>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-mono text-lg font-semibold tabular-nums text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
