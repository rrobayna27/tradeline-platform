import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getGeneralContractors, getPublishedArticles, searchProjects, searchSubcontractors } from "@/lib/repositories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/news",
    "/projects",
    "/map",
    "/general-contractors",
    "/subcontractors",
    "/join",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const [{ items: projects }, articles, generalContractors, { items: subcontractors }] = await Promise.all([
    searchProjects({ pageSize: 5000 }),
    getPublishedArticles(),
    getGeneralContractors(),
    searchSubcontractors({ pageSize: 5000 }),
  ]);

  const projectRoutes = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const articleRoutes = articles.map((a) => ({
    url: `${SITE_URL}/news/${a.slug}`,
    lastModified: new Date(a.publishedAt ?? Date.now()),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const gcRoutes = generalContractors.map((g) => ({
    url: `${SITE_URL}/general-contractors/${g.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const subRoutes = subcontractors.map((s) => ({
    url: `${SITE_URL}/subcontractors/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...projectRoutes, ...articleRoutes, ...gcRoutes, ...subRoutes];
}
