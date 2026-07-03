import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedSyncRequest } from "@/lib/erp/auth";
import { readInventoryMeta } from "@/lib/erp/sync";
import { getInventoryStats } from "@/lib/inventory";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const stats = getInventoryStats();

  if (!isAuthorizedSyncRequest(request.headers, process.env.ADMIN_PASSWORD)) {
    return NextResponse.json({
      totalProducts: stats.totalProducts,
      inStockCount: stats.inStockCount,
      vehicleCount: stats.vehicleCount,
    });
  }

  const meta = readInventoryMeta();
  return NextResponse.json({ ...stats, ...meta });
}
