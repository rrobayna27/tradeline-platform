// Data access layer. Every function is async so the call sites below (pages,
// server components, route handlers) don't change when this in-memory
// provider is swapped for the real Prisma-backed implementation — see the
// note at the top of src/lib/types.ts for why Prisma isn't wired live in
// this sandbox yet.

import {
  articles as allArticles,
  cities as allCities,
  counties as allCounties,
  developerById,
  developers as allDevelopers,
  gcBySlug,
  gcById,
  generalContractors as allGCs,
  marketStats as allMarketStats,
  projectBySlug,
  projectById,
  projects as allProjects,
  subBySlug,
  subById,
  subcontractors as allSubs,
  trades as allTrades,
  articleBySlug,
  cityById,
  countyById,
} from "@/data/sample";
import type {
  Article,
  City,
  County,
  Developer,
  GeneralContractor,
  MarketStat,
  Project,
  ProjectSearchFilters,
  Subcontractor,
  SubcontractorSearchFilters,
  Trade,
} from "@/lib/types";

function paginate<T>(items: T[], page = 1, pageSize = 12) {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
  };
}

// ── Geography ──────────────────────────────────────────────────────────
export async function getCounties(): Promise<County[]> {
  return allCounties;
}
export async function getLiveCounties(): Promise<County[]> {
  return allCounties.filter((c) => c.isLive);
}
export async function getCountyBySlug(slug: string): Promise<County | undefined> {
  return allCounties.find((c) => c.slug === slug);
}
export async function getCities(): Promise<City[]> {
  return allCities;
}
export async function getCitiesByCounty(countyId: string): Promise<City[]> {
  return allCities.filter((c) => c.countyId === countyId);
}

// ── Trades ─────────────────────────────────────────────────────────────
export async function getTrades(): Promise<Trade[]> {
  return allTrades;
}

// ── Projects ───────────────────────────────────────────────────────────
export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  return allProjects.filter((p) => p.isFeatured).slice(0, limit);
}

export async function getProjectsByStatus(statuses: Project["status"][], limit = 8): Promise<Project[]> {
  return allProjects
    .filter((p) => statuses.includes(p.status))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}

export async function getNewestProjects(limit = 8): Promise<Project[]> {
  return [...allProjects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function getRecentlyApprovedProjects(limit = 8): Promise<Project[]> {
  return getProjectsByStatus(["APPROVED", "PERMITTED"], limit);
}

export async function getBreakingGroundProjects(limit = 8): Promise<Project[]> {
  return getProjectsByStatus(["SITE_WORK", "FOUNDATION"], limit);
}

export async function getUnderConstructionProjects(limit = 8): Promise<Project[]> {
  return getProjectsByStatus(["VERTICAL_CONSTRUCTION", "TOPPED_OUT", "FINISHING"], limit);
}

export async function getCompletedProjects(limit = 8): Promise<Project[]> {
  return getProjectsByStatus(["COMPLETED"], limit);
}

export async function getAllProjectsForMap(): Promise<Project[]> {
  return allProjects.filter((p) => p.latitude && p.longitude);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return projectBySlug.get(slug);
}

export async function getNearbyProjects(project: Project, limit = 4): Promise<Project[]> {
  const explicit = project.nearbyProjectIds
    .map((id) => projectById.get(id))
    .filter((p): p is Project => Boolean(p));
  if (explicit.length >= limit) return explicit.slice(0, limit);

  const sameCounty = allProjects
    .filter((p) => p.id !== project.id && p.countyId === project.countyId && !explicit.includes(p))
    .slice(0, limit - explicit.length);
  return [...explicit, ...sameCounty];
}

export async function searchProjects(filters: ProjectSearchFilters) {
  let results = [...allProjects];

  if (filters.county) results = results.filter((p) => p.countyId === filters.county);
  if (filters.city) results = results.filter((p) => p.cityId === filters.city);
  if (filters.developer) results = results.filter((p) => p.developerId === filters.developer);
  if (filters.generalContractor) results = results.filter((p) => p.generalContractorId === filters.generalContractor);
  if (filters.architect)
    results = results.filter((p) => p.architect?.toLowerCase().includes(filters.architect!.toLowerCase()));
  if (filters.projectType) results = results.filter((p) => p.projectType === filters.projectType);
  if (filters.status) results = results.filter((p) => p.status === filters.status);
  if (filters.trade) results = results.filter((p) => p.tradeIds.includes(filters.trade!));
  if (filters.minValue != null)
    results = results.filter((p) => (p.estimatedValueUsd ?? 0) >= filters.minValue!);
  if (filters.maxValue != null)
    results = results.filter((p) => (p.estimatedValueUsd ?? 0) <= filters.maxValue!);
  if (filters.completionYear != null)
    results = results.filter(
      (p) => p.estimatedCompletion && new Date(p.estimatedCompletion).getFullYear() === filters.completionYear
    );
  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(kw) ||
        p.description?.toLowerCase().includes(kw) ||
        p.address?.toLowerCase().includes(kw)
    );
  }

  results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return paginate(results, filters.page, filters.pageSize);
}

// ── Developers ─────────────────────────────────────────────────────────
export async function getDevelopers(): Promise<Developer[]> {
  return allDevelopers;
}
export async function getDeveloperById(id: string): Promise<Developer | undefined> {
  return developerById.get(id);
}
export async function getProjectsByDeveloper(developerId: string): Promise<Project[]> {
  return allProjects.filter((p) => p.developerId === developerId);
}

// ── General Contractors ────────────────────────────────────────────────
export async function getFeaturedGeneralContractors(limit = 6): Promise<GeneralContractor[]> {
  return allGCs.filter((g) => g.isFeatured).slice(0, limit);
}
export async function getGeneralContractors(): Promise<GeneralContractor[]> {
  return allGCs;
}
export async function getGeneralContractorBySlug(slug: string): Promise<GeneralContractor | undefined> {
  return gcBySlug.get(slug);
}
export async function getGeneralContractorById(id: string): Promise<GeneralContractor | undefined> {
  return gcById.get(id);
}
export async function getProjectsByGeneralContractor(gcId: string): Promise<Project[]> {
  return allProjects.filter((p) => p.generalContractorId === gcId);
}
export async function getNewestCompanies(limit = 6) {
  const combined = [
    ...allGCs.map((g) => ({ kind: "gc" as const, id: g.id, name: g.name, slug: g.slug, createdAt: g.createdAt })),
    ...allSubs.map((s) => ({ kind: "sub" as const, id: s.id, name: s.name, slug: s.slug, createdAt: s.createdAt })),
  ];
  return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
}

// ── Subcontractors ─────────────────────────────────────────────────────
export async function getFeaturedSubcontractors(limit = 6): Promise<Subcontractor[]> {
  return allSubs.filter((s) => s.isFeatured).slice(0, limit);
}
export async function getSubcontractorBySlug(slug: string): Promise<Subcontractor | undefined> {
  return subBySlug.get(slug);
}
export async function getSubcontractorById(id: string): Promise<Subcontractor | undefined> {
  return subById.get(id);
}
export async function searchSubcontractors(filters: SubcontractorSearchFilters) {
  let results = [...allSubs];
  if (filters.trade) results = results.filter((s) => s.tradeIds.includes(filters.trade!));
  if (filters.county) results = results.filter((s) => s.countyIds.includes(filters.county!));
  if (filters.minYears != null) results = results.filter((s) => (s.yearsInBusiness ?? 0) >= filters.minYears!);
  if (filters.name) {
    const kw = filters.name.toLowerCase();
    results = results.filter((s) => s.name.toLowerCase().includes(kw));
  }
  results.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  return paginate(results, filters.page, filters.pageSize);
}

// ── Articles ───────────────────────────────────────────────────────────
export async function getPublishedArticles(limit?: number): Promise<Article[]> {
  const published = allArticles
    .filter((a) => a.status === "PUBLISHED")
    .sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime());
  return limit ? published.slice(0, limit) : published;
}
export async function getTrendingArticles(limit = 5): Promise<Article[]> {
  return getPublishedArticles(limit);
}
export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  return articleBySlug.get(slug);
}
export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  const explicit = article.relatedArticleIds
    .map((id) => allArticles.find((a) => a.id === id))
    .filter((a): a is Article => Boolean(a));
  if (explicit.length >= limit) return explicit.slice(0, limit);
  const sameCategory = allArticles
    .filter((a) => a.id !== article.id && a.category === article.category && !explicit.includes(a))
    .slice(0, limit - explicit.length);
  return [...explicit, ...sameCategory];
}
export async function getArticlesByProject(projectId: string): Promise<Article[]> {
  return allArticles.filter((a) => a.projectId === projectId && a.status === "PUBLISHED");
}

// ── Market stats ───────────────────────────────────────────────────────
export async function getMarketStats(): Promise<MarketStat[]> {
  return allMarketStats;
}

// ── Reference lookups used across UI ──────────────────────────────────
export function lookupCity(id?: string | null) {
  return id ? cityById.get(id) : undefined;
}
export function lookupCounty(id?: string | null) {
  return id ? countyById.get(id) : undefined;
}
export function lookupDeveloper(id?: string | null) {
  return id ? developerById.get(id) : undefined;
}
export function lookupGC(id?: string | null) {
  return id ? gcById.get(id) : undefined;
}
