# JUNUBA Corea Diesel — Web

Sitio B2B de repuestos para Hyundai Starex, Staria, Porter y Kia Bongo. Catálogo con stock JUNUBA, recursos de mantenimiento, consulta por formulario/WhatsApp y asistente IA.

**Producción:** [www.junubadiesel.com](https://www.junubadiesel.com)  
**Repositorio:** [github.com/JunubaDiesel/JunubaDiesel](https://github.com/JunubaDiesel/JunubaDiesel)

> **Operación diaria:** ver [`docs/content-operations.md`](docs/content-operations.md) — stock, videos y landing.

## Stack

- Next.js 15 (App Router) · React 19 · Tailwind CSS 4
- Gemini (`@ai-sdk/google`) — chat, insights admin
- ERP sync — Excel/CSV → inventario (local o Vercel Blob)
- Vercel Blob — persistencia de stock/recursos/OEM en producción
- Vercel Analytics + Speed Insights · Upstash Redis (rate limit, opcional)

## Inicio rápido

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Variables de entorno

| Variable | Uso |
|----------|-----|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Asistente IA |
| `ADMIN_PASSWORD` | Basic auth `/admin/*` |
| `BLOB_READ_WRITE_TOKEN` | **Producción:** stock, recursos y OEM guides persistentes vía Admin |
| `RESEND_API_KEY` | Formulario contacto (fallback WhatsApp) |
| `UPSTASH_REDIS_REST_*` | Rate limit distribuido (recomendado prod) |

## Operación de contenido

| Tarea | Método |
|-------|--------|
| Actualizar stock | `/admin/sync` — Excel JUNUBA o CSV ERP |
| Videos / guías | `/admin/resources` o `npm run sync:videos` |
| Piezas OEM frecuentes (landing) | `/admin/oem-guides` |
| Textos, teléfonos, diseño | Editar código → `git push` |

Con **`BLOB_READ_WRITE_TOKEN`** en Vercel, Admin guarda en Blob **sin redeploy**. Sin Blob, use sync local + commit de JSON seed.

Detalle completo: [`docs/content-operations.md`](docs/content-operations.md)

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build producción |
| `npm test` | Vitest |
| `npm run sync:videos` | Delga YouTube → recursos (local, FFmpeg + yt-dlp) |
| `npm run seed:oem-guides` | Regenerar seed OEM desde `parts.json` |

## Admin

- `/admin` — panel principal
- `/admin/sync` — inventario ERP
- `/admin/resources` — videos y artículos
- `/admin/oem-guides` — piezas frecuentes (landing)

Autenticación: **Basic Auth** del navegador (`ADMIN_PASSWORD`).

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/` | Landing |
| `/parts` | Stock JUNUBA |
| `/buscar` | Búsqueda stock |
| `/recursos` | Guías y videos |
| `/contact` | Formulario + WhatsApp |

`/catalog` redirige a `/contact` (Partsouq eliminado).

## Despliegue Vercel

**Plan completo:** [`docs/vercel-deploy-plan.md`](docs/vercel-deploy-plan.md)

1. Push a GitHub
2. [vercel.com/new](https://vercel.com/new) — **Continue with GitHub** (same account as `JunubaDiesel`) → Import `JunubaDiesel/JunubaDiesel`, branch **`main`**
3. O por CLI:
   ```powershell
   npx vercel login
   .\scripts\deploy-production.ps1
   ```
4. Añadir env vars (tabla arriba) — el script lee `.env.local` y genera `ADMIN_PASSWORD` si falta
5. Crear **Blob store** en Vercel → Storage → copiar `BLOB_READ_WRITE_TOKEN` → redeploy
6. **DNS** (Squarespace/registrar, **no tocar MX**):
   | Host | Tipo | Valor |
   |------|------|-------|
   | `@` | A | `76.76.21.21` |
   | `www` | CNAME | `cname.vercel-dns.com` |
7. Vercel → Domains → primary `www.junubadiesel.com`, apex → www redirect
8. Verificar: `.\scripts\verify-production.ps1`

### GitHub Actions (opcional)

Tras importar en Vercel, añadir secrets en GitHub → Settings → Secrets:

| Secret | Dónde obtenerlo |
|--------|-----------------|
| `VERCEL_TOKEN` | Vercel → Account → Tokens |
| `VERCEL_ORG_ID` | Project → Settings → General |
| `VERCEL_PROJECT_ID` | Project → Settings → General |

Ejecutar manualmente: GitHub → Actions → **Deploy Vercel** → Run workflow (después de añadir secrets).

**Producción canonical:** `https://www.junubadiesel.com`

## Licencia

Privado — © Junuba Corea Diesel
