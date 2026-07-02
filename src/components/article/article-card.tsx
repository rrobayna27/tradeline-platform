import Link from "next/link";
import { CardHover } from "@/components/ui/card";
import { Badge, SampleDataBadge } from "@/components/ui/badge";
import { ARTICLE_CATEGORY_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/lib/types";

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <Link href={`/news/${article.slug}`}>
      <CardHover className={featured ? "flex h-full flex-col p-6" : "flex h-full flex-col p-5"}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge className="border-accent/30 bg-accent/10 text-accent">
            {ARTICLE_CATEGORY_LABELS[article.category]}
          </Badge>
          {article.isSample && <SampleDataBadge />}
        </div>
        <h3 className={featured ? "mb-2 text-xl font-semibold leading-snug text-foreground group-hover:text-accent" : "mb-2 font-semibold leading-snug text-foreground group-hover:text-accent"}>
          {article.headline}
        </h3>
        <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">{article.summary}</p>
        <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span>{article.authorName}</span>
          <span className="font-mono tabular-nums">{formatDate(article.publishedAt)}</span>
        </div>
      </CardHover>
    </Link>
  );
}
