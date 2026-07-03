"use client";

import { categoryLabels, ui, type CategoryId } from "@/config/site";
import { getAllCategories } from "@/lib/partsouq";
import { cn } from "@/lib/utils";

interface CategorySidebarProps {
  selected: CategoryId;
  onSelect: (id: CategoryId) => void;
}

export function CategorySidebar({ selected, onSelect }: CategorySidebarProps) {
  const categories = getAllCategories();

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
        {ui.selectCategory}
      </h3>
      <div className="flex flex-wrap gap-2 lg:flex-col">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={cn(
              "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors lg:w-full",
              selected === cat.id
                ? "border-accent bg-accent/15 text-accent"
                : "border-border bg-surface-light text-muted hover:border-accent/40 hover:text-foreground"
            )}
          >
            {cat.label}
            <span className="mt-0.5 block text-xs font-normal opacity-70">
              {categoryLabels[cat.id]} · {cat.cname}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
