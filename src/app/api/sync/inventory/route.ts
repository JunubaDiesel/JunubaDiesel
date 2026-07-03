import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedSyncRequest } from "@/lib/erp/auth";
import { syncInventoryFromExcel } from "@/lib/erp/excel-sync";
import { readInventoryMeta, syncInventoryFromCsv } from "@/lib/erp/sync";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const MAX_CSV_CHARS = 5_000_000;

function isExcelFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".xlsx") ||
    name.endsWith(".xlsm") ||
    file.type.includes("spreadsheet") ||
    file.type.includes("excel")
  );
}

export async function GET(request: NextRequest) {
  if (!isAuthorizedSyncRequest(request.headers, process.env.ADMIN_PASSWORD)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const meta = readInventoryMeta();
  return NextResponse.json(meta);
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedSyncRequest(request.headers, process.env.ADMIN_PASSWORD)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "Archivo demasiado grande (máx. 15 MB)" },
        { status: 413 }
      );
    }

    if (isExcelFile(file)) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await syncInventoryFromExcel(buffer);
      return NextResponse.json(result);
    }

    const csvContent = await file.text();
    const result = syncInventoryFromCsv(csvContent);
    return NextResponse.json(result);
  }

  const raw = await request.text();
  if (!raw.trim()) {
    return NextResponse.json({ error: "Contenido vacío" }, { status: 400 });
  }
  if (raw.length > MAX_CSV_CHARS) {
    return NextResponse.json({ error: "Contenido CSV demasiado grande" }, { status: 413 });
  }

  const result = syncInventoryFromCsv(raw);
  return NextResponse.json(result);
}
