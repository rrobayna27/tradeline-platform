"use client";

import dynamic from "next/dynamic";
import type { Project } from "@/lib/types";

const ProjectMap = dynamic(() => import("./project-map").then((m) => m.ProjectMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] min-h-[520px] w-full items-center justify-center rounded-xl border border-border bg-surface text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
});

export function ProjectMapLoader({ projects }: { projects: Project[] }) {
  return <ProjectMap projects={projects} />;
}
