"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Select, FieldLabel } from "@/components/ui/form-controls";
import { ARTICLE_CATEGORY_LABELS } from "@/lib/constants";
import type { Article } from "@/lib/types";

interface ArticleFormState {
  headline: string;
  summary: string;
  body: string;
  category: string;
  location: string;
  whyItMatters: string;
  marketImpact: string;
  metaTitle: string;
  metaDescription: string;
}

export function ArticleEditForm({ article }: { article: Article }) {
  const router = useRouter();
  const [form, setForm] = useState<ArticleFormState>({
    headline: article.headline,
    summary: article.summary,
    body: article.body,
    category: article.category,
    location: article.location ?? "",
    whyItMatters: article.whyItMatters ?? "",
    marketImpact: article.marketImpact ?? "",
    metaTitle: article.metaTitle ?? "",
    metaDescription: article.metaDescription ?? "",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function save(nextStatus?: Article["status"]) {
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch(`/api/admin/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...(nextStatus ? { status: nextStatus } : {}) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail ?? json.error ?? "Save failed");
      setStatus("saved");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }

  function field<K extends keyof typeof form>(key: K) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
    };
  }

  return (
    <div className="space-y-5">
      <div>
        <FieldLabel>Headline</FieldLabel>
        <Input {...field("headline")} />
      </div>
      <div>
        <FieldLabel>Summary</FieldLabel>
        <textarea
          {...field("summary")}
          rows={2}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
        />
      </div>
      <div>
        <FieldLabel>Body</FieldLabel>
        <textarea
          {...field("body")}
          rows={14}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm leading-relaxed text-foreground"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Category</FieldLabel>
          <Select {...field("category")}>
            {Object.entries(ARTICLE_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel>Location</FieldLabel>
          <Input {...field("location")} placeholder="Miami, FL (Miami-Dade County)" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Why it matters</FieldLabel>
          <textarea
            {...field("whyItMatters")}
            rows={3}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          />
        </div>
        <div>
          <FieldLabel>Market impact</FieldLabel>
          <textarea
            {...field("marketImpact")}
            rows={3}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Meta title</FieldLabel>
          <Input {...field("metaTitle")} />
        </div>
        <div>
          <FieldLabel>Meta description</FieldLabel>
          <Input {...field("metaDescription")} />
        </div>
      </div>

      {error && <p className="text-sm text-status-cancelled">{error}</p>}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <Button variant="outline" onClick={() => save()} disabled={status === "saving"}>
          {status === "saving" ? "Saving…" : "Save changes"}
        </Button>
        {article.status !== "PUBLISHED" && (
          <Button onClick={() => save("PUBLISHED")} disabled={status === "saving"}>
            Publish
          </Button>
        )}
        {article.status === "PUBLISHED" && (
          <Button variant="outline" onClick={() => save("ARCHIVED")} disabled={status === "saving"}>
            Unpublish (archive)
          </Button>
        )}
        {article.status === "IN_REVIEW" && (
          <Button variant="ghost" onClick={() => save("ARCHIVED")} disabled={status === "saving"}>
            Discard draft
          </Button>
        )}
        {status === "saved" && <span className="text-sm text-accent">Saved.</span>}
      </div>
    </div>
  );
}
