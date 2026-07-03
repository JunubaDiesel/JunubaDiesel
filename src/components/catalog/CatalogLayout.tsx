"use client";

import { Suspense, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CategorySidebar } from "@/components/catalog/CategorySidebar";
import { VehicleWizard } from "@/components/catalog/VehicleWizard";
import { PartsouqEmbed } from "@/components/catalog/PartsouqEmbed";
import { PartNumberSearch } from "@/components/catalog/PartNumberSearch";
import { ui } from "@/config/site";
import type { CategoryId, VehicleId } from "@/config/site";
import {
  getAllVariants,
  getCategoryById,
  getVariantById,
  getVariantsByVehicle,
} from "@/lib/partsouq";

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const vehicleId = (searchParams.get("vehicle") as VehicleId) || "starex";
  const variantId = searchParams.get("variant") || getVariantsByVehicle(vehicleId)[0]?.id || "";
  const categoryId = (searchParams.get("category") as CategoryId) || "engine";

  const variant = getVariantById(variantId) ?? getVariantsByVehicle(vehicleId)[0];
  const category = getCategoryById(categoryId) ?? getCategoryById("engine")!;
  const allVariants = useMemo(() => getAllVariants(), []);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => params.set(k, v));
      router.push(`/catalog?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleVehicleChange = (id: VehicleId) => {
    const first = getVariantsByVehicle(id)[0];
    updateParams({ vehicle: id, variant: first?.id ?? "", category: categoryId });
  };

  const handleVariantChange = (id: string) => {
    updateParams({ variant: id });
  };

  const handleCategoryChange = (id: CategoryId) => {
    updateParams({ category: id });
  };

  if (!variant || !category) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_200px]">
      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <VehicleWizard
          vehicleId={vehicleId}
          variantId={variant.id}
          onVehicleChange={handleVehicleChange}
          onVariantChange={handleVariantChange}
          variants={allVariants}
        />
        <div className="hidden xl:block">
          <CategorySidebar selected={categoryId} onSelect={handleCategoryChange} />
        </div>
      </aside>

      <div className="space-y-4 min-w-0">
        <PartNumberSearch
          vehicleId={vehicleId}
          variantId={variant.id}
          categoryId={categoryId}
        />
        <div className="xl:hidden">
          <CategorySidebar selected={categoryId} onSelect={handleCategoryChange} />
        </div>
        <PartsouqEmbed variant={variant} category={category} />
        <p className="text-xs text-muted">
          Catálogo OEM proporcionado por{" "}
          <a
            href="https://partsouq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Partsouq.com
          </a>
          . Copie el número de pieza y añádalo a su lista de revisión.
        </p>
      </div>

      <aside className="hidden xl:block xl:sticky xl:top-24 xl:self-start">
        <div className="rounded-xl border border-border bg-surface-light p-4 text-sm">
          <p className="mb-3 font-semibold text-foreground">{ui.stockJUNUBA}</p>
          <p className="mb-4 text-muted text-xs">
            ¿Busca repuestos en stock de JUNUBA?
          </p>
          <Link
            href={`/parts?vehicle=${vehicleId}`}
            className="inline-flex w-full items-center justify-center rounded-lg accent-gradient px-4 py-2 text-sm font-semibold text-white"
          >
            {ui.viewParts}
          </Link>
        </div>
      </aside>
    </div>
  );
}

export function CatalogLayout() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted">Cargando catálogo...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
