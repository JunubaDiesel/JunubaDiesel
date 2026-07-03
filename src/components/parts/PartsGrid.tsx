"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PartCard } from "@/components/parts/PartCard";
import { PartFilter } from "@/components/parts/PartFilter";
import { PartSearchBar } from "@/components/parts/PartSearchBar";
import { ui } from "@/config/site";
import type { Part } from "@/types/part";

interface PartsGridProps {
  parts: Part[];
  total: number;
  page: number;
  totalPages: number;
}

function PartsGridContent({ parts, total, page, totalPages }: PartsGridProps) {
  const searchParams = useSearchParams();
  const nextParams = new URLSearchParams(searchParams.toString());
  if (page < totalPages) nextParams.set("page", String(page + 1));
  else nextParams.delete("page");
  const nextPageHref =
    page < totalPages && nextParams.toString()
      ? `/parts?${nextParams.toString()}`
      : page < totalPages
        ? `/parts?page=${page + 1}`
        : null;

  return (
    <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Suspense fallback={<div className="text-muted">{ui.loadingFilters}</div>}>
          <PartFilter />
        </Suspense>
      </aside>

      <div>
        <Suspense fallback={null}>
          <PartSearchBar />
        </Suspense>

        <p className="mb-6 text-sm text-muted">
          <span className="font-semibold text-foreground">{total}</span> {ui.totalParts}
          {totalPages > 1 && (
            <span className="ml-2">
              · {ui.pageLabel} {page}/{totalPages}
            </span>
          )}
        </p>

        {parts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface-light p-12 text-center">
            <p className="text-lg font-medium text-muted">{ui.noPartsFound}</p>
            <p className="mt-2 text-sm text-muted">{ui.noPartsHint}</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {parts.map((part) => (
                <PartCard key={part.id} part={part} />
              ))}
            </div>
            {nextPageHref && (
              <div className="mt-10 text-center">
                <Link
                  href={nextPageHref}
                  className="inline-flex rounded-xl border border-accent/40 px-6 py-3 text-sm font-semibold text-accent transition hover:bg-accent/10"
                >
                  {ui.loadMoreParts}
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function PartsGrid(props: PartsGridProps) {
  return (
    <Suspense fallback={<div className="text-muted">{ui.loadingFilters}</div>}>
      <PartsGridContent {...props} />
    </Suspense>
  );
}
