import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Section } from "@/components/shared/section";
import { JoinForm } from "./join-form";

export const metadata: Metadata = {
  title: "Join Tradeline",
  description: "Join Tradeline as a subcontractor or general contractor in South Florida.",
};

const subFeatures = [
  "Searchable project database with bid-phase and trade filters",
  "Direct GC contact info on every project where publicly available",
  "A professional, license-verified company profile",
  "Weekly digest of new projects and permits in your trades",
];

const gcFeatures = [
  "Searchable, license-verified subcontractor directory",
  "Post projects and invite subs to bid",
  "A verified company profile across the platform",
  "Priority placement in the featured GC directory",
];

export default function JoinPage() {
  return (
    <Section className="pt-10">
      <div className="mb-10 text-center">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-accent">Join Tradeline</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Built for South Florida&apos;s trades
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Whether you pour concrete or run the job site, Tradeline connects you to the next project.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">Subcontractors</p>
          <div className="mb-4 flex items-baseline gap-2">
            <h2 className="text-2xl font-semibold text-foreground">Sub Pro</h2>
            <span className="font-mono text-lg text-muted-foreground">$9/mo</span>
          </div>
          <ul className="mb-6 space-y-2.5 text-sm text-muted-foreground">
            {subFeatures.map((f) => (
              <li key={f} className="flex gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-accent" /> {f}
              </li>
            ))}
          </ul>
          <JoinForm role="SUB" />
        </div>

        <div className="rounded-2xl border border-border bg-surface p-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">General Contractors</p>
          <div className="mb-4 flex items-baseline gap-2">
            <h2 className="text-2xl font-semibold text-foreground">GC Pro</h2>
            <span className="font-mono text-lg text-muted-foreground">$49/mo</span>
          </div>
          <ul className="mb-6 space-y-2.5 text-sm text-muted-foreground">
            {gcFeatures.map((f) => (
              <li key={f} className="flex gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-accent" /> {f}
              </li>
            ))}
          </ul>
          <JoinForm role="GC" />
        </div>
      </div>
    </Section>
  );
}
