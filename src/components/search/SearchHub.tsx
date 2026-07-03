"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { InventoryMatch } from "@/components/catalog/InventoryMatch";
import { PartNumberSearch } from "@/components/catalog/PartNumberSearch";
import { PartCard } from "@/components/parts/PartCard";
import { PageRoleBanner } from "@/components/ui/PageRoleBanner";
import { ui, vehicleLabels, type VehicleId } from "@/config/site";
import { looksLikeOemCode } from "@/lib/oem-detect";
import type { Part } from "@/types/part";

type SearchTab = "stock" | "diagrama";

interface SearchHubProps {
  initialParts: Part[];
  initialTotal: number;
  initialQuery: string;
  initialOem: string;
  initialTab: SearchTab;
  initialVehicle?: VehicleId;
}

function SearchHubContent({
  initialParts,
  initialTotal,
  initialQuery,
  initialOem,
  initialTab,
  initialVehicle = "starex",
}: SearchHubProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as SearchTab) || initialTab;
  const [query, setQuery] = useState(initialQuery || initialOem);
  const [vehicle, setVehicle] = useState<VehicleId>(initialVehicle);

  const setTab = (nextTab: SearchTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", nextTab);
    router.push(`/buscar?${params.toString()}`);
  };

  const handleStockSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    const params = new URLSearchParams();
    params.set("tab", "stock");
    if (looksLikeOemCode(trimmed)) params.set("oem", trimmed);
    else if (trimmed) params.set("q", trimmed);
    router.push(`/buscar?${params.toString()}`);
  };

  const oemValue = initialOem || (looksLikeOemCode(initialQuery) ? initialQuery : "");

  return (
    <div>
      <div className="mb-8 flex gap-2 rounded-xl border border-border bg-surface-light p-1">
        <button
          type="button"
          onClick={() => setTab("stock")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            tab === "stock" ? "accent-gradient text-white" : "text-muted hover:text-foreground"
          }`}
        >
          {ui.stockJUNUBA}
        </button>
        <button
          type="button"
          onClick={() => setTab("diagrama")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
            tab === "diagrama" ? "accent-gradient text-white" : "text-muted hover:text-foreground"
          }`}
        >
          {ui.diagramaOem}
        </button>
      </div>

      {tab === "stock" ? (
        <div>
          <PageRoleBanner>{ui.partsBanner}</PageRoleBanner>
          <form onSubmit={handleStockSearch} className="mb-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={ui.searchPartsPlaceholder}
                className="w-full rounded-xl border border-border bg-surface-light px-4 py-3 text-sm outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="rounded-xl accent-gradient px-6 py-3 text-sm font-semibold text-white"
              >
                {ui.searchParts}
              </button>
            </div>
          </form>

          {oemValue && <InventoryMatch oemNumber={oemValue} />}

          <p className="mb-6 mt-4 text-sm text-muted">
            <span className="font-semibold text-foreground">{initialTotal}</span> {ui.totalParts}
          </p>

          {initialParts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface-light p-12 text-center">
              <p className="text-lg font-medium text-muted">{ui.noPartsFound}</p>
              <p className="mt-4 text-sm text-muted">
                {ui.noOemCode}{" "}
                <button
                  type="button"
                  onClick={() => setTab("diagrama")}
                  className="font-semibold text-accent hover:underline"
                >
                  {ui.verDiagramaOem}
                </button>
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {initialParts.map((part) => (
                <PartCard key={part.id} part={part} />
              ))}
            </div>
          )}

          {initialTotal > initialParts.length && (
            <div className="mt-8 text-center">
              <Link
                href={`/parts?${(() => {
                  const params = new URLSearchParams();
                  if (initialQuery) params.set("q", initialQuery);
                  if (initialOem) params.set("q", initialOem);
                  if (initialVehicle) params.set("vehicle", initialVehicle);
                  return params.toString();
                })()}`}
                className="inline-flex rounded-xl border border-accent/40 px-6 py-3 text-sm font-semibold text-accent hover:bg-accent/10"
              >
                Ver todos en stock →
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div>
          <PageRoleBanner>{ui.catalogBanner}</PageRoleBanner>
          <div className="mb-6">
            <label htmlFor="buscar-vehicle" className="mb-2 block text-sm font-medium">
              {ui.selectVehicle}
            </label>
            <select
              id="buscar-vehicle"
              value={vehicle}
              onChange={(event) => setVehicle(event.target.value as VehicleId)}
              className="w-full max-w-xs rounded-xl border border-border bg-surface-light px-4 py-3 text-sm"
            >
              {(Object.keys(vehicleLabels) as VehicleId[]).map((id) => (
                <option key={id} value={id}>
                  {vehicleLabels[id]}
                </option>
              ))}
            </select>
          </div>
          <PartNumberSearch vehicleId={vehicle} />
          <div className="mt-6 text-center">
            <Link
              href={`/catalog?vehicle=${vehicle}${oemValue ? `&oem=${encodeURIComponent(oemValue)}` : ""}`}
              className="inline-flex rounded-xl border border-accent/40 px-6 py-3 text-sm font-semibold text-accent hover:bg-accent/10"
            >
              Abrir {ui.diagramaOem} completo →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function SearchHub(props: SearchHubProps) {
  return (
    <Suspense fallback={<div className="text-muted">Cargando búsqueda...</div>}>
      <SearchHubContent {...props} />
    </Suspense>
  );
}
