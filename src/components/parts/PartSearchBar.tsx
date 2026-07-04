"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { ui } from "@/config/site";

export function PartSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = query.trim();

    if (trimmed) params.set("q", trimmed);
    else params.delete("q");

    params.delete("page");
    router.push(`/parts?${params.toString()}`);
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={ui.searchPartsPlaceholder}
            className="w-full rounded-xl border border-border bg-surface-light px-4 py-3 text-sm outline-none transition focus:border-accent"
          />
          <button
            type="submit"
            className="rounded-xl accent-gradient px-6 py-3 text-sm font-semibold text-white"
          >
            {ui.searchParts}
          </button>
        </div>
      </form>
      <p className="mt-3 text-sm text-muted">
        {ui.noOemCode}{" "}
        <Link href="/contact" className="font-medium text-accent hover:underline">
          {ui.solicitarConsulta} →
        </Link>
      </p>
    </div>
  );
}
