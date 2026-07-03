import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { Badge, SampleDataBadge } from "@/components/ui/badge";
import { ARTICLE_CATEGORY_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { getAllArticlesForAdmin } from "@/lib/repositories";
import type { Article } from "@/lib/types";

const STATUS_TONE: Record<Article["status"], string> = {
  DRAFT: "",
  IN_REVIEW: "border-highlight/40 bg-highlight/10 text-highlight",
  PUBLISHED: "border-accent/30 bg-accent/10 text-accent",
  ARCHIVED: "",
};

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const statusFilter = typeof sp.status === "string" ? (sp.status as Article["status"]) : undefined;
  const articles = await getAllArticlesForAdmin(statusFilter);
  const inReviewCount = statusFilter ? undefined : (await getAllArticlesForAdmin("IN_REVIEW")).length;

  return (
    <div>
      <AdminPageHeader
        title="Articles"
        description={
          inReviewCount != null
            ? `${articles.length} total — ${inReviewCount} waiting for review`
            : `${articles.length} ${statusFilter?.toLowerCase().replace("_", " ")}`
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/admin/articles">
          <Badge className={!statusFilter ? "border-accent/40 bg-accent/10 text-accent" : ""}>All</Badge>
        </Link>
        {(["IN_REVIEW", "DRAFT", "PUBLISHED", "ARCHIVED"] as const).map((s) => (
          <Link key={s} href={`/admin/articles?status=${s}`}>
            <Badge className={statusFilter === s ? "border-accent/40 bg-accent/10 text-accent" : ""}>
              {s.replace("_", " ")}
            </Badge>
          </Link>
        ))}
      </div>

      <AdminTable
        rows={articles}
        columns={[
          {
            header: "Headline",
            cell: (a) => (
              <Link href={`/admin/articles/${a.id}`} className="font-medium text-foreground hover:text-accent">
                {a.headline}
              </Link>
            ),
          },
          { header: "Category", cell: (a) => <Badge>{ARTICLE_CATEGORY_LABELS[a.category]}</Badge> },
          { header: "Status", cell: (a) => <Badge className={STATUS_TONE[a.status]}>{a.status.replace("_", " ")}</Badge> },
          { header: "Published", cell: (a) => formatDate(a.publishedAt) },
          {
            header: "Source",
            cell: (a) =>
              a.isSample ? <SampleDataBadge /> : a.draftedByModel ? <Badge>AI-assisted</Badge> : "Manual",
          },
        ]}
      />
    </div>
  );
}
