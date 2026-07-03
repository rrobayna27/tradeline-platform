import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Globe, Mail, Phone, ShieldCheck, Award } from "lucide-react";
import { Section } from "@/components/shared/section";
import { Badge, SampleDataBadge } from "@/components/ui/badge";
import { CompanyAvatar } from "@/components/company/company-avatar";
import { getSubcontractorBySlug } from "@/lib/repositories";
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
  const sub = await getSubcontractorBySlug(slug);
  if (!sub) return {};
  return {
    title: sub.name,
    description: sub.description ?? `${sub.name} — subcontractor profile on Tradeline.`,
  };
}

export default async function SubDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sub = await getSubcontractorBySlug(slug);
  if (!sub) notFound();

  const { isPro } = await getViewer();
  const trades = sub.tradeNames ?? [];
  const counties = sub.countyNames ?? [];

  return (
    <>
      <div className="border-b border-border bg-surface">
        <Section className="py-10 md:py-14">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <CompanyAvatar name={sub.name} className="h-16 w-16 text-xl" />
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                {sub.isClaimed && <Badge className="border-accent/30 bg-accent/10 text-accent">Verified profile</Badge>}
                {sub.insuranceVerified && (
                  <Badge className="border-accent/30 bg-accent/10 text-accent">
                    <ShieldCheck size={12} className="mr-1" />
                    Insurance verified
                  </Badge>
                )}
                {sub.isWBE && <Badge>WBE</Badge>}
                {sub.isMinorityOwned && <Badge>Minority-owned</Badge>}
                {sub.unionStatus && <Badge>{sub.unionStatus.replaceAll("_", "-")}</Badge>}
                {sub.isSample && <SampleDataBadge />}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">{sub.name}</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{sub.description}</p>
            </div>
          </div>
        </Section>
      </div>

      <Section className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Trades</h2>
            <div className="flex flex-wrap gap-2">
              {trades.map((name) => (
                <Badge key={name} className="border-accent/30 bg-accent/10 text-accent">
                  {name}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Service areas</h2>
            <div className="flex flex-wrap gap-2">
              {counties.map((name) => (
                <Badge key={name}>{name}</Badge>
              ))}
            </div>
          </div>

          {sub.certifications.length > 0 && (
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                <Award size={17} /> Certifications
              </h2>
              <ul className="space-y-2">
                {sub.certifications.map((c) => (
                  <li key={c.id} className="text-sm text-muted-foreground">
                    {c.name}
                    {c.issuedBy ? ` — ${c.issuedBy}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Gallery</h2>
            <p className="text-sm text-muted-foreground">
              No project photos uploaded yet. Subcontractors can add their portfolio once they claim
              this profile.
            </p>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Contact</h3>
            <div className="space-y-2 text-sm">
              {!isPro && (sub.phone || sub.email) && <ProUpsell what="Direct phone + email" />}
              {isPro && sub.phone && (
                <a href={`tel:${sub.phone}`} className="flex items-center gap-2 text-foreground hover:text-accent">
                  <Phone size={14} /> {sub.phone}
                </a>
              )}
              {isPro && sub.email && (
                <a href={`mailto:${sub.email}`} className="flex items-center gap-2 text-foreground hover:text-accent">
                  <Mail size={14} /> {sub.email}
                </a>
              )}
              {sub.website && (
                <a href={sub.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-foreground hover:text-accent">
                  <Globe size={14} /> Website
                </a>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Company details</h3>
            <dl className="space-y-3 text-sm">
              {sub.licenseNumber && (
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">License #</dt>
                  <dd className="font-mono font-medium text-foreground">{sub.licenseNumber}</dd>
                </div>
              )}
              {sub.yearsInBusiness != null && (
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">Years in business</dt>
                  <dd className="font-medium text-foreground">{sub.yearsInBusiness}</dd>
                </div>
              )}
              {sub.companySize && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Company size</dt>
                  <dd className="font-medium text-foreground">{sub.companySize}</dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </Section>
    </>
  );
}
