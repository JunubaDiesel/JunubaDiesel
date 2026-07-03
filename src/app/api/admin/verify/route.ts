import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedSyncRequest } from "@/lib/erp/auth";

export async function GET(request: NextRequest) {
  if (!isAuthorizedSyncRequest(request.headers, process.env.ADMIN_PASSWORD)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
