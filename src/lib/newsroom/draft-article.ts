// Drafts an original Tradeline article from public search results using the
// Anthropic API. This never publishes anything — see DECISIONS.md guardrail
// #4: every draft lands as an Article with status IN_REVIEW, and a human
// must review and publish it from the admin panel.

import Anthropic from "@anthropic-ai/sdk";
import type { ArticleCategory } from "@/lib/types";
import type { NewsResult } from "./search";

const MODEL = "claude-sonnet-5";

export interface DraftedArticle {
  headline: string;
  summary: string;
  body: string;
  category: ArticleCategory;
  location: string | null;
  whyItMatters: string;
  marketImpact: string;
  metaTitle: string;
  metaDescription: string;
  confident: boolean;
}

const DRAFT_TOOL = {
  name: "draft_article",
  description: "Submit a drafted, original Tradeline news article based on the provided source material.",
  input_schema: {
    type: "object" as const,
    properties: {
      confident: {
        type: "boolean",
        description:
          "True only if the source material contains enough concrete, specific fact to write a real article (a named project, developer, location, or similar). False if the sources are too vague, promotional, or generic to responsibly report on.",
      },
      headline: { type: "string", description: "An original headline, not copied from any source." },
      summary: { type: "string", description: "A 1-2 sentence original summary." },
      body: {
        type: "string",
        description:
          "The full article body, 3-5 paragraphs, original prose synthesized from the facts in the sources. Never copy or closely paraphrase sentences from the source material — write in Tradeline's own voice, stating only what the sources actually support.",
      },
      category: {
        type: "string",
        enum: [
          "BREAKING_DEVELOPMENT",
          "NEW_PROJECT",
          "PERMIT_FILING",
          "COMMISSION_MEETING",
          "MARKET_ANALYSIS",
          "COMPANY_NEWS",
          "POLICY_REGULATION",
        ],
      },
      location: { type: "string", description: "City, County, FL if determinable, else empty string." },
      whyItMatters: { type: "string", description: "1-2 original sentences on why this matters for the region." },
      marketImpact: { type: "string", description: "1-2 original sentences on the market impact." },
      metaTitle: { type: "string", description: "SEO title, under 60 characters." },
      metaDescription: { type: "string", description: "SEO description, under 155 characters." },
    },
    required: [
      "confident",
      "headline",
      "summary",
      "body",
      "category",
      "location",
      "whyItMatters",
      "marketImpact",
      "metaTitle",
      "metaDescription",
    ],
  },
};

const SYSTEM_PROMPT = `You are the newsroom AI for Tradeline, a South Florida construction and commercial real estate intelligence platform.

Rules you must follow exactly:
1. Write ONLY original prose. Never copy or closely paraphrase sentences from the source material provided — synthesize the underlying facts into your own words, the way a journalist writes a story after reading source material, not by rewording it.
2. State only what the sources actually support. Do not invent names, numbers, dates, or details not present in the sources.
3. If the sources are too thin, vague, or purely promotional to responsibly report real facts from, set confident=false and leave other fields minimal — do not fabricate content to fill them in.
4. Focus specifically on South Florida (Miami-Dade, Broward, Palm Beach, Monroe counties) construction, development, and commercial real estate. If the source material isn't actually about that, set confident=false.
5. Neutral, factual, trade-press tone — this is going to real subcontractors and general contractors who need accurate information, not marketing copy.`;

export async function draftArticleFromSources(sources: NewsResult[]): Promise<DraftedArticle | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  if (sources.length === 0) return null;

  const client = new Anthropic({ apiKey });

  const sourceBlock = sources
    .map(
      (s, i) =>
        `Source ${i + 1}: ${s.title}\nURL: ${s.url}\nPublished: ${s.age ?? "unknown"}\nSnippet: ${s.description}`
    )
    .join("\n\n");

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    tools: [DRAFT_TOOL],
    tool_choice: { type: "tool", name: "draft_article" },
    messages: [
      {
        role: "user",
        content: `Here is public source material about a possible South Florida construction/CRE story. Draft an original article from it, or set confident=false if it's not substantive enough.\n\n${sourceBlock}`,
      },
    ],
  });

  const toolUse = message.content.find((block) => block.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") return null;

  const input = toolUse.input as Record<string, unknown>;
  if (!input.confident) return null;

  return {
    headline: String(input.headline ?? ""),
    summary: String(input.summary ?? ""),
    body: String(input.body ?? ""),
    category: input.category as ArticleCategory,
    location: input.location ? String(input.location) : null,
    whyItMatters: String(input.whyItMatters ?? ""),
    marketImpact: String(input.marketImpact ?? ""),
    metaTitle: String(input.metaTitle ?? ""),
    metaDescription: String(input.metaDescription ?? ""),
    confident: true,
  };
}
