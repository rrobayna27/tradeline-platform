// Hand-written domain types mirroring prisma/schema.prisma.
//
// Why these exist instead of importing from "@prisma/client": generating the
// real Prisma Client requires downloading its query/schema-engine binaries
// from binaries.prisma.sh, which this build sandbox's network policy blocks.
// That download works fine on a normal dev machine, CI runner, or Vercel —
// it is purely a limitation of *this* session's sandbox. Once `DATABASE_URL`
// points at a real Postgres and `npx prisma generate` has been run somewhere
// with normal internet access, swap the repository implementation in
// `src/lib/repositories/*` from the in-memory provider to the Prisma-backed
// one in `src/lib/repositories/prisma/*` (already written, ready to go) and
// these hand types can be replaced by the generated ones one model at a time.

export type Metro =
  | "SOUTHEAST"
  | "TREASURE_COAST"
  | "SOUTHWEST"
  | "TAMPA_BAY"
  | "ORLANDO_CENTRAL";

export type ProjectStatus =
  | "PROPOSED"
  | "PLANNING"
  | "APPROVED"
  | "PERMITTED"
  | "SITE_WORK"
  | "FOUNDATION"
  | "VERTICAL_CONSTRUCTION"
  | "TOPPED_OUT"
  | "FINISHING"
  | "COMPLETED"
  | "CANCELLED"
  | "ON_HOLD";

export type ProjectType =
  | "RESIDENTIAL_SINGLE_FAMILY"
  | "MULTIFAMILY"
  | "MIXED_USE"
  | "OFFICE"
  | "RETAIL"
  | "INDUSTRIAL"
  | "HOSPITALITY"
  | "HEALTHCARE"
  | "EDUCATION"
  | "GOVERNMENT_INSTITUTIONAL"
  | "INFRASTRUCTURE"
  | "RELIGIOUS"
  | "OTHER";

export type BidPhase =
  | "NOT_YET_BIDDING"
  | "BIDDING_OPEN"
  | "BIDDING_CLOSED"
  | "AWARDED"
  | "NOT_APPLICABLE";

export type CompanySize = "MICRO" | "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE";
export type PlanTier = "FREE" | "PRO";
export type UnionStatus = "UNION" | "NON_UNION" | "BOTH";
export type Role = "ADMIN" | "GC" | "SUB" | "MEMBER";
export type ArticleStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
export type ArticleCategory =
  | "BREAKING_DEVELOPMENT"
  | "NEW_PROJECT"
  | "PERMIT_FILING"
  | "COMMISSION_MEETING"
  | "MARKET_ANALYSIS"
  | "COMPANY_NEWS"
  | "POLICY_REGULATION";

export interface County {
  id: string;
  name: string;
  slug: string;
  metro: Metro;
  state: string;
  isLive: boolean;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  countyId: string;
}

export interface Trade {
  id: string;
  name: string;
  slug: string;
  isCustom?: boolean;
}

export interface Developer {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  description?: string | null;
  website?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface GeneralContractorOffice {
  id: string;
  label?: string | null;
  cityName?: string | null;
  address?: string | null;
  phone?: string | null;
}

export interface GeneralContractor {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  description?: string | null;
  website?: string | null;
  phone?: string | null;
  email?: string | null;
  companySize?: CompanySize | null;
  marketsServed: Metro[];
  isFeatured: boolean;
  isClaimed: boolean;
  planTier: PlanTier;
  offices: GeneralContractorOffice[];
  createdAt: string;
}

export interface Certification {
  id: string;
  name: string;
  issuedBy?: string | null;
}

export interface Subcontractor {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  description?: string | null;
  website?: string | null;
  phone?: string | null;
  email?: string | null;
  licenseNumber?: string | null;
  insuranceVerified: boolean;
  yearsInBusiness?: number | null;
  companySize?: CompanySize | null;
  isMinorityOwned?: boolean | null;
  isWBE?: boolean | null;
  unionStatus?: UnionStatus | null;
  isFeatured: boolean;
  isClaimed: boolean;
  planTier: PlanTier;
  tradeIds: string[];
  countyIds: string[];
  certifications: Certification[];
  galleryUrls: string[];
  createdAt: string;
}

export interface ProjectUpdateEntry {
  id: string;
  title: string;
  body: string;
  eventDate: string;
}

export interface ProjectPhoto {
  id: string;
  url: string;
  caption?: string | null;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  address?: string | null;
  cityId?: string | null;
  countyId: string;
  latitude?: number | null;
  longitude?: number | null;
  developerId?: string | null;
  owner?: string | null;
  generalContractorId?: string | null;
  architect?: string | null;
  engineer?: string | null;
  estimatedValueUsd?: number | null;
  projectType: ProjectType;
  status: ProjectStatus;
  bidPhase: BidPhase;
  estimatedCompletion?: string | null;
  description?: string | null;
  whyItMatters?: string | null;
  marketImpact?: string | null;
  gcContactPhone?: string | null;
  gcContactEmail?: string | null;
  gcContactWebsite?: string | null;
  tradeIds: string[];
  isFeatured: boolean;
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
  updates: ProjectUpdateEntry[];
  photos: ProjectPhoto[];
  nearbyProjectIds: string[];
}

export interface Article {
  id: string;
  headline: string;
  slug: string;
  summary: string;
  body: string;
  featuredImageUrl?: string | null;
  category: ArticleCategory;
  status: ArticleStatus;
  projectId?: string | null;
  developerId?: string | null;
  location?: string | null;
  timelineNote?: string | null;
  whyItMatters?: string | null;
  marketImpact?: string | null;
  authorName: string;
  isSample: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImageUrl?: string | null;
  publishedAt?: string | null;
  relatedArticleIds: string[];
  relatedProjectIds: string[];
}

export interface MarketStat {
  id: string;
  metro: Metro;
  label: string;
  value: string;
}

export interface ProjectSearchFilters {
  county?: string;
  city?: string;
  developer?: string;
  generalContractor?: string;
  architect?: string;
  projectType?: ProjectType;
  status?: ProjectStatus;
  minValue?: number;
  maxValue?: number;
  completionYear?: number;
  keyword?: string;
  trade?: string;
  page?: number;
  pageSize?: number;
}

export interface SubcontractorSearchFilters {
  trade?: string;
  county?: string;
  city?: string;
  licenseNumber?: string;
  minYears?: number;
  name?: string;
  page?: number;
  pageSize?: number;
}
