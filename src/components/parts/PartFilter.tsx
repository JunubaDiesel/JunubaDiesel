"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  categoryLabels,
  conditionLabels,
  ui,
  vehicleLabels,
  type CategoryId,
  type ConditionId,
  type VehicleId,
} from "@/config/site";
import { cn } from "@/lib/utils";

const vehicles = Object.entries(vehicleLabels) as [VehicleId, string][];
const conditions = Object.entries(conditionLabels) as [ConditionId, string][];
const categories = Object.entries(categoryLabels) as [CategoryId, string][];

export function PartFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentVehicle = searchParams.get("vehicle") as VehicleId | null;
  const currentCondition = searchParams.get("condition") as ConditionId | null;
  const currentCategory = searchParams.get("category") as CategoryId | null;

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const query = params.toString();
      router.push(query ? `/parts?${query}` : "/parts", { scroll: false });
    },
    [router, searchParams]
  );

  const clearAll = () => router.push("/parts", { scroll: false });

  const hasFilters = currentVehicle || currentCondition || currentCategory;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">{ui.filter}</h2>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-accent hover:underline"
          >
            {ui.clearFilters}
          </button>
        )}
      </div>

      <FilterGroup
        label="Vehículo"
        options={vehicles}
        current={currentVehicle}
        onSelect={(v) => updateFilter("vehicle", currentVehicle === v ? null : v)}
      />
      <FilterGroup
        label="Estado"
        options={conditions}
        current={currentCondition}
        onSelect={(v) => updateFilter("condition", currentCondition === v ? null : v)}
      />
      <FilterGroup
        label="Categoría"
        options={categories}
        current={currentCategory}
        onSelect={(v) => updateFilter("category", currentCategory === v ? null : v)}
      />
    </div>
  );
}

function FilterGroup<T extends string>({
  label,
  options,
  current,
  onSelect,
}: {
  label: string;
  options: [T, string][];
  current: T | null;
  onSelect: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-muted">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(([value, name]) => (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              current === value
                ? "border-accent bg-accent/20 text-accent"
                : "border-border bg-surface-light text-muted hover:border-accent/50 hover:text-foreground"
            )}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
