# JUNUBA — Guía de operación de contenido

Cómo actualizar la landing, el stock y los videos **sin confusión** entre Admin web, trabajo local y redeploy.

## Resumen rápido

| Contenido | ¿Solo Admin web? | ¿Redeploy git? | Requisito producción |
|-----------|------------------|----------------|----------------------|
| **Stock ERP** (Excel/CSV) | Sí — `/admin/sync` | No (con Blob) | `BLOB_READ_WRITE_TOKEN` en Vercel |
| **Videos / recursos** | Sí — `/admin/resources` | No (con Blob) | `BLOB_READ_WRITE_TOKEN` |
| **OEM frecuentes** (landing) | Sí — `/admin/oem-guides` | No (con Blob) | `BLOB_READ_WRITE_TOKEN` |
| **Textos landing, teléfonos** | No | Sí — editar código | `git push` |
| **Sync Delga masivo** | No | Sí — JSON (+ Blob opcional) | Local: `npm run sync:videos` |

---

## 1. Producción con Vercel Blob (recomendado)

Configure en Vercel → Storage → Blob → `BLOB_READ_WRITE_TOKEN`.

Con el token activo, el Admin **guarda de forma persistente**:

- `junuba/inventory.json` — catálogo ERP
- `junuba/inventory-meta.json` — fecha de sync
- `junuba/resources.json` — guías y videos
- `junuba/oem-guides.json` — piezas frecuentes en la landing
- `junuba/inventory-images/…` — fotos extraídas del Excel

**Flujo diario de stock:**

1. Entrar a `https://junubadiesel.com/admin/sync` (Basic Auth)
2. Subir **JUNUBA INFORMAR PIEZAS.xlsx** o CSV ERP
3. Esperar confirmación — la landing y `/parts` se actualizan (revalidación automática)

**Flujo de un video nuevo (manual):**

1. Subir MP4/poster a Vercel Blob (Dashboard) o usar `npm run sync:videos` en local
2. `/admin/resources` → pegar URLs Blob en `videoSrc` / `posterSrc` (o `youtubeId`)
3. Marcar **featured** si debe aparecer en la home

---

## 2. Desarrollo local (sin Blob)

- `npm run dev` → `/admin/sync` escribe en `data/inventory.json` y `public/images/inventory/`
- Sin token Blob: recursos y OEM guides en `data/*.json`
- Seed fallback: `src/data/parts.json`, `src/data/resources.json`, `src/data/oem-guides.json`

---

## 3. Landing page — qué cambia cómo

| Sección | Fuente de datos |
|---------|-----------------|
| Hero (números) | Inventario sync |
| VehicleGrid (OEM teaser) | `oem-guides` (Admin o seed) |
| EngineShowcase, fotos | Inventario (`featured`, imágenes ERP) |
| ResourcesShowcase | `resources.json` (`featured: true`) |
| About, Why JUNUBA, textos | Código — **requiere redeploy** |
| Teléfono, email, WhatsApp | `src/config/site.ts` — **requiere redeploy** |

---

## 4. Videos Delga (lote)

Ver [`video-sync.md`](./video-sync.md).

```powershell
npm run sync:videos:dry
npm run sync:videos
```

- Con `BLOB_READ_WRITE_TOKEN`: sube MP4/JPG y actualiza `src/data/resources.json`
- Commit + push de `resources.json` si también desea versionar en git
- Sin Blob: solo YouTube (`youtubeId`) funciona en producción sin archivos locales

---

## 5. Cuándo hace falta `git push`

- Cambiar copy, diseño o contacto en código
- Primera carga de `resources.json` / `oem-guides.json` en git
- Despliegue de nuevas funciones

**No hace falta push** para stock/recursos/OEM si `BLOB_READ_WRITE_TOKEN` está configurado y usa Admin.

---

## 6. Checklist semanal

- [ ] Sync ERP en `/admin/sync`
- [ ] Revisar `/parts` y números en la home
- [ ] Videos nuevos en `/admin/resources` o `sync:videos`
- [ ] Contacto actualizado en `site.ts` si cambió
