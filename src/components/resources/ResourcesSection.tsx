"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { FadeIn, Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ui, vehicleLabels, type VehicleId } from "@/config/site";
import { resourceTypeLabels } from "@/lib/resource-labels";
import type { Resource, ResourceType } from "@/types/resource";

interface ResourcesFilterProps {
  basePath?: string;
}

function ResourcesFilterContent({ basePath = "/recursos" }: ResourcesFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type") ?? "";
  const currentVehicle = searchParams.get("vehicle") ?? "";
  const currentQuery = searchParams.get("q") ?? "";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end">
      <div className="flex-1">
        <label className="mb-2 block text-sm font-medium">Buscar</label>
        <input
          type="search"
          defaultValue={currentQuery}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              updateParam("q", (event.target as HTMLInputElement).value.trim());
            }
          }}
          placeholder="Mantenimiento, aceite, OEM..."
          className="w-full rounded-xl border border-border bg-surface-light px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Tipo</label>
        <select
          value={currentType}
          onChange={(event) => updateParam("type", event.target.value)}
          className="rounded-xl border border-border bg-surface-light px-4 py-3 text-sm"
        >
          <option value="">Todos</option>
          {(Object.keys(resourceTypeLabels) as ResourceType[]).map((type) => (
            <option key={type} value={type}>
              {resourceTypeLabels[type]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Vehículo</label>
        <select
          value={currentVehicle}
          onChange={(event) => updateParam("vehicle", event.target.value)}
          className="rounded-xl border border-border bg-surface-light px-4 py-3 text-sm"
        >
          <option value="">Todos</option>
          <option value="all">General</option>
          {(Object.keys(vehicleLabels) as VehicleId[]).map((id) => (
            <option key={id} value={id}>
              {vehicleLabels[id]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function ResourcesFilter(props: ResourcesFilterProps) {
  return (
    <Suspense fallback={null}>
      <ResourcesFilterContent {...props} />
    </Suspense>
  );
}

interface ResourcesListProps {
  resources: Resource[];
}

export function ResourcesList({ resources }: ResourcesListProps) {
  if (resources.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface-light p-12 text-center text-muted">
        No hay recursos que coincidan con los filtros.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource, index) => (
        <FadeIn key={resource.id} delay={index * 0.05}>
          <ResourceCard resource={resource} />
        </FadeIn>
      ))}
    </div>
  );
}

interface ResourcesShowcaseProps {
  resources: Resource[];
}

export function ResourcesShowcase({ resources }: ResourcesShowcaseProps) {
  if (resources.length === 0) return null;

  return (
    <Section
      id="recursos"
      subtitle="Mantenimiento y guías"
      title={ui.recursosTitle}
    >
      <p className="mb-10 max-w-2xl text-muted">{ui.recursosDesc}</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource, index) => (
          <FadeIn key={resource.id} delay={index * 0.08}>
            <ResourceCard resource={resource} />
          </FadeIn>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button href="/recursos" variant="outline">
          Ver todos los recursos
        </Button>
      </div>
    </Section>
  );
}
