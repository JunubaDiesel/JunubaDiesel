import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedSyncRequest } from "@/lib/erp/auth";
import { readInventoryMeta } from "@/lib/erp/sync";
import { getInventoryStatsAsync } from "@/lib/inventory";
import { loadInventoryMetaFromBlob } from "@/lib/storage/persist";
import { isBlobStorageEnabled } from "@/lib/storage/blob-json";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const stats = await getInventoryStatsAsync();

  if (!isAuthorizedSyncRequest(request.headers, process.env.ADMIN_PASSWORD)) {
    return NextResponse.json({
      totalProducts: stats.totalProducts,
      inStockCount: stats.inStockCount,
      vehicleCount: stats.vehicleCount,
    });
  }

  if (isBlobStorageEnabled()) {
    const meta = await loadInventoryMetaFromBlob();
    if (meta) return NextResponse.json({ ...stats, ...meta });
  }

  const meta = readInventoryMeta();
  return NextResponse.json({ ...stats, ...meta });
}
