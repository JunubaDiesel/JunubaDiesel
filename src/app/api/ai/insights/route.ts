import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { categoryLabels } from "@/config/site";
import { isAuthorizedSyncRequest } from "@/lib/erp/auth";
import { hasInventoryImage } from "@/lib/erp/excel-map";
import { getInventory } from "@/lib/inventory";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
  if (!isAuthorizedSyncRequest(request.headers, process.env.ADMIN_PASSWORD)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return NextResponse.json({ error: "AI no configurada" }, { status: 503 });
  }

  const inventory = getInventory();
  const inStock = inventory.filter((part) => (part.stockQty ?? 0) > 0);
  const lowStock = inventory.filter((part) => (part.stockQty ?? 0) > 0 && (part.stockQty ?? 0) <= 2);
  const withPhotos = inventory.filter(hasInventoryImage);

  const categoryCounts = Object.fromEntries(
    Object.keys(categoryLabels).map((category) => [
      category,
      inventory.filter((part) => part.category === category).length,
    ])
  );

  const avgPrice =
    inventory.reduce((sum, part) => sum + (part.priceClient ?? 0), 0) /
    Math.max(inventory.filter((part) => part.priceClient).length, 1);

  const summary = {
    totalProducts: inventory.length,
    inStockCount: inStock.length,
    lowStockCount: lowStock.length,
    withPhotosCount: withPhotos.length,
    categoryCounts,
    avgPriceClient: Math.round(avgPrice),
  };

  const { text } = await generateText({
    model: google("gemini-2.0-flash"),
    prompt: `Analiza el inventario JUNUBA y responde en español con bullets accionables:
${JSON.stringify(summary, null, 2)}

Incluye: % en stock, categoría principal, alertas de stock bajo, cobertura fotográfica y recomendación comercial.`,
  });

  return NextResponse.json({ insights: text, summary });
}
