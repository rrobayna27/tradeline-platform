"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type SummaryValue = string | number | string[] | undefined;
type Summary = Record<string, SummaryValue>;

export function IngestionTrigger({
  endpoint,
  label,
  statKeys,
}: {
  endpoint: string;
  label: string;
  /** Ordered list of [summaryKey, displayLabel] pairs to render as stat tiles. */
  statKeys: [string, string][];
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const body = await res.json();
      if (!res.ok) throw new Error(body.detail ?? body.error ?? "Run failed");
      setSummary(body as Summary);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }

  const errors = (summary?.errors as string[] | undefined) ?? [];

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
          {statKeys.map(([key, statLabel]) => {
            const raw = summary[key];
            const value = Array.isArray(raw) ? raw.length : raw;
            return <Stat key={key} label={statLabel} value={value ?? "—"} />;
          })}
        </dl>
      )}
      {status === "done" && errors.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs text-status-cancelled">
          {errors.slice(0, 10).map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      )}
      {status === "error" && <p className="text-sm text-status-cancelled">{error}</p>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="font-mono text-lg font-semibold tabular-nums text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
