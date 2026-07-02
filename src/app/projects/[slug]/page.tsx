import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Building2, CalendarDays, MapPin, Phone, Mail, Globe, HardHat } from "lucide-react";
import { Section } from "@/components/shared/section";
import { StatusBadge, SampleDataBadge, Badge } from "@/components/ui/badge";
import { ProjectRow } from "@/components/project/project-card";
import { ArticleCard } from "@/components/article/article-card";
import { LinkButton } from "@/components/ui/button";
import {
  getArticlesByProject,
  getGeneralContractorById,
  getNearbyProjects,
  getProjectBySlug,
  searchProjects,
} from "@/lib/repositories";
import { PROJECT_STATUS_LABELS, PROJECT_TYPE_LABELS, SITE_URL } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const { items } = await searchProjects({ pageSize: 1000 });
  return items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  const title = `${project.name} — ${project.cityName ?? ""} Project Profile`;
  const description = project.description ?? `${project.name} project details, timeline, and status.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/projects/${project.slug}` },
    openGraph: { title, description, type: "article" },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [nearby, relatedArticles, gc] = await Promise.all([
    getNearbyProjects(project, 4),
    getArticlesByProject(project.id),
    project.generalContractorId ? getGeneralContractorById(project.generalContractorId) : Promise.resolve(undefined),
  ]);

  const trades = project.tradeNames ?? [];
  const latestUpdate = project.updates[0];

  // Schema.org has no canonical "construction project" type, so this models
  // the project as a Place with a PostalAddress — a valid, indexable
  // structure search engines can parse for location-based results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: project.name,
    description: project.description,
    address: project.address
      ? {
          "@type": "PostalAddress",
          streetAddress: project.address,
          addressLocality: project.cityName,
          addressRegion: "FL",
        }
      : undefined,
    geo:
      project.latitude && project.longitude
        ? { "@type": "GeoCoordinates", latitude: project.latitude, longitude: project.longitude }
        : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="border-b border-border bg-surface">
        <Section className="py-10 md:py-14">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} />
            <Badge>{PROJECT_TYPE_LABELS[project.projectType]}</Badge>
            {project.isSample && <SampleDataBadge />}
          </div>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {project.name}
          </h1>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin size={15} />
            {project.address ? `${project.address}, ` : ""}
            {project.cityName}, {project.countyName}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-4">
            <Stat label="Estimated value" value={formatCurrency(project.estimatedValueUsd)} />
            <Stat label="Est. completion" value={formatDate(project.estimatedCompletion)} />
            <Stat label="Developer" value={project.developerName ?? project.owner ?? "—"} />
            <Stat label="General contractor" value={project.generalContractorName ?? "—"} />
          </div>
        </Section>
      </div>

      <Section className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
        <div className="min-w-0 space-y-12">
          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Project description</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>
          </div>

          {project.whyItMatters && (
            <div>
              <h2 className="mb-3 text-lg font-semibold text-foreground">Why it matters</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{project.whyItMatters}</p>
            </div>
          )}

          {project.marketImpact && (
            <div>
              <h2 className="mb-3 text-lg font-semibold text-foreground">Market impact</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{project.marketImpact}</p>
            </div>
          )}

          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Timeline</h2>
            <ol className="space-y-6 border-l border-border pl-6">
              {project.updates.length === 0 && (
                <p className="text-sm text-muted-foreground">No updates logged yet.</p>
              )}
              {project.updates.map((u) => (
                <li key={u.id} className="relative">
                  <span className="absolute -left-[29px] top-1 h-2.5 w-2.5 rounded-full bg-accent" />
                  <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    {formatDate(u.eventDate)}
                  </p>
                  <p className="mt-1 font-medium text-foreground">{u.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{u.body}</p>
                </li>
              ))}
            </ol>
          </div>

          {relatedArticles.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">Related news</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {relatedArticles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          )}

          {nearby.length > 0 && (
            <div>
              <h2 className="mb-2 text-lg font-semibold text-foreground">Nearby projects</h2>
              <div className="rounded-xl border border-border bg-surface px-5">
                {nearby.map((p) => (
                  <ProjectRow key={p.id} project={p} />
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Project details
            </h3>
            <dl className="space-y-3 text-sm">
              <DetailRow label="Status" value={PROJECT_STATUS_LABELS[project.status]} />
              <DetailRow label="Type" value={PROJECT_TYPE_LABELS[project.projectType]} />
              <DetailRow label="County" value={project.countyName} />
              <DetailRow label="City" value={project.cityName} />
              <DetailRow label="Developer" value={project.developerName ?? project.owner} />
              <DetailRow label="General contractor" value={project.generalContractorName} />
              <DetailRow label="Architect" value={project.architect} />
              <DetailRow label="Engineer" value={project.engineer} />
              <DetailRow label="Estimated value" value={formatCurrency(project.estimatedValueUsd)} />
              <DetailRow label="Estimated completion" value={formatDate(project.estimatedCompletion)} />
              <DetailRow label="Latest update" value={latestUpdate ? formatDate(latestUpdate.eventDate) : undefined} />
            </dl>
            {project.sourceName && (
              <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
                Source:{" "}
                {project.sourceUrl ? (
                  <a href={project.sourceUrl} target="_blank" rel="noreferrer" className="underline hover:text-accent">
                    {project.sourceName}
                  </a>
                ) : (
                  project.sourceName
                )}
              </p>
            )}
          </div>

          {trades.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <HardHat size={15} /> Trades likely needed
              </h3>
              <div className="flex flex-wrap gap-2">
                {trades.map((name) => (
                  <Badge key={name}>{name}</Badge>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
            <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Building2 size={15} /> Connect with the GC
            </h3>
            <p className="mb-4 text-xs text-muted-foreground">
              Bid phase: <span className="font-medium text-foreground">{project.bidPhase.replaceAll("_", " ")}</span>
            </p>
            <div className="space-y-2 text-sm">
              {project.gcContactPhone && (
                <a href={`tel:${project.gcContactPhone}`} className="flex items-center gap-2 text-foreground hover:text-accent">
                  <Phone size={14} /> {project.gcContactPhone}
                </a>
              )}
              {project.gcContactEmail && (
                <a href={`mailto:${project.gcContactEmail}`} className="flex items-center gap-2 text-foreground hover:text-accent">
                  <Mail size={14} /> {project.gcContactEmail}
                </a>
              )}
              {(project.gcContactWebsite || gc?.website) && (
                <a
                  href={project.gcContactWebsite ?? gc?.website ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-foreground hover:text-accent"
                >
                  <Globe size={14} /> Visit website
                </a>
              )}
              {!project.gcContactPhone && !project.gcContactEmail && !gc && (
                <p className="text-xs text-muted-foreground">No public GC contact on file yet.</p>
              )}
            </div>
            {gc && (
              <LinkButton href={`/general-contractors/${gc.slug}`} variant="outline" size="sm" className="mt-4 w-full">
                View GC profile
              </LinkButton>
            )}
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <CalendarDays size={15} /> Location
            </h3>
            <p className="mb-3 text-sm text-muted-foreground">
              {project.address}, {project.cityName}, FL
            </p>
            <LinkButton href={`/map?project=${project.slug}`} variant="outline" size="sm" className="w-full">
              View on map
            </LinkButton>
          </div>
        </aside>
      </Section>
    </>
  );
}

function Stat({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="font-mono text-lg font-semibold tabular-nums text-foreground">{value ?? "—"}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-none last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}
