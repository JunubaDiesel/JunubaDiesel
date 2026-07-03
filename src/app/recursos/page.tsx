import type { Metadata } from "next";
import { ResourcesFilter, ResourcesList } from "@/components/resources/ResourcesSection";
import { ui } from "@/config/site";
import { filterResources, parseResourceFilters } from "@/lib/resources";

export const metadata: Metadata = {
  title: ui.recursosTitle,
  description: ui.recursosDesc,
};

interface RecursosPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function RecursosPage({ searchParams }: RecursosPageProps) {
  const params = await searchParams;
  const filters = parseResourceFilters(params);
  const resources = filterResources(filters);

  return (
    <div className="gradient-mesh pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            JUNUBA
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{ui.recursosTitle}</h1>
          <p className="mt-4 max-w-2xl text-muted">{ui.recursosDesc}</p>
        </div>

        <ResourcesFilter />
        <ResourcesList resources={resources} />
      </div>
    </div>
  );
}
