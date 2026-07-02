import Link from "next/link";
import { MapPin } from "lucide-react";
import { CardHover } from "@/components/ui/card";
import { StatusBadge, SampleDataBadge } from "@/components/ui/badge";
import { PROJECT_TYPE_LABELS } from "@/lib/constants";
import { formatCurrencyCompact } from "@/lib/utils";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <CardHover className="flex h-full flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <StatusBadge status={project.status} />
          {project.isSample && <SampleDataBadge />}
        </div>
        <h3 className="mb-1 font-semibold leading-snug text-foreground transition-colors group-hover:text-accent">
          {project.name}
        </h3>
        <p className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin size={12} />
          {project.cityName}
          {project.cityName && project.countyName ? ", " : ""}
          {project.countyName?.replace(" County", "")}
        </p>
        <p className="mb-4 line-clamp-2 flex-1 text-sm text-muted-foreground">{project.description}</p>
        <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
          <span className="font-mono tabular-nums text-foreground">
            {formatCurrencyCompact(project.estimatedValueUsd)}
          </span>
          <span className="text-muted-foreground">{PROJECT_TYPE_LABELS[project.projectType]}</span>
        </div>
      </CardHover>
    </Link>
  );
}

export function ProjectRow({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex items-center justify-between gap-4 border-b border-border py-3 last:border-none"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground group-hover:text-accent">{project.name}</p>
        <p className="truncate text-xs text-muted-foreground">{project.cityName}</p>
      </div>
      <StatusBadge status={project.status} className="shrink-0" />
    </Link>
  );
}
