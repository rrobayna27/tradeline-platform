import type { Metadata } from "next";
import { ProjectFilters } from "@/components/project/project-filters";
import { ProjectCard } from "@/components/project/project-card";
import { Section } from "@/components/shared/section";
import {
  getCities,
  getCounties,
  getDevelopers,
  getGeneralContractors,
  getTrades,
  searchProjects,
} from "@/lib/repositories";
import type { ProjectSearchFilters, ProjectStatus, ProjectType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Project Database",
  description:
    "Search South Florida construction projects by county, city, developer, general contractor, value, type, status, and completion year.",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (key: string) => (typeof sp[key] === "string" ? (sp[key] as string) : undefined);

  const filters: ProjectSearchFilters = {
    county: get("county"),
    city: get("city"),
    developer: get("developer"),
    generalContractor: get("generalContractor"),
    architect: get("architect"),
    projectType: get("projectType") as ProjectType | undefined,
    status: get("status") as ProjectStatus | undefined,
    trade: get("trade"),
    keyword: get("keyword"),
    completionYear: get("completionYear") ? Number(get("completionYear")) : undefined,
    page: get("page") ? Number(get("page")) : 1,
    pageSize: 12,
  };

  const [{ items, total, totalPages, page }, counties, cities, developers, generalContractors, trades] =
    await Promise.all([
      searchProjects(filters),
      getCounties(),
      getCities(),
      getDevelopers(),
      getGeneralContractors(),
      getTrades(),
    ]);

  return (
    <Section className="pt-10">
      <div className="mb-8">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-accent">Project database</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          South Florida construction projects
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {total} tracked project{total === 1 ? "" : "s"} across Miami-Dade, Broward, Palm Beach, and
          Monroe counties. Every project has a permanent page with timeline, trades needed, and GC
          contact information when publicly available.
        </p>
      </div>

      <div className="mb-8 rounded-xl border border-border bg-surface p-5">
        <ProjectFilters
          counties={counties}
          cities={cities}
          developers={developers}
          generalContractors={generalContractors}
          trades={trades}
        />
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No projects match those filters yet. Try clearing one or two.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2 font-mono text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`?${new URLSearchParams({ ...sp, page: String(p) } as Record<string, string>).toString()}`}
              className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                p === page ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </Section>
  );
}
