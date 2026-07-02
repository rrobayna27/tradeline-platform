import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable } from "@/components/admin/admin-table";
import { Badge, SampleDataBadge } from "@/components/ui/badge";
import { ARTICLE_CATEGORY_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { getPublishedArticles } from "@/lib/repositories";

export default async function AdminArticlesPage() {
  const articles = await getPublishedArticles();

  return (
    <div>
      <AdminPageHeader
        title="Articles"
        description={`${articles.length} published`}
      />
      <AdminTable
        rows={articles}
        columns={[
          {
            header: "Headline",
            cell: (a) => (
              <Link href={`/news/${a.slug}`} className="font-medium text-foreground hover:text-accent">
                {a.headline}
              </Link>
            ),
          },
          { header: "Category", cell: (a) => <Badge>{ARTICLE_CATEGORY_LABELS[a.category]}</Badge> },
          { header: "Status", cell: (a) => <Badge>{a.status}</Badge> },
          { header: "Published", cell: (a) => formatDate(a.publishedAt) },
          { header: "Source", cell: (a) => (a.isSample ? <SampleDataBadge /> : "Live") },
        ]}
      />
    </div>
  );
}
