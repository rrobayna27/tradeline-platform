// Real seed script for a connected Postgres database. Not runnable in this
// build sandbox — `npx prisma generate` requires downloading engine binaries
// from binaries.prisma.sh, which this sandbox's network policy blocks (see
// src/lib/types.ts for the full explanation). It works normally anywhere
// with regular internet access.
//
// Once DATABASE_URL points at a real Postgres instance:
//   npx prisma generate
//   npx prisma db push
//   npx prisma db seed
//
// This seeds the exact same sample/illustrative data that powers the
// in-memory repository today (src/data/sample/*), so the live site and the
// current build show identical content on day one.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  articles,
  cities,
  counties,
  developers,
  generalContractors,
  marketStats,
  projects,
  subcontractors,
  trades,
} from "../src/data/sample";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding counties...");
  for (const county of counties) {
    await prisma.county.upsert({
      where: { slug: county.slug },
      update: { name: county.name, metro: county.metro, isLive: county.isLive },
      create: {
        id: county.id,
        name: county.name,
        slug: county.slug,
        metro: county.metro,
        state: county.state,
        isLive: county.isLive,
      },
    });
  }

  console.log("Seeding cities...");
  for (const city of cities) {
    await prisma.city.upsert({
      where: { id: city.id },
      update: { name: city.name },
      create: { id: city.id, name: city.name, slug: city.slug, countyId: city.countyId },
    });
  }

  console.log("Seeding trades...");
  for (const trade of trades) {
    await prisma.trade.upsert({
      where: { slug: trade.slug },
      update: { name: trade.name },
      create: { id: trade.id, name: trade.name, slug: trade.slug, isCustom: trade.isCustom ?? false },
    });
  }

  console.log("Seeding developers...");
  for (const dev of developers) {
    await prisma.developer.upsert({
      where: { slug: dev.slug },
      update: { name: dev.name, description: dev.description, website: dev.website },
      create: {
        id: dev.id,
        name: dev.name,
        slug: dev.slug,
        description: dev.description,
        website: dev.website,
        phone: dev.phone,
        email: dev.email,
      },
    });
  }

  console.log("Seeding general contractors...");
  for (const gc of generalContractors) {
    await prisma.generalContractor.upsert({
      where: { slug: gc.slug },
      update: {
        name: gc.name,
        description: gc.description,
        isFeatured: gc.isFeatured,
        isClaimed: gc.isClaimed,
        planTier: gc.planTier,
      },
      create: {
        id: gc.id,
        name: gc.name,
        slug: gc.slug,
        description: gc.description,
        website: gc.website,
        phone: gc.phone,
        email: gc.email,
        companySize: gc.companySize ?? undefined,
        marketsServed: gc.marketsServed,
        isFeatured: gc.isFeatured,
        isClaimed: gc.isClaimed,
        planTier: gc.planTier,
        offices: {
          create: gc.offices.map((o) => ({
            label: o.label,
            address: o.address,
            phone: o.phone,
          })),
        },
      },
    });
  }

  console.log("Seeding subcontractors...");
  for (const sub of subcontractors) {
    await prisma.subcontractor.upsert({
      where: { slug: sub.slug },
      update: {
        name: sub.name,
        description: sub.description,
        isFeatured: sub.isFeatured,
      },
      create: {
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        description: sub.description,
        website: sub.website,
        phone: sub.phone,
        email: sub.email,
        licenseNumber: sub.licenseNumber,
        insuranceVerified: sub.insuranceVerified,
        yearsInBusiness: sub.yearsInBusiness,
        companySize: sub.companySize ?? undefined,
        isMinorityOwned: sub.isMinorityOwned,
        isWBE: sub.isWBE,
        unionStatus: sub.unionStatus ?? undefined,
        isFeatured: sub.isFeatured,
        isClaimed: sub.isClaimed,
        planTier: sub.planTier,
        trades: {
          create: sub.tradeIds.map((tradeId) => ({ tradeId })),
        },
        serviceAreas: {
          create: sub.countyIds.map((countyId) => ({ countyId })),
        },
        certifications: {
          create: sub.certifications.map((c) => ({ name: c.name, issuedBy: c.issuedBy })),
        },
      },
    });
  }

  console.log("Seeding projects...");
  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        name: project.name,
        status: project.status,
        bidPhase: project.bidPhase,
      },
      create: {
        id: project.id,
        name: project.name,
        slug: project.slug,
        address: project.address,
        cityId: project.cityId,
        countyId: project.countyId,
        latitude: project.latitude,
        longitude: project.longitude,
        developerId: project.developerId,
        owner: project.owner,
        generalContractorId: project.generalContractorId,
        architect: project.architect,
        engineer: project.engineer,
        estimatedValueUsd: project.estimatedValueUsd,
        projectType: project.projectType,
        status: project.status,
        bidPhase: project.bidPhase,
        estimatedCompletion: project.estimatedCompletion ? new Date(project.estimatedCompletion) : null,
        description: project.description,
        whyItMatters: project.whyItMatters,
        marketImpact: project.marketImpact,
        gcContactPhone: project.gcContactPhone,
        gcContactEmail: project.gcContactEmail,
        gcContactWebsite: project.gcContactWebsite,
        isFeatured: project.isFeatured,
        isSample: project.isSample,
        tradesLikelyNeeded: {
          create: project.tradeIds.map((tradeId) => ({ tradeId })),
        },
        updates: {
          create: project.updates.map((u) => ({
            title: u.title,
            body: u.body,
            eventDate: new Date(u.eventDate),
          })),
        },
        photos: {
          create: project.photos.map((p) => ({ url: p.url, caption: p.caption })),
        },
      },
    });
  }

  console.log("Linking nearby projects...");
  for (const project of projects) {
    for (const nearbyId of project.nearbyProjectIds) {
      await prisma.nearbyProject
        .upsert({
          where: { fromProjectId_toProjectId: { fromProjectId: project.id, toProjectId: nearbyId } },
          update: {},
          create: { fromProjectId: project.id, toProjectId: nearbyId },
        })
        .catch(() => undefined); // ignore if either project id isn't seeded yet
    }
  }

  console.log("Seeding articles...");
  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: { headline: article.headline, status: article.status },
      create: {
        id: article.id,
        headline: article.headline,
        slug: article.slug,
        summary: article.summary,
        body: article.body,
        featuredImageUrl: article.featuredImageUrl,
        category: article.category,
        status: article.status,
        projectId: article.projectId,
        developerId: article.developerId,
        location: article.location,
        timelineNote: article.timelineNote,
        whyItMatters: article.whyItMatters,
        marketImpact: article.marketImpact,
        authorName: article.authorName,
        isSample: article.isSample,
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
        ogImageUrl: article.ogImageUrl,
        publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
      },
    });
  }

  console.log("Linking related articles...");
  for (const article of articles) {
    for (const relatedId of article.relatedArticleIds) {
      await prisma.articleRelation
        .upsert({
          where: { fromArticleId_toArticleId: { fromArticleId: article.id, toArticleId: relatedId } },
          update: {},
          create: { fromArticleId: article.id, toArticleId: relatedId },
        })
        .catch(() => undefined);
    }
  }

  console.log("Seeding market stats...");
  for (const stat of marketStats) {
    await prisma.marketStat.upsert({
      where: { id: stat.id },
      update: { value: stat.value },
      create: { id: stat.id, metro: stat.metro, label: stat.label, value: stat.value },
    });
  }

  console.log("Seeding demo admin user...");
  const passwordHash = await bcrypt.hash("tradeline-demo", 10);
  await prisma.user.upsert({
    where: { email: "admin@tradelinefl.com" },
    update: {},
    create: {
      name: "Tradeline Admin",
      email: "admin@tradelinefl.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
