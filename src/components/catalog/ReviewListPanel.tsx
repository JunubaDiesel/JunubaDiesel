"use client";

import { useState } from "react";
import { siteConfig, ui, categoryLabels, vehicleLabels } from "@/config/site";
import { useReviewList } from "@/context/ReviewListContext";
import { useToast } from "@/context/ToastContext";
import { ReviewListItem } from "@/components/catalog/ReviewListItem";
import { Button } from "@/components/ui/Button";
import { telHref } from "@/lib/contact";
import { AnimatePresence, motion } from "framer-motion";

export function QuoteFromReview() {
  const { items, clearAll } = useReviewList();
  const { showToast } = useToast();
  const [generating, setGenerating] = useState(false);

  const buildListText = () =>
    items
      .map(
        (item, i) =>
          `${i + 1}. ${item.oemNumber}${item.name ? ` - ${item.name}` : ""} (${vehicleLabels[item.vehicleId]}${item.categoryId ? `, ${categoryLabels[item.categoryId]}` : ""})${item.notes ? `\n   Notas: ${item.notes}` : ""}`
      )
      .join("\n");

  const copyList = async () => {
    const header = `Lista de repuestos OEM - JUNUBA\n${"=".repeat(40)}\n\n`;
    await navigator.clipboard.writeText(header + buildListText());
    showToast(ui.listCopied);
  };

  const generateAiQuote = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/ai/compose-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            oemNumber: item.oemNumber,
            name: item.name,
            notes: item.notes,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        showToast(data.error ?? ui.contactError);
        return;
      }
      await navigator.clipboard.writeText(data.message);
      showToast(ui.listCopied);
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch {
      showToast(ui.contactError);
    } finally {
      setGenerating(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="space-y-3 border-t border-border pt-4">
      <Button onClick={generateAiQuote} variant="outline" size="sm" className="w-full" disabled={generating}>
        {generating ? ui.aiQuoteGenerating : ui.aiQuote}
      </Button>
      <Button onClick={copyList} variant="secondary" size="sm" className="w-full">
        {ui.copyList}
      </Button>
      <Button href={telHref(siteConfig.phone)} size="sm" className="w-full">
        {ui.requestQuoteFromList}
      </Button>
      <Button href={siteConfig.whatsapp} external variant="secondary" size="sm" className="w-full">
        {ui.contactWhatsApp}
      </Button>
      <Button href={siteConfig.instagram} external variant="outline" size="sm" className="w-full">
        Instagram DM
      </Button>
      <button
        type="button"
        onClick={clearAll}
        className="w-full text-center text-xs text-muted hover:text-accent"
      >
        {ui.clearList}
      </button>
    </div>
  );
}

export function ReviewListPanel() {
  const { items, isPanelOpen, closePanel, removeItem, updateNotes } = useReviewList();

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={closePanel}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-lg font-bold">
                {ui.reviewList}
                {items.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-muted">({items.length})</span>
                )}
              </h2>
              <button
                type="button"
                onClick={closePanel}
                className="rounded-lg p-2 text-muted hover:bg-surface-light hover:text-foreground"
                aria-label="Cerrar"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted">{ui.emptyReviewList}</p>
                  <p className="mt-2 text-sm text-muted">{ui.emptyReviewHint}</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map((item) => (
                    <ReviewListItem
                      key={item.id}
                      oemNumber={item.oemNumber}
                      name={item.name}
                      vehicleId={item.vehicleId}
                      categoryId={item.categoryId}
                      notes={item.notes}
                      onNotesChange={(notes) => updateNotes(item.id, notes)}
                      onRemove={() => removeItem(item.id)}
                    />
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-border px-5 py-4">
              <QuoteFromReview />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
