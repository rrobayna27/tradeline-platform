"use client";

import { useMemo, useState } from "react";
import { Map, Marker, Popup, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import { PROJECT_STATUS_COLOR_VAR, PROJECT_STATUS_LABELS, PROJECT_TYPE_LABELS } from "@/lib/constants";
import { formatCurrencyCompact } from "@/lib/utils";
import type { Project } from "@/lib/types";

// Free, no-API-key vector tile style (OpenFreeMap — https://openfreemap.org).
const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

export function ProjectMap({ projects }: { projects: Project[] }) {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const statuses = useMemo(() => Array.from(new Set(projects.map((p) => p.status))), [projects]);

  const filtered = useMemo(
    () => (statusFilter === "ALL" ? projects : projects.filter((p) => p.status === statusFilter)),
    [projects, statusFilter]
  );

  return (
    <div className="relative h-[70vh] min-h-[520px] w-full overflow-hidden rounded-xl border border-border">
      <div className="absolute left-4 top-4 z-10 flex max-w-[calc(100%-2rem)] flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur ${
            statusFilter === "ALL" ? "border-accent bg-accent text-accent-foreground" : "border-border bg-surface/90 text-foreground"
          }`}
        >
          All ({projects.length})
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur ${
              statusFilter === s ? "border-accent bg-accent text-accent-foreground" : "border-border bg-surface/90 text-foreground"
            }`}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: `var(${PROJECT_STATUS_COLOR_VAR[s]})` }}
            />
            {PROJECT_STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <Map
        initialViewState={{ longitude: -80.19, latitude: 26.1, zoom: 8.4 }}
        mapStyle={MAP_STYLE}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="bottom-right" />
        {filtered.map(
          (p) =>
            p.latitude &&
            p.longitude && (
              <Marker
                key={p.id}
                longitude={p.longitude}
                latitude={p.latitude}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setActiveProject(p);
                }}
              >
                <button
                  aria-label={p.name}
                  className="h-4 w-4 cursor-pointer rounded-full border-2 border-white shadow-md transition-transform hover:scale-125"
                  style={{ backgroundColor: `var(${PROJECT_STATUS_COLOR_VAR[p.status]})` }}
                />
              </Marker>
            )
        )}

        {activeProject && activeProject.latitude && activeProject.longitude && (
          <Popup
            longitude={activeProject.longitude}
            latitude={activeProject.latitude}
            onClose={() => setActiveProject(null)}
            closeOnClick={false}
            anchor="bottom"
            offset={12}
          >
            <div className="min-w-[200px] p-1 text-navy-900">
              <p className="text-sm font-semibold">{activeProject.name}</p>
              <p className="text-xs text-muted-foreground">
                {PROJECT_STATUS_LABELS[activeProject.status]} &middot; {PROJECT_TYPE_LABELS[activeProject.projectType]}
              </p>
              <p className="mt-1 font-mono text-xs">{formatCurrencyCompact(activeProject.estimatedValueUsd)}</p>
              <Link href={`/projects/${activeProject.slug}`} className="mt-2 inline-block text-xs font-medium text-teal-600 underline">
                View project →
              </Link>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
