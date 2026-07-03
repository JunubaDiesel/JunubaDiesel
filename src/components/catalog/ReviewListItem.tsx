"use client";

import { categoryLabels, ui, vehicleLabels, type CategoryId, type VehicleId } from "@/config/site";
import { InventoryMatch } from "@/components/catalog/InventoryMatch";
import { useReviewList } from "@/context/ReviewListContext";

interface ReviewListItemProps {
  oemNumber: string;
  name?: string;
  vehicleId: VehicleId;
  categoryId?: CategoryId;
  notes?: string;
  onNotesChange?: (notes: string) => void;
  onRemove: () => void;
}

export function ReviewListItem({
  oemNumber,
  name,
  vehicleId,
  categoryId,
  notes,
  onNotesChange,
  onRemove,
}: ReviewListItemProps) {
  return (
    <li className="rounded-xl border border-border bg-surface-light p-4">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-sm font-bold text-accent">{oemNumber}</p>
          {name && <p className="mt-1 text-sm text-foreground">{name}</p>}
          <p className="mt-1 text-xs text-muted">
            {vehicleLabels[vehicleId]}
            {categoryId && ` · ${categoryLabels[categoryId]}`}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 rounded-lg px-2 py-1 text-xs text-muted hover:bg-surface hover:text-accent"
          aria-label={ui.remove}
        >
          {ui.remove}
        </button>
      </div>
      {onNotesChange && (
        <input
          type="text"
          value={notes ?? ""}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={ui.notes}
          className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted"
        />
      )}
      <InventoryMatch oemNumber={oemNumber} compact />
    </li>
  );
}

export function ReviewListBadgeButton() {
  const { count, togglePanel } = useReviewList();

  return (
    <button
      type="button"
      onClick={togglePanel}
      className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border transition-colors hover:border-accent/50 hover:text-accent"
      aria-label={ui.reviewList}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full accent-gradient px-1 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
