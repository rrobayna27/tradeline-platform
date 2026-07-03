// Thin client for the Brave Search News API. This is a licensed search API
// (not scraping) — see DECISIONS.md guardrail #1: normal web search to find
// publicly available news is always in scope; it's automated scraping of
// ToS-protected platforms (DemandStar, LinkedIn, etc.) that's off-limits.

export interface NewsResult {
  title: string;
  url: string;
  description: string;
  age?: string;
  source?: string;
}

const BRAVE_NEWS_ENDPOINT = "https://api.search.brave.com/res/v1/news/search";

export async function searchConstructionNews(query: string, count = 8): Promise<NewsResult[]> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) {
    throw new Error("BRAVE_SEARCH_API_KEY is not set");
  }

  const params = new URLSearchParams({
    q: query,
    count: String(count),
    country: "US",
    search_lang: "en",
  });

  const res = await fetch(`${BRAVE_NEWS_ENDPOINT}?${params.toString()}`, {
    headers: {
      Accept: "application/json",
      "X-Subscription-Token": apiKey,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Brave Search request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const results = Array.isArray(data.results) ? data.results : [];

  return results.map((r: Record<string, unknown>) => ({
    title: String(r.title ?? ""),
    url: String(r.url ?? ""),
    description: String(r.description ?? ""),
    age: typeof r.age === "string" ? r.age : undefined,
    source: typeof (r.meta_url as Record<string, unknown> | undefined)?.hostname === "string"
      ? ((r.meta_url as Record<string, unknown>).hostname as string)
      : undefined,
  }));
}

// Search queries rotated across runs to cover the South Florida
// construction/CRE beat without repeating the exact same query every time.
export const NEWSROOM_QUERIES = [
  "South Florida construction project announcement",
  "Miami-Dade new development groundbreaking",
  "Broward County commercial real estate construction",
  "Palm Beach County new construction project",
  "South Florida multifamily development permit",
  "Miami office tower construction",
  "South Florida industrial warehouse development",
  "Fort Lauderdale construction news",
];
