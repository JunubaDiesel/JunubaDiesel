import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthorizedSyncRequest } from "@/lib/erp/auth";
import {
  loadResourcesAsync,
  slugifyResource,
  writeResourcesAsync,
} from "@/lib/resources";
import type { Resource } from "@/types/resource";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

function generateId(): string {
  return `res-${Date.now().toString(36)}`;
}

function revalidateResources() {
  revalidatePath("/");
  revalidatePath("/recursos");
}

export async function GET(request: NextRequest) {
  if (!isAuthorizedSyncRequest(request.headers, process.env.ADMIN_PASSWORD)) {
    return unauthorized();
  }
  return NextResponse.json(await loadResourcesAsync());
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedSyncRequest(request.headers, process.env.ADMIN_PASSWORD)) {
    return unauthorized();
  }

  const body = (await request.json()) as Partial<Resource>;
  if (!body.title?.trim() || !body.description?.trim() || !body.url?.trim()) {
    return NextResponse.json({ error: "Campos requeridos incompletos" }, { status: 400 });
  }

  const id = generateId();
  const resource: Resource = {
    id,
    slug: slugifyResource(body.title, id),
    type: body.type ?? "tip",
    title: body.title.trim(),
    description: body.description.trim(),
    vehicle: body.vehicle ?? "all",
    url: body.url.trim(),
    youtubeId: body.youtubeId?.trim() || undefined,
    videoSrc: body.videoSrc?.trim() || undefined,
    posterSrc: body.posterSrc?.trim() || undefined,
    sourceChannel: body.sourceChannel,
    sourceUrl: body.sourceUrl?.trim() || undefined,
    thumbnail: body.thumbnail,
    tags: body.tags ?? [],
    publishedAt: body.publishedAt ?? new Date().toISOString(),
    featured: body.featured ?? false,
  };

  const resources = await loadResourcesAsync();
  resources.unshift(resource);
  await writeResourcesAsync(resources);
  revalidateResources();
  return NextResponse.json(resource, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!isAuthorizedSyncRequest(request.headers, process.env.ADMIN_PASSWORD)) {
    return unauthorized();
  }

  const body = (await request.json()) as Partial<Resource> & { id: string };
  if (!body.id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  const resources = await loadResourcesAsync();
  const index = resources.findIndex((item) => item.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: "Recurso no encontrado" }, { status: 404 });
  }

  const current = resources[index];
  const updated: Resource = {
    ...current,
    type: body.type ?? current.type,
    title: body.title?.trim() ?? current.title,
    description: body.description?.trim() ?? current.description,
    vehicle: body.vehicle ?? current.vehicle,
    url: body.url?.trim() ?? current.url,
    youtubeId: body.youtubeId?.trim() || undefined,
    videoSrc: body.videoSrc?.trim() || current.videoSrc,
    posterSrc: body.posterSrc?.trim() || current.posterSrc,
    sourceChannel: body.sourceChannel ?? current.sourceChannel,
    sourceUrl: body.sourceUrl?.trim() || current.sourceUrl,
    thumbnail: body.thumbnail ?? current.thumbnail,
    tags: body.tags ?? current.tags,
    publishedAt: body.publishedAt ?? current.publishedAt,
    featured: body.featured ?? current.featured,
    slug: body.slug ?? current.slug,
  };

  resources[index] = updated;
  await writeResourcesAsync(resources);
  revalidateResources();
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorizedSyncRequest(request.headers, process.env.ADMIN_PASSWORD)) {
    return unauthorized();
  }

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  const resources = await loadResourcesAsync();
  const next = resources.filter((item) => item.id !== id);
  if (next.length === resources.length) {
    return NextResponse.json({ error: "Recurso no encontrado" }, { status: 404 });
  }

  await writeResourcesAsync(next);
  revalidateResources();
  return NextResponse.json({ ok: true });
}
