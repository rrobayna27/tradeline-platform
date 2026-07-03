// Imports the founder's real bid log into the database.
//
// Data: prisma/import/bid-log.json — the cleaned, deduplicated extract of
// "Current Projects List 2026.numbers" (sheets: Current Projects + Sent
// Projects 2023–2026; 2,965 raw rows → 1,981 unique jobs, 2,503 job↔GC bid
// relationships, 509 unique GC companies). Duplicate rows (same job re-sent
// to the same GC) were collapsed during extraction.
//
// Guarantees:
// - IDEMPOTENT: projects are keyed by sourceName+sourceRecordId and GCs by
//   slug, so running this any number of times never duplicates a job.
// - PAYWALLED VALUE: contact emails land in gcContactEmail /
//   GeneralContractor.email, which the site only shows to Pro members
//   (server-side gating — see src/lib/viewer.ts).

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { Metro } from "@/lib/types";
import type { IngestSummary } from "@/lib/ingestion/miami-dade-permits";
import type { Prisma } from "@prisma/client";
import bidLog from "../../../prisma/import/bid-log.json";

export const SOURCE_NAME = "rene-bidlog";

interface BidEntry {
  gcName: string;
  gcKey: string;
  contact: string | null;
  emails: string[];
  lastBidDate: string | null;
  timesBid: number;
}

interface JobEntry {
  key: string;
  name: string;
  county: string | null;
  firstYear: number;
  lastYear: number;
  bids: BidEntry[];
}

const COUNTY_METRO: Record<string, Metro> = {
  "Miami-Dade": "SOUTHEAST",
  Broward: "SOUTHEAST",
  "Palm Beach": "SOUTHEAST",
  Monroe: "SOUTHEAST",
  Martin: "TREASURE_COAST",
  "St. Lucie": "TREASURE_COAST",
  "Indian River": "TREASURE_COAST",
  Okeechobee: "TREASURE_COAST",
  Lee: "SOUTHWEST",
  Collier: "SOUTHWEST",
  Charlotte: "SOUTHWEST",
  Sarasota: "SOUTHWEST",
  Manatee: "SOUTHWEST",
  Glades: "SOUTHWEST",
  Hendry: "SOUTHWEST",
  Hillsborough: "TAMPA_BAY",
  Pinellas: "TAMPA_BAY",
  Pasco: "TAMPA_BAY",
  Polk: "TAMPA_BAY",
  Orange: "ORLANDO_CENTRAL",
  Seminole: "ORLANDO_CENTRAL",
  Osceola: "ORLANDO_CENTRAL",
  Lake: "ORLANDO_CENTRAL",
  Brevard: "ORLANDO_CENTRAL",
  Volusia: "ORLANDO_CENTRAL",
  Sumter: "ORLANDO_CENTRAL",
  Duval: "NORTH_FLORIDA",
  "St. Johns": "NORTH_FLORIDA",
  Nassau: "NORTH_FLORIDA",
  Clay: "NORTH_FLORIDA",
  Flagler: "NORTH_FLORIDA",
  Alachua: "NORTH_FLORIDA",
};

const FALLBACK_COUNTY = "Miami-Dade"; // for the handful of rows with no county

export async function ingestBidLog(): Promise<IngestSummary> {
  const jobs = (bidLog as { jobs: JobEntry[] }).jobs;

  const summary: IngestSummary = {
    source: SOURCE_NAME,
    fetched: jobs.length,
    eligible: jobs.length,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  // 1. Counties (create any that don't exist yet). Matched by slug, not
  //    name — the app's existing counties are named "Miami-Dade County"
  //    etc. (see src/data/sample/geography.ts) while this bid log's keys
  //    are bare ("Miami-Dade"), so a name-based upsert would try to create
  //    a duplicate row that collides on the slug unique constraint.
  const countyNames = new Set<string>([FALLBACK_COUNTY]);
  for (const j of jobs) if (j.county) countyNames.add(j.county);
  const countyIdByName = new Map<string, string>();
  for (const name of countyNames) {
    const metro = COUNTY_METRO[name];
    if (!metro) {
      summary.errors.push(`No metro mapping for county "${name}" — skipped its jobs.`);
      continue;
    }
    const slug = slugify(name);
    const county = await prisma.county.upsert({
      where: { slug },
      update: {},
      create: { name: `${name} County`, slug, metro },
    });
    countyIdByName.set(name, county.id);
  }

  // 2. General contractors (the bid log's "Client" column), keyed by slug.
  //    Name variants that normalize to the same slug merge into one record.
  const latestByGcKey = new Map<string, BidEntry>();
  for (const j of jobs) {
    for (const b of j.bids) {
      const known = latestByGcKey.get(b.gcKey);
      if (!known || (b.lastBidDate ?? "") > (known.lastBidDate ?? "")) latestByGcKey.set(b.gcKey, b);
    }
  }
  const gcIdByKey = new Map<string, string>();
  const existingGcs = await prisma.generalContractor.findMany({
    select: { id: true, slug: true, email: true, isClaimed: true },
  });
  const gcBySlug = new Map(existingGcs.map((g) => [g.slug, g]));
  for (const [key, b] of latestByGcKey) {
    const slug = slugify(b.gcName) || slugify(`gc-${key}`);
    const existing = gcBySlug.get(slug);
    if (existing) {
      gcIdByKey.set(key, existing.id);
      if (!existing.email && b.emails[0] && !existing.isClaimed) {
        await prisma.generalContractor.update({
          where: { id: existing.id },
          data: { email: b.emails[0] },
        });
      }
      continue;
    }
    const created = await prisma.generalContractor.create({
      data: {
        name: b.gcName,
        slug,
        email: b.emails[0] ?? null,
        isSample: false,
        isClaimed: false,
        marketsServed: ["SOUTHEAST"],
      },
    });
    gcBySlug.set(slug, { id: created.id, slug, email: created.email, isClaimed: false });
    gcIdByKey.set(key, created.id);
  }

  // 3. Projects — one per unique job. Existing source records are skipped
  //    (never duplicated); everything else is batch-created.
  const existingProjects = await prisma.project.findMany({
    where: { sourceName: SOURCE_NAME },
    select: { sourceRecordId: true },
  });
  const existingKeys = new Set(existingProjects.map((p) => p.sourceRecordId));
  const usedSlugs = new Set(
    (await prisma.project.findMany({ select: { slug: true } })).map((p) => p.slug)
  );

  const toCreate: Prisma.ProjectCreateManyInput[] = [];
  for (const j of jobs) {
    try {
      if (existingKeys.has(j.key)) {
        summary.updated++;
        continue;
      }
      const countyName = j.county && countyIdByName.has(j.county) ? j.county : FALLBACK_COUNTY;
      const countyId = countyIdByName.get(countyName);
      if (!countyId) {
        summary.skipped++;
        continue;
      }
      const primary = j.bids[0]; // most recent bid = primary GC relationship
      let slug = slugify(`${j.name}-${countyName}`) || slugify(`bid-${j.key}`);
      const base = slug;
      for (let i = 2; usedSlugs.has(slug); i++) slug = `${base}-${i}`;
      usedSlugs.add(slug);

      const bidNote =
        j.bids.length > 1
          ? ` Bid to ${j.bids.length} general contractors between ${j.firstYear} and ${j.lastYear}.`
          : "";
      toCreate.push({
        name: j.name,
        slug,
        countyId,
        generalContractorId: primary ? (gcIdByKey.get(primary.gcKey) ?? null) : null,
        gcContactEmail: primary?.emails[0] ?? null,
        projectType: "OTHER",
        status: "PROPOSED",
        bidPhase: j.lastYear >= 2026 ? "BIDDING_OPEN" : "BIDDING_CLOSED",
        description: `${j.name} — tracked from our own bid history (${j.firstYear}${
          j.lastYear !== j.firstYear ? `–${j.lastYear}` : ""
        }).${bidNote}`,
        isSample: false,
        sourceName: SOURCE_NAME,
        sourceRecordId: j.key,
        sourceUpdatedAt: new Date(),
      });
    } catch (err) {
      summary.errors.push(`${j.key}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Batch insert in chunks to stay well inside serverless time limits.
  const CHUNK = 250;
  for (let i = 0; i < toCreate.length; i += CHUNK) {
    const chunk = toCreate.slice(i, i + CHUNK);
    const res = await prisma.project.createMany({ data: chunk, skipDuplicates: true });
    summary.created += res.count;
  }

  return summary;
}
