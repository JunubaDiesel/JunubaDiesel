"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { InventoryMatch } from "@/components/catalog/InventoryMatch";
import { PartCard } from "@/components/parts/PartCard";
import { PageRoleBanner } from "@/components/ui/PageRoleBanner";
import { ui } from "@/config/site";
import { buildContactUrl } from "@/lib/contact-url";
import { looksLikeOemCode } from "@/lib/oem-detect";
import type { Part } from "@/types/part";

interface SearchHubProps {
  initialParts: Part[];
  initialTotal: number;
  initialQuery: string;
  initialOem: string;
}

function SearchHubContent({
  initialParts,
  initialTotal,
  initialQuery,
  initialOem,
}: SearchHubProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery || initialOem);

  const handleStockSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    const params = new URLSearchParams();
    if (looksLikeOemCode(trimmed)) params.set("oem", trimmed);
    else if (trimmed) params.set("q", trimmed);
    router.push(`/buscar?${params.toString()}`);
  };

  const oemValue = initialOem || (looksLikeOemCode(initialQuery) ? initialQuery : "");
  const contactHref = buildContactUrl({ oem: oemValue || undefined });

  return (
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
            <Link href={contactHref} className="font-semibold text-accent hover:underline">
              {ui.solicitarConsulta}
            </Link>
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
              const params = new URLSearchParams(searchParams.toString());
              return params.toString();
            })()}`}
            className="inline-flex rounded-xl border border-accent/40 px-6 py-3 text-sm font-semibold text-accent hover:bg-accent/10"
          >
            Ver todos en stock →
          </Link>
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
