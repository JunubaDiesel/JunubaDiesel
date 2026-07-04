import { NextRequest, NextResponse } from "next/server";
import { lookupByErpId, lookupByOem } from "@/lib/inventory";
import { toPublicLookupResult } from "@/lib/public-part";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const limited = await checkRateLimit(request, {
    prefix: "inventory-lookup",
    limit: 60,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const oem = request.nextUrl.searchParams.get("oem");
  const erpId = request.nextUrl.searchParams.get("erpId");

  if (!oem && !erpId) {
    return NextResponse.json(
      { error: "Parámetro oem o erpId requerido" },
      { status: 400 }
    );
  }

  const result = oem ? lookupByOem(oem) : lookupByErpId(erpId!);
  return NextResponse.json(toPublicLookupResult(result));
}
