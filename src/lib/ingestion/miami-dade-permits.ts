// Ingests real building permits from Miami-Dade County's official public
// ArcGIS open-data feed and upserts them into the Project table.
//
// Source: Miami-Dade County GIS Technical Support Group, "Building Permit"
// feature service — a point layer of county building permits, updated
// weekly (Fridays), published for public reuse ("Miami-Dade County
// provides this data for use 'as is'"). This is the county's own open-data
// portal, not a third-party aggregator — it does not fall under the
// DemandStar/ConstructConnect/Dodge scraping restriction in DECISIONS.md.
// Service metadata: https://gis-mdc.opendata.arcgis.com/datasets/MDC::building-permit
//
// This only reads BLDG-type permits above a minimum estimated value, to
// focus on projects worth tracking rather than every homeowner repair
// permit (window replacements, water heaters, etc. are excluded).

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { ProjectType } from "@/lib/types";

export const SOURCE_NAME = "miami-dade-permits";
const FEATURE_SERVICE_QUERY_URL =
  "https://services.arcgis.com/8Pc9XBTAsYuxx9Ny/arcgis/rest/services/BuildingPermit_gdb/FeatureServer/0/query";
const DATASET_PAGE_URL = "https://gis-mdc.opendata.arcgis.com/datasets/MDC::building-permit";

const MIN_ESTIMATED_VALUE = 100_000;
const LOOKBACK_DAYS = 365;
const MAX_RECORDS_PER_RUN = 200;

interface ArcGisPermitAttributes {
  OBJECTID: number;
  ADDRESS: string | null;
  STNDADDR: string | null;
  PROCNUM: string | null;
  FOLIO: string | null;
  TYPE: string | null;
  CAT1: string | null;
  DESC1: string | null;
  ISSUDATE: number | null; // epoch millis
  BPSTATUS: "A" | "E" | "F" | null;
  RESCOMM: "R" | "C" | null;
  PROPUSE: string | null;
  ESTVALUE: string | null; // zero-padded numeric string, e.g. "00000250000"
  CONTRNUM: string | null;
  CONTRNAME: string | null;
  BLDCMPDT: string | null; // "YYYYMMDD" or "00000000" if unset
}

interface ArcGisFeature {
  attributes: ArcGisPermitAttributes;
  geometry?: { x: number; y: number };
}

interface ArcGisQueryResponse {
  features: ArcGisFeature[];
  error?: { message: string; details?: string[] };
}

function buildQueryUrl(): string {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - LOOKBACK_DAYS);
  const sqlDate = cutoff.toISOString().slice(0, 19).replace("T", " ");

  const where = `TYPE='BLDG' AND BPSTATUS IN ('A','F') AND ISSUDATE >= TIMESTAMP '${sqlDate}'`;

  const params = new URLSearchParams({
    where,
    outFields:
      "OBJECTID,ADDRESS,STNDADDR,PROCNUM,FOLIO,TYPE,CAT1,DESC1,ISSUDATE,BPSTATUS,RESCOMM,PROPUSE,ESTVALUE,CONTRNUM,CONTRNAME,BLDCMPDT",
    orderByFields: "ISSUDATE DESC",
    resultRecordCount: String(MAX_RECORDS_PER_RUN),
    outSR: "4326", // ask the server to reproject to plain lat/lng for us
    returnGeometry: "true",
    f: "json",
  });

  return `${FEATURE_SERVICE_QUERY_URL}?${params.toString()}`;
}

function parseEstValue(raw: string | null): number | null {
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function guessProjectType(rescomm: string | null, desc: string): ProjectType {
  const d = desc.toUpperCase();
  if (rescomm === "R") {
    if (/(APT|APARTMENT|CONDO|TOWNHOME|TOWNHOUSE|MULTIFAM)/.test(d)) return "MULTIFAMILY";
    return "RESIDENTIAL_SINGLE_FAMILY";
  }
  if (/(HOTEL|MOTEL|RESORT)/.test(d)) return "HOSPITALITY";
  if (/(SCHOOL|UNIVERSITY|COLLEGE|CAMPUS)/.test(d)) return "EDUCATION";
  if (/(HOSPITAL|MEDICAL|CLINIC|HEALTH)/.test(d)) return "HEALTHCARE";
  if (/(OFFICE)/.test(d)) return "OFFICE";
  if (/(RETAIL|STORE|SHOP|SHOPPING)/.test(d)) return "RETAIL";
  if (/(WAREHOUSE|INDUSTRIAL|DISTRIBUTION|MANUFACTUR)/.test(d)) return "INDUSTRIAL";
  if (/(CHURCH|TEMPLE|MOSQUE|RELIGIOUS)/.test(d)) return "RELIGIOUS";
  if (/(GOVERNMENT|MUNICIPAL|COUNTY|CITY HALL|COURT)/.test(d)) return "GOVERNMENT_INSTITUTIONAL";
  if (/(APT|APARTMENT|CONDO|RESIDENT)/.test(d)) return "MULTIFAMILY";
  return "OTHER";
}

const KEEP_UPPERCASE = new Set([
  "NW",
  "NE",
  "SW",
  "SE",
  "N",
  "S",
  "E",
  "W",
  "ST",
  "AVE",
  "BLVD",
  "DR",
  "CT",
  "PL",
  "TER",
  "HWY",
  "RD",
  "LLC",
  "LLP",
  "INC",
  "CO",
]);

function titleCase(s: string): string {
  return s
    .trim()
    .split(/\s+/)
    .map((word) => {
      const upper = word.toUpperCase().replace(/[.,]/g, "");
      if (KEEP_UPPERCASE.has(upper)) return upper;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

export interface IngestSummary {
  source: string;
  fetched: number;
  eligible: number;
  created: number;
  updated: number;
  skipped: number;
  errors: string[];
}

export async function ingestMiamiDadePermits(): Promise<IngestSummary> {
  const county = await prisma.county.findUnique({ where: { slug: "miami-dade" } });
  if (!county) {
    throw new Error(
      "No County with slug 'miami-dade' found — run `prisma db seed` first so the base geography exists."
    );
  }

  const res = await fetch(buildQueryUrl(), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Miami-Dade permit feed request failed: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as ArcGisQueryResponse;
  if (data.error) {
    throw new Error(`Miami-Dade permit feed error: ${data.error.message}`);
  }

  const summary: IngestSummary = {
    source: SOURCE_NAME,
    fetched: data.features.length,
    eligible: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  for (const feature of data.features) {
    const a = feature.attributes;
    try {
      const estValue = parseEstValue(a.ESTVALUE);
      if (!a.PROCNUM || !estValue || estValue < MIN_ESTIMATED_VALUE) {
        summary.skipped++;
        continue;
      }
      summary.eligible++;

      const address = (a.STNDADDR ?? a.ADDRESS ?? "").trim();
      const desc = (a.DESC1 ?? "").trim();
      const status = a.BPSTATUS === "F" ? "COMPLETED" : "PERMITTED";
      const projectType = guessProjectType(a.RESCOMM, desc || a.TYPE || "");
      const issueDate = a.ISSUDATE ? new Date(a.ISSUDATE) : null;

      const name = `${titleCase(desc) || "Building Permit"} — ${titleCase(address) || "Miami-Dade County"}`;
      const slug = slugify(`${address}-${a.PROCNUM}`) || slugify(`mdc-permit-${a.PROCNUM}`);

      // Resolve (or create) the general contractor of record, when named.
      let generalContractorId: string | undefined;
      const contractorName = (a.CONTRNAME ?? "").trim();
      const licenseNumber = (a.CONTRNUM ?? "").trim();
      if (contractorName && contractorName.toUpperCase() !== "OWNER") {
        const existing = licenseNumber
          ? await prisma.generalContractor.findFirst({
              where: {
                OR: [{ licenseNumber }, { name: { equals: contractorName, mode: "insensitive" } }],
              },
            })
          : await prisma.generalContractor.findFirst({
              where: { name: { equals: contractorName, mode: "insensitive" } },
            });
        if (existing) {
          generalContractorId = existing.id;
        } else {
          const gcSlug = slugify(contractorName) || slugify(`contractor-${licenseNumber || a.PROCNUM}`);
          const created = await prisma.generalContractor.create({
            data: {
              name: titleCase(contractorName),
              slug: gcSlug,
              licenseNumber: licenseNumber || null,
              isSample: false,
              isClaimed: false,
              marketsServed: ["SOUTHEAST"],
            },
          });
          generalContractorId = created.id;
        }
      }

      const description = `${titleCase(desc) || "Building"} permit for ${titleCase(address)}, issued ${
        issueDate ? issueDate.toLocaleDateString("en-US") : "recently"
      }.${contractorName ? ` Contractor of record: ${titleCase(contractorName)}.` : ""} Sourced automatically from Miami-Dade County's public building permit feed.`;

      const result = await prisma.project.upsert({
        where: { sourceName_sourceRecordId: { sourceName: SOURCE_NAME, sourceRecordId: a.PROCNUM } },
        update: {
          status,
          estimatedValueUsd: estValue,
          description,
          generalContractorId,
          sourceUpdatedAt: new Date(),
        },
        create: {
          name,
          slug,
          address: titleCase(address) || null,
          countyId: county.id,
          latitude: feature.geometry?.y ?? null,
          longitude: feature.geometry?.x ?? null,
          generalContractorId,
          estimatedValueUsd: estValue,
          projectType,
          status,
          description,
          isFeatured: false,
          isSample: false,
          sourceName: SOURCE_NAME,
          sourceRecordId: a.PROCNUM,
          sourceUrl: DATASET_PAGE_URL,
          sourceUpdatedAt: new Date(),
        },
      });

      // Prisma upsert doesn't tell us which branch ran; infer from timestamps.
      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        summary.created++;
      } else {
        summary.updated++;
      }
    } catch (err) {
      summary.errors.push(`${a.PROCNUM ?? a.OBJECTID}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return summary;
}
