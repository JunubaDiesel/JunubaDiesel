"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CategoryId, VehicleId } from "@/config/site";
import type { ReviewItem } from "@/types/review-item";

const STORAGE_KEY = "junuba-review-list";

interface AddReviewParams {
  oemNumber: string;
  name?: string;
  vehicleId: VehicleId;
  variantId?: string;
  categoryId?: CategoryId;
  notes?: string;
}

interface ReviewListContextValue {
  items: ReviewItem[];
  count: number;
  addItem: (params: AddReviewParams) => void;
  removeItem: (id: string) => void;
  updateNotes: (id: string, notes: string) => void;
  clearAll: () => void;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
}

const ReviewListContext = createContext<ReviewListContextValue | null>(null);

function loadItems(): ReviewItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReviewItem[]) : [];
  } catch {
    return [];
  }
}

function saveItems(items: ReviewItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function ReviewListProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadItems());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveItems(items);
  }, [items, hydrated]);

  const addItem = useCallback((params: AddReviewParams) => {
    const trimmed = params.oemNumber.trim();
    if (!trimmed) return;

    setItems((prev) => {
      if (prev.some((i) => i.oemNumber === trimmed && i.vehicleId === params.vehicleId)) {
        return prev;
      }
      const item: ReviewItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        oemNumber: trimmed,
        name: params.name,
        vehicleId: params.vehicleId,
        variantId: params.variantId,
        categoryId: params.categoryId,
        notes: params.notes,
        addedAt: new Date().toISOString(),
      };
      return [item, ...prev];
    });
    setIsPanelOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateNotes = useCallback((id: string, notes: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, notes } : i)));
  }, []);

  const clearAll = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      addItem,
      removeItem,
      updateNotes,
      clearAll,
      isPanelOpen,
      openPanel: () => setIsPanelOpen(true),
      closePanel: () => setIsPanelOpen(false),
      togglePanel: () => setIsPanelOpen((o) => !o),
    }),
    [items, addItem, removeItem, updateNotes, clearAll, isPanelOpen]
  );

  return (
    <ReviewListContext.Provider value={value}>{children}</ReviewListContext.Provider>
  );
}

export function useReviewList() {
  const ctx = useContext(ReviewListContext);
  if (!ctx) throw new Error("useReviewList must be used within ReviewListProvider");
  return ctx;
}
