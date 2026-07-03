"use client";

import Link from "next/link";
import { vehicleLabels } from "@/config/site";

interface ToolPart {
  type: string;
  toolCallId?: string;
  toolName?: string;
  state?: string;
  input?: unknown;
  output?: unknown;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function StockCard({ part }: { part: Record<string, unknown> }) {
  const name = String(part.name ?? "Repuesto");
  const slug = part.slug ? String(part.slug) : null;
  const stockQty = Number(part.stockQty ?? 0);
  const vehicle = part.vehicle ? String(part.vehicle) : null;

  return (
    <div className="rounded-lg border border-border/60 bg-background/40 p-2 text-xs">
      {slug ? (
        <Link href={`/parts/${slug}`} className="font-semibold text-accent hover:underline">
          {name}
        </Link>
      ) : (
        <p className="font-semibold">{name}</p>
      )}
      <p className="mt-1 text-muted">
        Stock: {stockQty}
        {vehicle && vehicle in vehicleLabels
          ? ` · ${vehicleLabels[vehicle as keyof typeof vehicleLabels]}`
          : ""}
      </p>
    </div>
  );
}

function ToolResultBlock({ part }: { part: ToolPart }) {
  const output = asRecord(part.output);
  const toolName = part.toolName ?? part.type.replace(/^tool-/, "");

  if (part.state === "input-streaming" || part.state === "input-available") {
    return <p className="text-xs italic text-muted">Consultando {toolName}…</p>;
  }

  if (!output) return null;

  if (toolName === "searchParts" || toolName === "lookupOem") {
    const products = Array.isArray(output.products)
      ? output.products
      : Array.isArray(output.parts)
        ? output.parts
        : [];
    const total = Number(output.total ?? output.totalStock ?? products.length);

    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground">
          {output.found === false ? "Sin coincidencias" : `${total} resultado(s)`}
        </p>
        {products.slice(0, 4).map((item, index) => (
          <StockCard key={index} part={asRecord(item) ?? {}} />
        ))}
      </div>
    );
  }

  if (toolName === "composeWhatsApp") {
    const url = output.url ? String(output.url) : null;
    const message = output.message ? String(output.message) : "";
    return (
      <div className="space-y-2 text-xs">
        {message && <p className="whitespace-pre-wrap text-muted">{message}</p>}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-semibold text-accent hover:underline"
          >
            Abrir WhatsApp →
          </a>
        )}
      </div>
    );
  }

  if (toolName === "searchResources") {
    const items = Array.isArray(output) ? output : Array.isArray(output.results) ? output.results : [];
    return (
      <div className="space-y-2 text-xs">
        {items.slice(0, 3).map((item, index) => {
          const resource = asRecord(item);
          if (!resource) return null;
          const title = String(resource.title ?? "Recurso");
          const slug = resource.slug ? String(resource.slug) : null;
          return slug ? (
            <Link key={index} href={`/recursos/${slug}`} className="block text-accent hover:underline">
              {title}
            </Link>
          ) : (
            <p key={index}>{title}</p>
          );
        })}
      </div>
    );
  }

  if (toolName === "getInventoryStats") {
    return (
      <p className="text-xs text-muted">
        Catálogo: {String(output.totalProducts ?? "—")} · En stock:{" "}
        {String(output.inStockCount ?? "—")}
      </p>
    );
  }

  return null;
}

export function ChatToolParts({ parts }: { parts: ToolPart[] }) {
  return (
    <>
      {parts.map((part, index) => {
        if (part.type === "text" && "text" in part) {
          return (
            <p key={index} className="whitespace-pre-wrap">
              {String((part as { text?: string }).text ?? "")}
            </p>
          );
        }
        if (part.type === "tool-invocation" || part.type.startsWith("tool-")) {
          return (
            <div key={part.toolCallId ?? index} className="mt-2 border-t border-border/40 pt-2">
              <ToolResultBlock part={part} />
            </div>
          );
        }
        return null;
      })}
    </>
  );
}
