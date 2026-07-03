import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { searchConstructionNews, NEWSROOM_QUERIES, type NewsResult } from "./search";
import { draftArticleFromSources } from "./draft-article";

const MAX_CANDIDATES_PER_RUN = 5;
const QUERIES_PER_RUN = 2;
const MODEL_LABEL = "claude-sonnet-5";

export interface NewsroomRunSummary {
  queriesRun: string[];
  searched: number;
  newSources: number;
  drafted: number;
  skippedNotConfident: number;
  errors: string[];
}

function pickQueriesForToday(): string[] {
  // Rotate through the query list by day of year so repeated daily runs
  // cover different ground instead of hammering the same search terms.
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  const start = dayOfYear % NEWSROOM_QUERIES.length;
  const picks: string[] = [];
  for (let i = 0; i < QUERIES_PER_RUN; i++) {
    picks.push(NEWSROOM_QUERIES[(start + i) % NEWSROOM_QUERIES.length]);
  }
  return picks;
}

async function findLinkedProjectId(headline: string, body: string): Promise<string | undefined> {
  const projects = await prisma.project.findMany({ select: { id: true, name: true }, take: 500 });
  const haystack = `${headline} ${body}`.toLowerCase();
  const match = projects.find((p) => p.name.length > 6 && haystack.includes(p.name.toLowerCase()));
  return match?.id;
}

export async function runNewsroomGeneration(): Promise<NewsroomRunSummary> {
  const queries = pickQueriesForToday();
  const summary: NewsroomRunSummary = {
    queriesRun: queries,
    searched: 0,
    newSources: 0,
    drafted: 0,
    skippedNotConfident: 0,
    errors: [],
  };

  const candidates: NewsResult[] = [];

  for (const query of queries) {
    try {
      const results = await searchConstructionNews(query, 8);
      summary.searched += results.length;

      for (const result of results) {
        if (!result.url) continue;
        if (candidates.length >= MAX_CANDIDATES_PER_RUN) break;

        const alreadySeen = await prisma.newsroomSourceSeen.findUnique({ where: { sourceUrl: result.url } });
        if (alreadySeen) continue;

        candidates.push(result);
      }
    } catch (err) {
      summary.errors.push(`search "${query}": ${err instanceof Error ? err.message : String(err)}`);
    }
    if (candidates.length >= MAX_CANDIDATES_PER_RUN) break;
  }

  summary.newSources = candidates.length;

  for (const source of candidates) {
    try {
      // Mark as seen immediately so a failed/low-quality draft doesn't get
      // retried forever on subsequent runs.
      await prisma.newsroomSourceSeen.upsert({
        where: { sourceUrl: source.url },
        update: {},
        create: { sourceUrl: source.url, title: source.title },
      });

      const draft = await draftArticleFromSources([source]);
      if (!draft) {
        summary.skippedNotConfident++;
        continue;
      }

      const baseSlug = slugify(draft.headline) || slugify(`article-${Date.now()}`);
      let slug = baseSlug;
      let suffix = 1;
      while (await prisma.article.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${suffix++}`;
      }

      const projectId = await findLinkedProjectId(draft.headline, draft.body).catch(() => undefined);

      await prisma.article.create({
        data: {
          headline: draft.headline,
          slug,
          summary: draft.summary,
          body: draft.body,
          category: draft.category,
          status: "IN_REVIEW",
          location: draft.location,
          whyItMatters: draft.whyItMatters,
          marketImpact: draft.marketImpact,
          metaTitle: draft.metaTitle,
          metaDescription: draft.metaDescription,
          authorName: "Tradeline Newsroom (AI-assisted, pending review)",
          isSample: false,
          researchSourceUrls: [source.url],
          draftedByModel: MODEL_LABEL,
          projectId,
        },
      });

      summary.drafted++;
    } catch (err) {
      summary.errors.push(`draft "${source.title}": ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return summary;
}
