import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Globe, Mail, Phone, MapPin } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Badge, SampleDataBadge } from "@/components/ui/badge";
import { CompanyAvatar } from "@/components/company/company-avatar";
import { ProjectCard } from "@/components/project/project-card";
import {
  getGeneralContractorBySlug,
  getProjectsByGeneralContractor,
} from "@/lib/repositories";
import { METRO_LABELS } from "@/lib/constants";
import { getViewer } from "@/lib/viewer";
import { ProUpsell } from "@/components/shared/pro-gate";

// Rendered per-request (no generateStaticParams) because contact info is
// Pro-gated — the page differs per viewer. See getViewer() below.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const gc = await getGeneralContractorBySlug(slug);
  if (!gc) return {};
  return {
    title: gc.name,
    description: gc.description ?? `${gc.name} — general contractor profile on Tradeline.`,
  };
}

export default async function GCDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gc = await getGeneralContractorBySlug(slug);
  if (!gc) notFound();

  const [projects, { isPro }] = await Promise.all([getProjectsByGeneralContractor(gc.id), getViewer()]);
  const current = projects.filter((p) => !["COMPLETED", "CANCELLED"].includes(p.status));
  const completed = projects.filter((p) => p.status === "COMPLETED");

  return (
    <>
      <div className="border-b border-border bg-surface">
        <Section className="py-10 md:py-14">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <CompanyAvatar name={gc.name} className="h-16 w-16 text-xl" />
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                {gc.isClaimed && <Badge className="border-accent/30 bg-accent/10 text-accent">Verified profile</Badge>}
                {gc.planTier === "PRO" && <Badge className="border-highlight/40 bg-highlight/10 text-highlight">Pro</Badge>}
                {gc.isSample && <SampleDataBadge />}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{gc.name}</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{gc.description}</p>
            </div>
          </div>
        </Section>
      </div>

      <Section className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-12">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-foreground">Current projects ({current.length})</h2>
            {current.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active projects on file.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {current.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            )}
          </div>

          {completed.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">Completed projects ({completed.length})</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {completed.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Contact</h3>
            <div className="space-y-2 text-sm">
              {!isPro && (gc.phone || gc.email) && <ProUpsell what="Direct phone + email" />}
              {isPro && gc.phone && (
                <a href={`tel:${gc.phone}`} className="flex items-center gap-2 text-foreground hover:text-accent">
                  <Phone size={14} /> {gc.phone}
                </a>
              )}
              {isPro && gc.email && (
                <a href={`mailto:${gc.email}`} className="flex items-center gap-2 text-foreground hover:text-accent">
                  <Mail size={14} /> {gc.email}
                </a>
              )}
              {gc.website && (
                <a href={gc.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-foreground hover:text-accent">
                  <Globe size={14} /> Website
                </a>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Company details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-border pb-3">
                <dt className="text-muted-foreground">Markets served</dt>
                <dd className="text-right font-medium text-foreground">
                  {gc.marketsServed.map((m) => METRO_LABELS[m]).join(", ")}
                </dd>
              </div>
              {gc.companySize && (
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">Company size</dt>
                  <dd className="font-medium text-foreground">{gc.companySize}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Active + completed</dt>
                <dd className="font-medium text-foreground">{projects.length} projects</dd>
              </div>
            </dl>
          </div>

          {gc.offices.length > 0 && (
            <div className="rounded-xl border border-border bg-surface p-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <MapPin size={14} /> Offices
              </h3>
              <ul className="space-y-3 text-sm">
                {gc.offices.map((o) => (
                  <li key={o.id}>
                    <p className="font-medium text-foreground">{o.label}</p>
                    <p className="text-muted-foreground">
                      {o.address ? `${o.address}, ` : ""}
                      {o.cityName}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </Section>
    </>
  );
}
