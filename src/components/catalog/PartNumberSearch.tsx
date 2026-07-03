"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { InventoryMatch } from "@/components/catalog/InventoryMatch";
import { ui } from "@/config/site";
import type { CategoryId, VehicleId } from "@/config/site";
import { useReviewList } from "@/context/ReviewListContext";
import { buildPartsouqSearchUrl } from "@/lib/partsouq";

interface PartNumberSearchProps {
  vehicleId: VehicleId;
  variantId?: string;
  categoryId?: CategoryId;
}

export function PartNumberSearch({ vehicleId, variantId, categoryId }: PartNumberSearchProps) {
  const [query, setQuery] = useState("");
  const { addItem } = useReviewList();

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    window.open(buildPartsouqSearchUrl(trimmed), "_blank", "noopener,noreferrer");
  };

  const handleAdd = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    addItem({ oemNumber: trimmed, vehicleId, variantId, categoryId });
    setQuery("");
  };

  return (
    <div className="rounded-xl border border-border bg-surface-light p-4">
      <label htmlFor="oem-search" className="mb-2 block text-sm font-medium text-foreground">
        {ui.searchOemNumber}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="oem-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={ui.searchOemPlaceholder}
          className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted"
        />
        <div className="flex gap-2">
          <Button type="button" onClick={handleSearch} variant="outline" size="sm">
            {ui.searchOemNumber}
          </Button>
          <Button type="button" onClick={handleAdd} size="sm">
            {ui.addToReview}
          </Button>
        </div>
      </div>
      {query.trim() && <InventoryMatch oemNumber={query.trim()} />}
    </div>
  );
}
