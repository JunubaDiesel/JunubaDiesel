"use client";

import { useEffect, useState } from "react";
import type { PublicLookupResult } from "@/lib/public-part";

export function useInventoryLookup(oemNumber?: string) {
  const [result, setResult] = useState<PublicLookupResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = oemNumber?.trim();
    if (!trimmed) {
      setResult(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/inventory/lookup?oem=${encodeURIComponent(trimmed)}`)
      .then((res) => res.json())
      .then((data: PublicLookupResult) => {
        if (!cancelled) setResult(data);
      })
      .catch(() => {
        if (!cancelled) setResult(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [oemNumber]);

  return { result, loading };
}
