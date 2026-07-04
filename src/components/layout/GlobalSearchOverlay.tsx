"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { InventoryMatch } from "@/components/catalog/InventoryMatch";
import { ui } from "@/config/site";
import { buildContactUrl } from "@/lib/contact-url";
import { looksLikeOemCode } from "@/lib/oem-detect";

export function GlobalSearchOverlay() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const trimmed = query.trim();
  const isOem = looksLikeOemCode(trimmed);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const buildBuscarUrl = () => {
    const params = new URLSearchParams();
    if (isOem) params.set("oem", trimmed);
    else params.set("q", trimmed);
    return `/buscar?${params.toString()}`;
  };

  const contactHref = buildContactUrl({ oem: isOem ? trimmed : undefined });

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted transition hover:border-accent/40 hover:text-foreground lg:flex"
        aria-label={ui.buscarRepuesto}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <span>{ui.buscarRepuesto}</span>
        <span className="rounded border border-border px-1.5 py-0.5 text-[10px]">Ctrl K</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 px-4 pt-24">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-surface p-4 shadow-2xl">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!trimmed) return;
            router.push(buildBuscarUrl());
            setOpen(false);
            setQuery("");
          }}
        >
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={ui.searchPartsPlaceholder}
            className="w-full rounded-xl border border-border bg-surface-light px-4 py-3 text-base outline-none focus:border-accent"
          />
        </form>

        {trimmed && (
          <div className="mt-4 space-y-3 border-t border-border pt-4">
            {isOem && <InventoryMatch oemNumber={trimmed} compact />}
            <div className="flex flex-wrap gap-3">
              <Link
                href={buildBuscarUrl()}
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
                className="rounded-lg accent-gradient px-4 py-2 text-sm font-semibold text-white"
              >
                {ui.stockJUNUBA}
              </Link>
              <Link
                href={contactHref}
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
                className="rounded-lg border border-accent/40 px-4 py-2 text-sm font-semibold text-accent"
              >
                {ui.solicitarConsulta}
              </Link>
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span>{ui.searchPartsHint}</span>
          <button type="button" onClick={() => setOpen(false)} className="hover:text-accent">
            Esc
          </button>
        </div>
      </div>
    </div>
  );
}

export function MobileSearchButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/buscar")}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-border lg:hidden"
      aria-label={ui.buscarRepuesto}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
    </button>
  );
}
