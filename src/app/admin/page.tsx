import Link from "next/link";
import {
  getPublishedArticles,
  getGeneralContractors,
  searchProjects,
  searchSubcontractors,
  getDevelopers,
} from "@/lib/repositories";

export default async function AdminDashboardPage() {
  const [articles, gcs, subsResult, projectsResult, developers] = await Promise.all([
    getPublishedArticles(),
    getGeneralContractors(),
    searchSubcontractors({ pageSize: 1000 }),
    searchProjects({ pageSize: 1000 }),
    getDevelopers(),
  ]);

  const stats = [
    { label: "Published articles", value: articles.length, href: "/admin/articles" },
    { label: "Tracked projects", value: projectsResult.total, href: "/admin/projects" },
    { label: "General contractors", value: gcs.length, href: "/admin/general-contractors" },
    { label: "Subcontractors", value: subsResult.total, href: "/admin/subcontractors" },
    { label: "Developers", value: developers.length, href: "/admin/developers" },
  ];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="mb-8 text-sm text-muted-foreground">A quick look at everything on the platform right now.</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent/40"
          >
            <p className="font-mono text-2xl font-semibold tabular-nums text-foreground">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm">
        <h2 className="mb-1 font-semibold text-foreground">About this data</h2>
        <p className="text-muted-foreground">
          Every record shown across the admin panel today is sample/illustrative data used to build
          and demo the platform (see the project&apos;s DECISIONS.md guardrails). Create/edit/delete
          actions in this admin panel require a connected Postgres database — the schema and seed
          script are ready in <code className="rounded bg-surface-raised px-1">prisma/</code>, and the
          write forms can be wired up as soon as <code className="rounded bg-surface-raised px-1">DATABASE_URL</code> points
          at a live instance.
        </p>
      </div>
    </div>
  );
}
