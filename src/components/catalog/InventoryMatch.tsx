"use client";

import Link from "next/link";
import { ui } from "@/config/site";
import { useInventoryLookup } from "@/hooks/useInventoryLookup";

interface InventoryMatchProps {
  oemNumber: string;
  compact?: boolean;
}

export function InventoryMatch({ oemNumber, compact }: InventoryMatchProps) {
  const { result, loading } = useInventoryLookup(oemNumber);

  if (loading) {
    return <p className="mt-2 text-xs text-muted">Consultando stock JUNUBA…</p>;
  }

  if (!result?.found) {
    return (
      <p className={`text-xs text-muted ${compact ? "mt-2" : "mt-3"}`}>
        {ui.noStockJunuba}
      </p>
    );
  }

  const product = result.products[0];

  return (
    <div className={`rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 ${compact ? "mt-2" : "mt-3"}`}>
      <p className="text-xs font-semibold text-emerald-300">
        {ui.stockJUNUBA}: {result.totalStock} {ui.unitsInStock}
      </p>
      {product && (
        <Link
          href={`/parts/${product.slug}`}
          className="mt-1 inline-block text-xs font-medium text-accent hover:underline"
        >
          {ui.viewPart} →
        </Link>
      )}
    </div>
  );
}
