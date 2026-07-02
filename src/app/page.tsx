import Link from "next/link";
import { ArrowRight, Map as MapIcon } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { Section, SectionHeading } from "@/components/shared/section";
import { ProjectCard } from "@/components/project/project-card";
import { ArticleCard } from "@/components/article/article-card";
import { GCCard } from "@/components/company/gc-card";
import { SubCard } from "@/components/company/sub-card";
import { CompanyAvatar } from "@/components/company/company-avatar";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { LinkButton } from "@/components/ui/button";
import {
  getBreakingGroundProjects,
  getCompletedProjects,
  getFeaturedGeneralContractors,
  getFeaturedSubcontractors,
  getMarketStats,
  getNewestCompanies,
  getNewestProjects,
  getPublishedArticles,
  getRecentlyApprovedProjects,
  getTrendingArticles,
  getUnderConstructionProjects,
} from "@/lib/repositories";

export const revalidate = 3600;

export default async function HomePage() {
  const [
    stats,
    latestArticles,
    trendingArticles,
    newestProjects,
    approvedProjects,
    breakingGroundProjects,
    underConstructionProjects,
    completedProjects,
    featuredGCs,
    featuredSubs,
    newestCompanies,
  ] = await Promise.all([
    getMarketStats(),
    getPublishedArticles(3),
    getTrendingArticles(4),
    getNewestProjects(4),
    getRecentlyApprovedProjects(4),
    getBreakingGroundProjects(4),
    getUnderConstructionProjects(4),
    getCompletedProjects(4),
    getFeaturedGeneralContractors(4),
    getFeaturedSubcontractors(4),
    getNewestCompanies(6),
  ]);

  return (
    <>
      <Hero stats={stats} />

      <Section className="pb-0">
        <SectionHeading eyebrow="Newsroom" title="Latest construction news" viewAllHref="/news" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {latestArticles.map((article, i) => (
            <ArticleCard key={article.id} article={article} featured={i === 0} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Breaking"
          title="Breaking developments"
          description="Original reporting on projects in motion this week."
          viewAllHref="/news"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trendingArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </Section>

      <Section className="bg-surface">
        <SectionHeading eyebrow="Project database" title="Newest projects" viewAllHref="/projects" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newestProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Pipeline"
          title="Recently approved projects"
          description="Approved and freshly permitted work entering the bid cycle."
          viewAllHref="/projects?status=APPROVED"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {approvedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Section>

      <Section className="bg-surface">
        <SectionHeading eyebrow="Pipeline" title="Projects breaking ground" viewAllHref="/projects?status=SITE_WORK" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {breakingGroundProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Pipeline" title="Under construction" viewAllHref="/projects?status=VERTICAL_CONSTRUCTION" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {underConstructionProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Section>

      <Section className="bg-surface">
        <SectionHeading eyebrow="Pipeline" title="Recently completed" viewAllHref="/projects?status=COMPLETED" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {completedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="overflow-hidden rounded-2xl border border-border bg-navy-900">
          <div className="grid grid-cols-1 items-center gap-8 p-8 md:grid-cols-2 md:p-12">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-teal-400">Interactive map</p>
              <h2 className="text-2xl font-semibold text-white md:text-3xl">
                Every tracked project, plotted across South Florida
              </h2>
              <p className="mt-3 text-white/70">
                Filter by status, county, or project type and click any pin to jump straight to the
                project page.
              </p>
              <LinkButton href="/map" size="lg" className="mt-6">
                <MapIcon size={17} />
                Open the map
              </LinkButton>
            </div>
            <div className="grid grid-cols-3 gap-3 opacity-90">
              {[
                "--color-status-permitted",
                "--color-status-vertical",
                "--color-status-completed",
                "--color-status-sitework",
                "--color-status-foundation",
                "--color-status-onhold",
              ].map((c) => (
                <div
                  key={c}
                  className="flex aspect-square items-center justify-center rounded-xl border border-white/10"
                  style={{ backgroundColor: `color-mix(in srgb, var(${c}) 22%, transparent)` }}
                >
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: `var(${c})` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-surface">
        <SectionHeading eyebrow="Directory" title="Featured general contractors" viewAllHref="/general-contractors" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredGCs.map((gc) => (
            <GCCard key={gc.id} gc={gc} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Directory" title="Featured subcontractors" viewAllHref="/subcontractors" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredSubs.map((sub) => (
            <SubCard key={sub.id} sub={sub} />
          ))}
        </div>
      </Section>

      <Section className="bg-surface">
        <SectionHeading eyebrow="Directory" title="Newest companies on Tradeline" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {newestCompanies.map((c) => (
            <Link
              key={c.id}
              href={c.kind === "gc" ? `/general-contractors/${c.slug}` : `/subcontractors/${c.slug}`}
              className="group flex items-center gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent/40"
            >
              <CompanyAvatar name={c.name} className="h-10 w-10 text-xs" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground group-hover:text-accent">{c.name}</p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {c.kind === "gc" ? "General Contractor" : "Subcontractor"}
                </p>
              </div>
              <ArrowRight size={14} className="ml-auto shrink-0 text-muted-foreground group-hover:text-accent" />
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <div className="rounded-2xl border border-border bg-surface p-8 text-center md:p-12">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">Weekly digest</p>
          <h2 className="mx-auto max-w-xl text-2xl font-semibold text-foreground md:text-3xl">
            New projects, breaking ground, and major permits — every Monday.
          </h2>
          <div className="mx-auto mt-6 max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </Section>
    </>
  );
}
