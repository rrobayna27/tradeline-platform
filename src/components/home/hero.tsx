import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import type { MarketStat } from "@/lib/types";

export function Hero({ stats }: { stats: MarketStat[] }) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-navy-900">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(14,124,134,0.45), transparent 45%), radial-gradient(circle at 85% 0%, rgba(232,161,61,0.25), transparent 40%)",
        }}
        aria-hidden
      />
      <div className="container-page relative py-20 md:py-28">
        <div className="animate-fade-in max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-teal-400">
            Southeast Florida &middot; Live
          </p>
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
            Where South Florida&apos;s next build finds its subcontractor.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">
            Original construction &amp; CRE news, a live project database, and verified general
            contractor + subcontractor directories — built for the trades that make South Florida
            grow.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/projects" size="lg">
              Browse the project database
              <ArrowRight size={17} />
            </LinkButton>
            <LinkButton href="/join" size="lg" variant="outline" className="border-white/25 text-white hover:border-teal-400 hover:text-teal-400">
              Join as a subcontractor
            </LinkButton>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-3 md:grid-cols-6">
          {stats.map((stat) => (
            <div key={stat.id}>
              <p className="font-mono text-2xl font-semibold tabular-nums text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-white/55">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
