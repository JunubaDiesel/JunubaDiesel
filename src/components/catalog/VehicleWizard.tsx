"use client";

import { ui, vehicleLabels, type VehicleId } from "@/config/site";
import { cn } from "@/lib/utils";

interface VehicleWizardProps {
  vehicleId: VehicleId;
  variantId: string;
  onVehicleChange: (id: VehicleId) => void;
  onVariantChange: (id: string) => void;
  variants: { id: string; label: string; vehicleId: VehicleId }[];
}

const vehicleIds: VehicleId[] = ["starex", "staria", "porter", "bongo"];

export function VehicleWizard({
  vehicleId,
  variantId,
  onVehicleChange,
  onVariantChange,
  variants,
}: VehicleWizardProps) {
  const filtered = variants.filter((v) => v.vehicleId === vehicleId);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
          {ui.selectVehicle}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {vehicleIds.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onVehicleChange(id)}
              className={cn(
                "rounded-xl border px-3 py-3 text-left text-sm font-medium transition-colors",
                vehicleId === id
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border bg-surface-light text-muted hover:border-accent/40"
              )}
            >
              {vehicleLabels[id]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
          {ui.selectVariant}
        </h3>
        <div className="space-y-2">
          {filtered.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => onVariantChange(v.id)}
              className={cn(
                "w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                variantId === v.id
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border bg-surface-light text-muted hover:border-accent/40"
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
