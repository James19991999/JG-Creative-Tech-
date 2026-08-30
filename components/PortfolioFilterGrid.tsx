"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PortfolioProject } from "@/lib/portfolio";

type Filter = "All Projects" | "Web Ecosystems" | "SaaS" | "Branding";

const filters: Filter[] = ["All Projects", "Web Ecosystems", "SaaS", "Branding"];

/**
 * Maps each project's category to the filter chip(s) it belongs under.
 * Kept local to this component since it's a presentational grouping,
 * not part of the project's canonical data.
 */
function matchesFilter(project: PortfolioProject, filter: Filter): boolean {
  if (filter === "All Projects") return true;
  if (filter === "SaaS") return project.category.includes("SaaS");
  if (filter === "Branding") return project.category.includes("Brand");
  if (filter === "Web Ecosystems") {
    return (
      project.category.includes("Web") ||
      project.category.includes("Portal") ||
      project.category.includes("Infrastructure")
    );
  }
  return false;
}

type PortfolioFilterGridProps = {
  projects: PortfolioProject[];
};

export function PortfolioFilterGrid({ projects }: PortfolioFilterGridProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>("All Projects");

  const visibleProjects = useMemo(
    () => projects.filter((project) => matchesFilter(project, activeFilter)),
    [projects, activeFilter]
  );

  return (
    <>
      {/* Filter Tabs */}
      <section className="mb-16">
        <div
          className="flex flex-wrap gap-3"
          role="tablist"
          aria-label="Project category filters"
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(filter)}
                className={
                  isActive
                    ? "px-6 py-2.5 rounded-full bg-primary text-on-primary font-label text-sm font-semibold transition-all"
                    : "px-6 py-2.5 rounded-full bg-surface-container-low text-on-surface-variant font-label text-sm font-medium hover:bg-surface-container transition-all"
                }
              >
                {filter}
              </button>
            );
          })}
        </div>
      </section>

      {/* Project Grid */}
      <section
        aria-live="polite"
        className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-32"
      >
        {visibleProjects.length === 0 ? (
          <p className="col-span-12 text-on-surface-variant text-center py-16">
            No projects in this category yet — check back soon, or{" "}
            <Link href="/contact" className="text-secondary font-bold hover:underline">
              tell us what you&apos;re building
            </Link>
            .
          </p>
        ) : (
          visibleProjects.map((project, index) => (
            <Link
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className={
                index === 0
                  ? "md:col-span-8 group"
                  : index === 1
                  ? "md:col-span-4 group pt-0 md:pt-24"
                  : "md:col-span-6 group"
              }
            >
              <div
                className={
                  index === 0
                    ? "relative overflow-hidden rounded-xl bg-surface-container aspect-[16/10] mb-6"
                    : index === 1
                    ? "relative overflow-hidden rounded-xl bg-surface-container aspect-square mb-6"
                    : "relative overflow-hidden rounded-xl bg-surface-container aspect-video mb-6"
                }
              >
                <Image
                  src={project.heroImage}
                  alt={project.heroImageAlt}
                  fill
                  sizes="(max-width: 768px) 90vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-1 h-12 bg-on-tertiary-container" />
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-headline text-2xl md:text-3xl text-primary">
                      {project.name}
                    </h2>
                    <span
                      className="material-symbols-outlined text-secondary text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      aria-hidden="true"
                    >
                      north_east
                    </span>
                  </div>
                  <div className="flex gap-4 items-center flex-wrap">
                    <span className="font-label text-xs uppercase tracking-widest text-secondary font-bold">
                      {project.category}
                    </span>
                    <span
                      className="w-1 h-1 bg-outline-variant rounded-full"
                      aria-hidden="true"
                    />
                    <span className="font-label text-xs text-on-surface-variant">
                      {project.tagline}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </section>
    </>
  );
}
