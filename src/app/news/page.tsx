import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/shared/section";
import { ArticleCard } from "@/components/article/article-card";
import { Badge } from "@/components/ui/badge";
import { getPublishedArticles } from "@/lib/repositories";
import { ARTICLE_CATEGORY_LABELS } from "@/lib/constants";
import type { ArticleCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "News",
  description: "Original South Florida construction and commercial real estate news, written from public permits, planning filings, and commission agendas.",
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? (sp.category as ArticleCategory) : undefined;

  const articles = await getPublishedArticles();
  const filtered = category ? articles.filter((a) => a.category === category) : articles;

  return (
    <Section className="pt-10">
      <div className="mb-8">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-accent">Newsroom</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          South Florida construction news
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Original reporting synthesized from public permits, planning filings, and commission
          agendas — never copied from other publications.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link href="/news">
          <Badge className={!category ? "border-accent/40 bg-accent/10 text-accent" : ""}>All</Badge>
        </Link>
        {Object.entries(ARTICLE_CATEGORY_LABELS).map(([value, label]) => (
          <Link key={value} href={`/news?category=${value}`}>
            <Badge className={category === value ? "border-accent/40 bg-accent/10 text-accent" : ""}>{label}</Badge>
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No articles in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </Section>
  );
}
