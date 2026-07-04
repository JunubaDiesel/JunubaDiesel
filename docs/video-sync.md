# Sincronización de videos Delga → Recursos

Pipeline local para importar los últimos videos del canal **@delga2000ca** a la sección `/recursos` de JUNUBA.

## Requisitos

1. **FFmpeg** — ya instalado en Windows (PATH)
2. **yt-dlp** — instalar si no está disponible:
   ```powershell
   pip install yt-dlp
   ```

> **Nota:** El canal @delga2000ca publica principalmente **Shorts** (no tiene pestaña Videos). El script usa automáticamente `/shorts` como fuente.
3. **Logo** — `public/images/logo.png` (overlay esquina superior izquierda)

## Comandos

```powershell
# Vista previa (solo metadatos, sin descargar)
npm run sync:videos:dry

# Descargar, aplicar logo JUNUBA, generar posters y actualizar resources.json
npm run sync:videos
```

## Variables de entorno (opcionales)

```env
DELGA_YOUTUBE_CHANNEL=@delga2000ca
SYNC_VIDEO_LIMIT=20
FFMPEG_PATH=ffmpeg
YTDLP_PATH=yt-dlp
BLOB_READ_WRITE_TOKEN=   # Si está definido, sube mp4/jpg a Vercel Blob
```

## Salida

| Artefacto | Ubicación |
|-----------|-----------|
| Videos con logo | `public/videos/delga/{videoId}.mp4` |
| Posters | `public/videos/delga/{videoId}.jpg` |
| Metadatos Recursos | `src/data/resources.json` |

Los archivos en `public/videos/` y `temp/` están en `.gitignore`. En producción, configure `BLOB_READ_WRITE_TOKEN` para que Admin y sync persistan datos. Ver [`content-operations.md`](./content-operations.md).

## Despliegue en Vercel Blob (producción)

1. Crear un Blob store en el proyecto Vercel y copiar `BLOB_READ_WRITE_TOKEN` a env vars.
2. Ejecutar sync local con token definido:
   ```powershell
   $env:BLOB_READ_WRITE_TOKEN="vercel_blob_..."
   npm run sync:videos
   ```
3. El script sube `{videoId}.mp4` y `{videoId}.jpg` y escribe URLs Blob en `resources.json`.
4. En Vercel, commitear solo `resources.json` (no los MP4 locales).
5. Alternativa manual: subir archivos en Vercel Dashboard → Storage → Blob y pegar URLs en `/admin/resources`.

### ISR tras sync ERP

Tras subir inventario vía `/admin/sync`, las páginas `/parts/[slug]` usan `revalidate = 3600`. Para refresco inmediato en producción, redeploy o invocar revalidación on-demand desde un webhook interno.

## Flujo

1. yt-dlp obtiene los últimos N videos del canal
2. FFmpeg superpone el logo JUNUBA (120px, margen 24px)
3. Se genera un poster JPG en el segundo 3
4. Se hace upsert en `resources.json` (elimina placeholder `res-6` y reemplaza videos Delga previos)

## Admin

- `/admin` — instrucciones de sincronización
- `/admin/resources` — editar manualmente `videoSrc`, `posterSrc`, `sourceUrl`
