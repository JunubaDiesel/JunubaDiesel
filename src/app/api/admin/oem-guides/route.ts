import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthorizedSyncRequest } from "@/lib/erp/auth";
import {
  loadOemGuidesAsync,
  removeGuidePart,
  replaceOemGuides,
  upsertGuidePart,
} from "@/lib/oem-guides";
import type { CategoryId, VehicleId } from "@/config/site";
import type { OemGuideEntry } from "@/types/oem-guide";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

function revalidateGuides() {
  revalidatePath("/");
}

export async function GET(request: NextRequest) {
  if (!isAuthorizedSyncRequest(request.headers, process.env.ADMIN_PASSWORD)) {
    return unauthorized();
  }
  return NextResponse.json(await loadOemGuidesAsync());
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedSyncRequest(request.headers, process.env.ADMIN_PASSWORD)) {
    return unauthorized();
  }

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("text/csv") || contentType.includes("multipart/form-data")) {
    let csv = "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      if (file instanceof File) csv = await file.text();
    } else {
      csv = await request.text();
    }

    const lines = csv.split(/\r?\n/).filter(Boolean);
    let imported = 0;
    for (const line of lines.slice(1)) {
      const [vehicleId, categoryId, oemNumber, name] = line.split(",").map((c) => c.trim());
      if (!vehicleId || !categoryId || !oemNumber || !name) continue;
      await upsertGuidePart({
        vehicleId: vehicleId as VehicleId,
        categoryId: categoryId as CategoryId,
        part: { oemNumber, name },
      });
      imported += 1;
    }
    revalidateGuides();
    return NextResponse.json({ ok: true, imported });
  }

  const body = (await request.json()) as {
    vehicleId: VehicleId;
    variantId?: string;
    categoryId: CategoryId;
    sectionTitle?: string;
    oemNumber: string;
    name: string;
    diagramRef?: string;
    notes?: string;
  };

  if (!body.vehicleId || !body.categoryId || !body.oemNumber?.trim() || !body.name?.trim()) {
    return NextResponse.json({ error: "Campos requeridos incompletos" }, { status: 400 });
  }

  const guide = await upsertGuidePart({
    vehicleId: body.vehicleId,
    variantId: body.variantId,
    categoryId: body.categoryId,
    sectionTitle: body.sectionTitle,
    part: {
      oemNumber: body.oemNumber.trim(),
      name: body.name.trim(),
      diagramRef: body.diagramRef?.trim(),
      notes: body.notes?.trim(),
    },
  });

  revalidateGuides();
  return NextResponse.json(guide, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorizedSyncRequest(request.headers, process.env.ADMIN_PASSWORD)) {
    return unauthorized();
  }

  const guideId = request.nextUrl.searchParams.get("guideId");
  const oemNumber = request.nextUrl.searchParams.get("oem");
  if (!guideId || !oemNumber) {
    return NextResponse.json({ error: "guideId y oem requeridos" }, { status: 400 });
  }

  if (!(await removeGuidePart(guideId, oemNumber))) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }
  revalidateGuides();
  return NextResponse.json({ ok: true });
}

export async function PUT(request: NextRequest) {
  if (!isAuthorizedSyncRequest(request.headers, process.env.ADMIN_PASSWORD)) {
    return unauthorized();
  }

  const body = (await request.json()) as { guides: OemGuideEntry[] };
  if (!Array.isArray(body.guides)) {
    return NextResponse.json({ error: "guides array requerido" }, { status: 400 });
  }
  await replaceOemGuides(body.guides);
  revalidateGuides();
  return NextResponse.json({ ok: true, count: body.guides.length });
}
