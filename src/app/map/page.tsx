import type { Metadata } from "next";
import { Section } from "@/components/shared/section";
import { getAllProjectsForMap } from "@/lib/repositories";
import { ProjectMapLoader } from "@/components/map/project-map-loader";

export const metadata: Metadata = {
  title: "Project Map",
  description: "Interactive map of South Florida construction projects, color-coded by status.",
};

export default async function MapPage() {
  const projects = await getAllProjectsForMap();

  return (
    <Section className="pt-10">
      <div className="mb-6">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-accent">Live map</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          South Florida project map
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {projects.length} projects plotted across Miami-Dade, Broward, Palm Beach, and Monroe
          counties. Filter by status and click any pin for details.
        </p>
      </div>
      <ProjectMapLoader projects={projects} />
    </Section>
  );
}
