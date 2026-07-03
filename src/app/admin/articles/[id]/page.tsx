import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { getArticleById } from "@/lib/repositories";
import { ArticleEditForm } from "./article-edit-form";

export default async function AdminArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/articles" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={14} /> Back to articles
      </Link>

      <AdminPageHeader
        title="Review article"
        action={<Badge>{article.status.replace("_", " ")}</Badge>}
      />

      {article.researchSourceUrls.length > 0 && (
        <div className="mb-6 rounded-xl border border-highlight/30 bg-highlight/5 p-4 text-sm">
          <p className="mb-2 font-medium text-foreground">
            AI-assisted draft{article.draftedByModel ? ` (${article.draftedByModel})` : ""} — verify against the
            source before publishing
          </p>
          <ul className="space-y-1">
            {article.researchSourceUrls.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-accent underline"
                >
                  {url} <ExternalLink size={12} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ArticleEditForm article={article} />
    </div>
  );
}
