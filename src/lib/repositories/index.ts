// Data access layer — reads/writes the live Postgres database via Prisma.
//
// Every function is async and returns the hand-written domain types from
// src/lib/types.ts (not raw Prisma types), so page/component code doesn't
// need to know or care that the data comes from Prisma. A few fields
// (cityName, countyName, tradeNames, etc.) are denormalized here at fetch
// time via Prisma `include`, specifically so components never need to do
// their own follow-up lookups or awaits — see the note at the top of
// src/lib/types.ts.
//
// prisma/seed.ts loads this same schema with the sample/illustrative South
// Florida data that originally shipped with the prototype build.

import { prisma } from "@/lib/prisma";
import type {
  Article,
  City,
  County,
  Developer,
  GeneralContractor,
  MarketStat,
  Project,
  ProjectSearchFilters,
  ProjectStatus,
  Subcontractor,
  SubcontractorSearchFilters,
  Trade,
} from "@/lib/types";
import type { Prisma } from "@prisma/client";
import type {
  County as PrismaCounty,
  City as PrismaCity,
  Trade as PrismaTrade,
  Developer as PrismaDeveloper,
  Article as PrismaArticle,
  MarketStat as PrismaMarketStat,
} from "@prisma/client";

function toIso(d: Date | null | undefined): string | undefined {
  return d ? d.toISOString() : undefined;
}

function paginate<T>(items: T[], total: number, page = 1, pageSize = 12) {
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

// ── Mappers: Prisma result -> domain type ───────────────────────────────

function mapCounty(c: PrismaCounty): County {
  return { id: c.id, name: c.name, slug: c.slug, metro: c.metro, state: c.state, isLive: c.isLive };
}

function mapCity(c: PrismaCity): City {
  return { id: c.id, name: c.name, slug: c.slug, countyId: c.countyId };
}

function mapTrade(t: PrismaTrade): Trade {
  return { id: t.id, name: t.name, slug: t.slug, isCustom: t.isCustom };
}

function mapDeveloper(d: PrismaDeveloper): Developer {
  return {
    id: d.id,
    name: d.name,
    slug: d.slug,
    logoUrl: d.logoUrl,
    description: d.description,
    website: d.website,
    phone: d.phone,
    email: d.email,
  };
}

const gcInclude = { offices: { include: { city: true } } } satisfies Prisma.GeneralContractorInclude;
type GCWithOffices = Prisma.GeneralContractorGetPayload<{ include: typeof gcInclude }>;

function mapGC(g: GCWithOffices): GeneralContractor {
  return {
    id: g.id,
    name: g.name,
    slug: g.slug,
    logoUrl: g.logoUrl,
    description: g.description,
    website: g.website,
    phone: g.phone,
    email: g.email,
    licenseNumber: g.licenseNumber,
    companySize: g.companySize,
    marketsServed: g.marketsServed,
    isFeatured: g.isFeatured,
    isClaimed: g.isClaimed,
    planTier: g.planTier,
    isSample: g.isSample,
    offices: g.offices.map((o) => ({
      id: o.id,
      label: o.label,
      cityName: o.city?.name ?? null,
      address: o.address,
      phone: o.phone,
    })),
    createdAt: toIso(g.createdAt)!,
  };
}

const subInclude = {
  trades: { include: { trade: true } },
  serviceAreas: { include: { county: true } },
  certifications: true,
  galleryPhotos: true,
} satisfies Prisma.SubcontractorInclude;
type SubWithRelations = Prisma.SubcontractorGetPayload<{ include: typeof subInclude }>;

function mapSub(s: SubWithRelations): Subcontractor {
  return {
    id: s.id,
    name: s.name,
    slug: s.slug,
    logoUrl: s.logoUrl,
    description: s.description,
    website: s.website,
    phone: s.phone,
    email: s.email,
    licenseNumber: s.licenseNumber,
    insuranceVerified: s.insuranceVerified,
    yearsInBusiness: s.yearsInBusiness,
    companySize: s.companySize,
    isMinorityOwned: s.isMinorityOwned,
    isWBE: s.isWBE,
    unionStatus: s.unionStatus,
    isFeatured: s.isFeatured,
    isClaimed: s.isClaimed,
    planTier: s.planTier,
    isSample: s.isSample,
    tradeIds: s.trades.map((t) => t.tradeId),
    tradeNames: s.trades.map((t) => t.trade.name),
    countyIds: s.serviceAreas.map((a) => a.countyId),
    countyNames: s.serviceAreas.map((a) => a.county.name),
    certifications: s.certifications.map((c) => ({ id: c.id, name: c.name, issuedBy: c.issuedBy })),
    galleryUrls: s.galleryPhotos.map((p) => p.url),
    createdAt: toIso(s.createdAt)!,
  };
}

const projectInclude = {
  city: true,
  county: true,
  developer: true,
  generalContractor: true,
  tradesLikelyNeeded: { include: { trade: true } },
  updates: { orderBy: { eventDate: "desc" } },
  photos: { orderBy: { sortOrder: "asc" } },
  nearbyOf: true,
} satisfies Prisma.ProjectInclude;
type ProjectWithRelations = Prisma.ProjectGetPayload<{ include: typeof projectInclude }>;

function mapProject(p: ProjectWithRelations): Project {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    address: p.address,
    cityId: p.cityId,
    countyId: p.countyId,
    latitude: p.latitude,
    longitude: p.longitude,
    developerId: p.developerId,
    owner: p.owner,
    generalContractorId: p.generalContractorId,
    architect: p.architect,
    engineer: p.engineer,
    estimatedValueUsd: p.estimatedValueUsd != null ? Number(p.estimatedValueUsd) : null,
    projectType: p.projectType,
    status: p.status,
    bidPhase: p.bidPhase,
    estimatedCompletion: toIso(p.estimatedCompletion) ?? null,
    description: p.description,
    whyItMatters: p.whyItMatters,
    marketImpact: p.marketImpact,
    gcContactPhone: p.gcContactPhone,
    gcContactEmail: p.gcContactEmail,
    gcContactWebsite: p.gcContactWebsite,
    tradeIds: p.tradesLikelyNeeded.map((t) => t.tradeId),
    tradeNames: p.tradesLikelyNeeded.map((t) => t.trade.name),
    isFeatured: p.isFeatured,
    isSample: p.isSample,
    createdAt: toIso(p.createdAt)!,
    updatedAt: toIso(p.updatedAt)!,
    updates: p.updates.map((u) => ({
      id: u.id,
      title: u.title,
      body: u.body,
      eventDate: toIso(u.eventDate)!,
    })),
    photos: p.photos.map((ph) => ({ id: ph.id, url: ph.url, caption: ph.caption })),
    nearbyProjectIds: p.nearbyOf.map((n) => n.toProjectId),
    cityName: p.city?.name ?? null,
    countyName: p.county?.name,
    developerName: p.developer?.name ?? null,
    generalContractorName: p.generalContractor?.name ?? null,
    sourceName: p.sourceName,
    sourceUrl: p.sourceUrl,
  };
}

function mapArticle(a: PrismaArticle): Article {
  return {
    id: a.id,
    headline: a.headline,
    slug: a.slug,
    summary: a.summary,
    body: a.body,
    featuredImageUrl: a.featuredImageUrl,
    category: a.category,
    status: a.status,
    projectId: a.projectId,
    developerId: a.developerId,
    location: a.location,
    timelineNote: a.timelineNote,
    whyItMatters: a.whyItMatters,
    marketImpact: a.marketImpact,
    authorName: a.authorName,
    isSample: a.isSample,
    metaTitle: a.metaTitle,
    metaDescription: a.metaDescription,
    ogImageUrl: a.ogImageUrl,
    publishedAt: toIso(a.publishedAt) ?? null,
    relatedArticleIds: [],
    relatedProjectIds: [],
    researchSourceUrls: a.researchSourceUrls,
    draftedByModel: a.draftedByModel,
  };
}

function mapMarketStat(m: PrismaMarketStat): MarketStat {
  return { id: m.id, metro: m.metro, label: m.label, value: m.value };
}

// ── Geography ──────────────────────────────────────────────────────────
export async function getCounties(): Promise<County[]> {
  const rows = await prisma.county.findMany({ orderBy: { name: "asc" } });
  return rows.map(mapCounty);
}
export async function getLiveCounties(): Promise<County[]> {
  const rows = await prisma.county.findMany({ where: { isLive: true }, orderBy: { name: "asc" } });
  return rows.map(mapCounty);
}
export async function getCountyBySlug(slug: string): Promise<County | undefined> {
  const row = await prisma.county.findUnique({ where: { slug } });
  return row ? mapCounty(row) : undefined;
}
export async function getCities(): Promise<City[]> {
  const rows = await prisma.city.findMany({ orderBy: { name: "asc" } });
  return rows.map(mapCity);
}
export async function getCitiesByCounty(countyId: string): Promise<City[]> {
  const rows = await prisma.city.findMany({ where: { countyId }, orderBy: { name: "asc" } });
  return rows.map(mapCity);
}

// ── Trades ─────────────────────────────────────────────────────────────
export async function getTrades(): Promise<Trade[]> {
  const rows = await prisma.trade.findMany({ orderBy: { name: "asc" } });
  return rows.map(mapTrade);
}

// ── Projects ───────────────────────────────────────────────────────────
export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: { isFeatured: true },
    include: projectInclude,
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
  return rows.map(mapProject);
}

export async function getProjectsByStatus(statuses: ProjectStatus[], limit = 8): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: { status: { in: statuses } },
    include: projectInclude,
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
  return rows.map(mapProject);
}

export async function getNewestProjects(limit = 8): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    include: projectInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(mapProject);
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
  const rows = await prisma.project.findMany({
    where: { latitude: { not: null }, longitude: { not: null } },
    include: projectInclude,
  });
  return rows.map(mapProject);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const row = await prisma.project.findUnique({ where: { slug }, include: projectInclude });
  return row ? mapProject(row) : undefined;
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const row = await prisma.project.findUnique({ where: { id }, include: projectInclude });
  return row ? mapProject(row) : undefined;
}

export async function getProjectsByIds(ids: string[]): Promise<Project[]> {
  if (ids.length === 0) return [];
  const rows = await prisma.project.findMany({ where: { id: { in: ids } }, include: projectInclude });
  return rows.map(mapProject);
}

export async function getNearbyProjects(project: Project, limit = 4): Promise<Project[]> {
  const explicit = await getProjectsByIds(project.nearbyProjectIds.slice(0, limit));
  if (explicit.length >= limit) return explicit;

  const fallback = await prisma.project.findMany({
    where: {
      id: { notIn: [project.id, ...explicit.map((p) => p.id)] },
      countyId: project.countyId,
    },
    include: projectInclude,
    take: limit - explicit.length,
  });
  return [...explicit, ...fallback.map(mapProject)];
}

export async function getRelatedProjectsForArticle(article: Article, limit = 4): Promise<Project[]> {
  if (!article.projectId) return [];
  const project = await getProjectById(article.projectId);
  if (!project) return [];
  return getNearbyProjects(project, limit);
}

export async function searchProjects(filters: ProjectSearchFilters) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 12;

  const where: Prisma.ProjectWhereInput = {
    ...(filters.county && { countyId: filters.county }),
    ...(filters.city && { cityId: filters.city }),
    ...(filters.developer && { developerId: filters.developer }),
    ...(filters.generalContractor && { generalContractorId: filters.generalContractor }),
    ...(filters.architect && { architect: { contains: filters.architect, mode: "insensitive" } }),
    ...(filters.projectType && { projectType: filters.projectType }),
    ...(filters.status && { status: filters.status }),
    ...(filters.trade && { tradesLikelyNeeded: { some: { tradeId: filters.trade } } }),
    ...(filters.minValue != null && { estimatedValueUsd: { gte: filters.minValue } }),
    ...(filters.maxValue != null && {
      estimatedValueUsd: { ...(filters.minValue != null ? { gte: filters.minValue } : {}), lte: filters.maxValue },
    }),
    ...(filters.completionYear != null && {
      estimatedCompletion: {
        gte: new Date(Date.UTC(filters.completionYear, 0, 1)),
        lt: new Date(Date.UTC(filters.completionYear + 1, 0, 1)),
      },
    }),
    ...(filters.keyword && {
      OR: [
        { name: { contains: filters.keyword, mode: "insensitive" } },
        { description: { contains: filters.keyword, mode: "insensitive" } },
        { address: { contains: filters.keyword, mode: "insensitive" } },
      ],
    }),
  };

  const [rows, total] = await Promise.all([
    prisma.project.findMany({
      where,
      include: projectInclude,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.project.count({ where }),
  ]);

  return paginate(rows.map(mapProject), total, page, pageSize);
}

// ── Developers ─────────────────────────────────────────────────────────
export async function getDevelopers(): Promise<Developer[]> {
  const rows = await prisma.developer.findMany({ orderBy: { name: "asc" } });
  return rows.map(mapDeveloper);
}
export async function getDeveloperById(id: string): Promise<Developer | undefined> {
  const row = await prisma.developer.findUnique({ where: { id } });
  return row ? mapDeveloper(row) : undefined;
}
export async function getProjectsByDeveloper(developerId: string): Promise<Project[]> {
  const rows = await prisma.project.findMany({ where: { developerId }, include: projectInclude });
  return rows.map(mapProject);
}

// ── General Contractors ────────────────────────────────────────────────
export async function getFeaturedGeneralContractors(limit = 6): Promise<GeneralContractor[]> {
  const rows = await prisma.generalContractor.findMany({
    where: { isFeatured: true },
    include: gcInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(mapGC);
}
export async function getGeneralContractors(): Promise<GeneralContractor[]> {
  const rows = await prisma.generalContractor.findMany({ include: gcInclude, orderBy: { name: "asc" } });
  return rows.map(mapGC);
}
export async function getGeneralContractorBySlug(slug: string): Promise<GeneralContractor | undefined> {
  const row = await prisma.generalContractor.findUnique({ where: { slug }, include: gcInclude });
  return row ? mapGC(row) : undefined;
}
export async function getGeneralContractorById(id: string): Promise<GeneralContractor | undefined> {
  const row = await prisma.generalContractor.findUnique({ where: { id }, include: gcInclude });
  return row ? mapGC(row) : undefined;
}
export async function getProjectsByGeneralContractor(gcId: string): Promise<Project[]> {
  const rows = await prisma.project.findMany({ where: { generalContractorId: gcId }, include: projectInclude });
  return rows.map(mapProject);
}

export async function getNewestCompanies(limit = 6) {
  const [gcs, subs] = await Promise.all([
    prisma.generalContractor.findMany({ orderBy: { createdAt: "desc" }, take: limit }),
    prisma.subcontractor.findMany({ orderBy: { createdAt: "desc" }, take: limit }),
  ]);
  const combined = [
    ...gcs.map((g) => ({ kind: "gc" as const, id: g.id, name: g.name, slug: g.slug, createdAt: g.createdAt })),
    ...subs.map((s) => ({ kind: "sub" as const, id: s.id, name: s.name, slug: s.slug, createdAt: s.createdAt })),
  ];
  return combined.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit);
}

// ── Subcontractors ─────────────────────────────────────────────────────
export async function getFeaturedSubcontractors(limit = 6): Promise<Subcontractor[]> {
  const rows = await prisma.subcontractor.findMany({
    where: { isFeatured: true },
    include: subInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(mapSub);
}
export async function getSubcontractorBySlug(slug: string): Promise<Subcontractor | undefined> {
  const row = await prisma.subcontractor.findUnique({ where: { slug }, include: subInclude });
  return row ? mapSub(row) : undefined;
}
export async function getSubcontractorById(id: string): Promise<Subcontractor | undefined> {
  const row = await prisma.subcontractor.findUnique({ where: { id }, include: subInclude });
  return row ? mapSub(row) : undefined;
}
export async function searchSubcontractors(filters: SubcontractorSearchFilters) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 24;

  const where: Prisma.SubcontractorWhereInput = {
    ...(filters.trade && { trades: { some: { tradeId: filters.trade } } }),
    ...(filters.county && { serviceAreas: { some: { countyId: filters.county } } }),
    ...(filters.minYears != null && { yearsInBusiness: { gte: filters.minYears } }),
    ...(filters.name && { name: { contains: filters.name, mode: "insensitive" } }),
  };

  const [rows, total] = await Promise.all([
    prisma.subcontractor.findMany({
      where,
      include: subInclude,
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.subcontractor.count({ where }),
  ]);

  return paginate(rows.map(mapSub), total, page, pageSize);
}

// ── Articles ───────────────────────────────────────────────────────────
export async function getPublishedArticles(limit?: number): Promise<Article[]> {
  const rows = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });
  return rows.map(mapArticle);
}
export async function getTrendingArticles(limit = 5): Promise<Article[]> {
  return getPublishedArticles(limit);
}
export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const row = await prisma.article.findUnique({ where: { slug } });
  return row ? mapArticle(row) : undefined;
}
export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  const explicitRows = await prisma.article.findMany({
    where: { relatedTo: { some: { fromArticleId: article.id } } },
    take: limit,
  });
  const explicit = explicitRows.map(mapArticle);
  if (explicit.length >= limit) return explicit;

  const category = (await prisma.article.findUnique({ where: { id: article.id } }))?.category;
  const fallback = await prisma.article.findMany({
    where: {
      id: { notIn: [article.id, ...explicit.map((a) => a.id)] },
      status: "PUBLISHED",
      ...(category ? { category } : {}),
    },
    take: limit - explicit.length,
  });
  return [...explicit, ...fallback.map(mapArticle)];
}
export async function getArticlesByProject(projectId: string): Promise<Article[]> {
  const rows = await prisma.article.findMany({ where: { projectId, status: "PUBLISHED" } });
  return rows.map(mapArticle);
}

// ── Admin: article review/publish workflow ──────────────────────────────
export async function getAllArticlesForAdmin(status?: Article["status"]): Promise<Article[]> {
  const rows = await prisma.article.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapArticle);
}
export async function getArticleById(id: string): Promise<Article | undefined> {
  const row = await prisma.article.findUnique({ where: { id } });
  return row ? mapArticle(row) : undefined;
}
export async function updateArticle(
  id: string,
  data: Partial<
    Pick<
      Article,
      | "headline"
      | "summary"
      | "body"
      | "category"
      | "status"
      | "location"
      | "timelineNote"
      | "whyItMatters"
      | "marketImpact"
      | "metaTitle"
      | "metaDescription"
    >
  >
): Promise<Article> {
  let publishedAtUpdate: { publishedAt: Date } | Record<string, never> = {};
  if (data.status === "PUBLISHED") {
    const existing = await prisma.article.findUnique({ where: { id }, select: { publishedAt: true } });
    if (!existing?.publishedAt) publishedAtUpdate = { publishedAt: new Date() };
  }
  const row = await prisma.article.update({
    where: { id },
    data: { ...data, ...publishedAtUpdate },
  });
  return mapArticle(row);
}

// ── Market stats ───────────────────────────────────────────────────────
export async function getMarketStats(): Promise<MarketStat[]> {
  const rows = await prisma.marketStat.findMany({ orderBy: { label: "asc" } });
  return rows.map(mapMarketStat);
}

// ── Reference lookups (async — see src/lib/types.ts note) ──────────────
export async function lookupCity(id?: string | null) {
  if (!id) return undefined;
  const row = await prisma.city.findUnique({ where: { id } });
  return row ? mapCity(row) : undefined;
}
export async function lookupCounty(id?: string | null) {
  if (!id) return undefined;
  const row = await prisma.county.findUnique({ where: { id } });
  return row ? mapCounty(row) : undefined;
}
export async function lookupDeveloper(id?: string | null) {
  if (!id) return undefined;
  return getDeveloperById(id);
}
export async function lookupGC(id?: string | null) {
  if (!id) return undefined;
  return getGeneralContractorById(id);
}
