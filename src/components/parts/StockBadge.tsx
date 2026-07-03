import { ui } from "@/config/site";
import type { StockStatus } from "@/types/part";
import { cn } from "@/lib/utils";

interface StockBadgeProps {
  stockQty?: number;
  stockStatus?: StockStatus;
  className?: string;
}

export function StockBadge({ stockQty, stockStatus, className }: StockBadgeProps) {
  const status =
    stockStatus ??
    (stockQty === undefined
      ? "in_stock"
      : stockQty <= 0
        ? "out_of_stock"
        : stockQty <= 2
          ? "low"
          : "in_stock");

  const labels: Record<StockStatus, string> = {
    in_stock: ui.inStock,
    low: ui.lowStock,
    out_of_stock: ui.outOfStock,
  };

  const styles: Record<StockStatus, string> = {
    in_stock: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    low: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    out_of_stock: "bg-red-500/15 text-red-300 border-red-500/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        styles[status],
        className
      )}
    >
      {labels[status]}
      {stockQty !== undefined && stockQty > 0 && (
        <span className="ml-1.5 opacity-80">({stockQty})</span>
      )}
    </span>
  );
}
