import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, CalendarDays } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Badge, SampleDataBadge } from "@/components/ui/badge";
import { ArticleCard } from "@/components/article/article-card";
import { ProjectCard } from "@/components/project/project-card";
import { ARTICLE_CATEGORY_LABELS, SITE_URL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { getArticleBySlug, getRelatedArticles, lookupDeveloper } from "@/lib/repositories";
import { projectById } from "@/data/sample/projects";

export async function generateStaticParams() {
  const { articles } = await import("@/data/sample/articles");
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const title = article.metaTitle ?? article.headline;
  const description = article.metaDescription ?? article.summary;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/news/${article.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
      images: article.ogImageUrl ? [article.ogImageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [related] = await Promise.all([getRelatedArticles(article, 3)]);
  const developer = lookupDeveloper(article.developerId);
  const relatedProjects = article.relatedProjectIds.map((id) => projectById.get(id)).filter(Boolean);
  const linkedProject = article.projectId ? projectById.get(article.projectId) : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.headline,
    description: article.summary,
    datePublished: article.publishedAt,
    author: { "@type": "Organization", name: article.authorName },
    publisher: { "@type": "Organization", name: "Tradeline" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Section className="max-w-3xl pt-10">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge className="border-accent/30 bg-accent/10 text-accent">
            {ARTICLE_CATEGORY_LABELS[article.category]}
          </Badge>
          {article.isSample && <SampleDataBadge />}
        </div>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
          {article.headline}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{article.summary}</p>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-border py-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{article.authorName}</span>
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} /> {formatDate(article.publishedAt)}
          </span>
          {article.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={14} /> {article.location}
            </span>
          )}
        </div>

        <div className="prose prose-sm mt-8 max-w-none space-y-4 text-[15px] leading-relaxed text-foreground">
          {article.body.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {(article.whyItMatters || article.marketImpact) && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {article.whyItMatters && (
              <div className="rounded-xl border border-border bg-surface p-5">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">Why it matters</h3>
                <p className="text-sm text-muted-foreground">{article.whyItMatters}</p>
              </div>
            )}
            {article.marketImpact && (
              <div className="rounded-xl border border-border bg-surface p-5">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">Market impact</h3>
                <p className="text-sm text-muted-foreground">{article.marketImpact}</p>
              </div>
            )}
          </div>
        )}

        {(linkedProject || developer) && (
          <div className="mt-10 rounded-xl border border-border bg-surface p-5 text-sm">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Project details
            </h3>
            <dl className="grid grid-cols-2 gap-3">
              {linkedProject && (
                <div>
                  <dt className="text-muted-foreground">Project</dt>
                  <dd className="font-medium text-foreground">{linkedProject.name}</dd>
                </div>
              )}
              {developer && (
                <div>
                  <dt className="text-muted-foreground">Developer</dt>
                  <dd className="font-medium text-foreground">{developer.name}</dd>
                </div>
              )}
              {article.timelineNote && (
                <div>
                  <dt className="text-muted-foreground">Timeline</dt>
                  <dd className="font-medium text-foreground">{article.timelineNote}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {relatedProjects.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Related projects</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {relatedProjects.map((p) => (
                <ProjectCard key={p!.id} project={p!} />
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Related articles</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
