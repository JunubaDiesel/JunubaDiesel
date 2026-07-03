# JUNUBA Corea Diesel — Web

Sitio B2B de repuestos para Hyundai Starex, Staria, Porter y Kia Bongo. Catálogo con stock JUNUBA, diagramas OEM (Partsouq), recursos de mantenimiento y asistente IA.

**Producción:** [junubadiesel.com](https://junubadiesel.com)  
**Repositorio:** [github.com/JunubaDiesel/JunubaDiesel](https://github.com/JunubaDiesel/JunubaDiesel)

## Stack

- Next.js 15 (App Router) · React 19 · Tailwind CSS 4
- Gemini (`@ai-sdk/google`) — chat, cotización, insights admin
- ERP sync — Excel/CSV → `data/inventory.json`
- Vercel Analytics + Speed Insights

## Inicio rápido

```bash
npm install
cp .env.example .env.local
# Editar .env.local con claves reales
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Ver [`.env.example`](.env.example). Obligatorias en producción:

| Variable | Uso |
|----------|-----|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Asistente IA (chat, compose-quote, insights) |
| `ADMIN_PASSWORD` | Basic auth `/admin/*` + APIs admin |
| `RESEND_API_KEY` | Formulario de contacto por email (opcional: fallback WhatsApp) |
| `SYNC_SECRET` | Sync ERP máquina-a-máquina (opcional) |
| `BLOB_READ_WRITE_TOKEN` | Videos Delga en Vercel Blob (opcional) |

> **Seguridad:** Si la clave Gemini se expuso, **rótela** en [Google AI Studio](https://aistudio.google.com/apikey) y actualice solo en Vercel / `.env.local` (nunca en git).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest (unit) |
| `npm run test:e2e` | Playwright smoke |
| `npm run sync:videos` | Delga YouTube → Recursos (local, requiere FFmpeg + yt-dlp) |

## Despliegue en Vercel

1. Conectar repo GitHub `JunubaDiesel/JunubaDiesel`
2. Framework: **Next.js** (auto-detect)
3. Añadir variables de entorno (ver arriba)
4. DNS: `junubadiesel.com` → Vercel
5. **No commitear:** `.env.local`, `data/inventory.json`, `public/videos/`

### Datos e inventario

- Seed: `src/data/parts.json`
- Producción: subir Excel/CSV vía `/admin/sync` (requiere `ADMIN_PASSWORD`)
- Imágenes ERP: `public/images/inventory/` (gitignored, generadas en sync)

### Videos Delga

Ver [`docs/video-sync.md`](docs/video-sync.md). Los MP4 locales no van a git; en Vercel use `BLOB_READ_WRITE_TOKEN` o URLs Blob en `/admin/resources`.

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/` | Landing |
| `/parts` | Stock JUNUBA |
| `/catalog` | Diagrama OEM Partsouq |
| `/buscar` | Hub de búsqueda |
| `/recursos` | Guías y videos |
| `/contact` | Formulario + WhatsApp |
| `/admin` | Sync ERP (protegido) |
| `/admin/resources` | CRUD recursos |

## CI

GitHub Actions ejecuta `lint`, `typecheck`, `build` y tests en cada push/PR (`.github/workflows/ci.yml`).

## Licencia

Privado — © Junuba Corea Diesel
