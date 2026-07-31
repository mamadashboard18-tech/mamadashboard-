# Mamá Dashboard — Brief del proyecto

## Qué es

Una app web (SPA) para acompañar a mujeres embarazadas y en postparto: seguimiento de citas médicas, bienestar, contenido multimedia educativo, comunidad y perfil. Incluye un modo "partner" (pareja) con su propio dashboard e invitaciones. Está en español, hecha por Renata con ayuda de IA (no hay equipo de desarrollo detrás).

## Stack técnico

- **Frontend:** React 19 + Vite 8 + Tailwind CSS 4. SPA sin router (navegación por estado en `src/App.jsx`).
- **Backend:** funciones serverless de Vercel bajo `/api` (no hay servidor propio; Vite solo sirve el frontend). Para probar rutas de `/api` en local hay que usar `npx vercel dev`, **no** `npm run dev` a secas (Vite solo no las sirve).
- **Base de datos / auth:** Supabase (Postgres + Auth). El signup usa un flujo de verificación por email **custom** (no el OTP nativo de Supabase): `/api/auth/send-verification-code` y `/api/auth/verify-and-signup` generan un código de 6 dígitos guardado en la tabla `email_verification_codes` y lo envían por Resend.
- **Email transaccional:** Resend (cuenta creada directo en resend.com, no vía Vercel Marketplace). En dev/test se usa el remitente sandbox `onboarding@resend.dev`.
- **Google Calendar:** integración OAuth de solo lectura (busy/free) para citas compartidas con el partner. El proyecto de Google Cloud vive bajo una cuenta dedicada (`mamadashboard18@gmail.com`), no la personal.
- **Deploy:** Vercel, proyecto `renata18/mamadashboard`. El repo de GitHub está conectado — cualquier push a `main` deploya a producción automáticamente. No hay ambiente de staging separado.
- **Lint:** Oxlint (`npm run lint`).

## Estructura del repo

```
api/                    funciones serverless (auth, google-calendar, partner)
  auth/                  verificación de email + signup
  google-calendar/       oauth, status, busy, disconnect
  partner/               invitaciones, datos compartidos, recordatorios, rsvp
  _lib/                  helpers compartidos (supabaseAdmin, resend, googleCalendar)
src/
  components/            componentes de UI, uno por feature/panel principal
    landing/              landing page pública
    auth/                 login/signup
    onboarding/           formulario de onboarding post-signup
    partner/               dashboard, invitación y gestión de partner
  data/                  capa de acceso a datos (llamadas a Supabase/api) + contenido estático
  lib/supabaseClient.js  cliente de Supabase para el frontend
supabase/migrations/     migraciones SQL (NO todas las tablas están acá — ver nota abajo)
data/                    CSVs de contenido fuente (multimedia semanal, etc.)
.github/workflows/       cron de recordatorios para el partner
```

## Secciones de la app (navegación principal)

Definidas en `src/data/sections.js` y renderizadas desde `src/App.jsx`:

1. **Inicio** — resumen/dashboard principal
2. **Citas** — control de citas médicas, contadores de contracciones, etc.
3. **Mi Bienestar** — diario libre, recuperación postparto
4. **Multimedia** — podcast semanal, meditaciones, audioguías (contenido curado, ver nota de alcance abajo)
5. **Comunidad** — grupos por semana de embarazo, foro, chats, moderación híbrida IA+humanos
6. **Mi Perfil** — datos personales, contactos de emergencia, privacidad (no está en el sidebar principal, se accede desde el header)

Hay además un modo **partner** completamente separado (`PartnerDashboard`, `PartnerJoinScreen`) para la pareja de la usuaria, con invitación por link/token.

## Decisiones de alcance importantes

- **Alcance completo, no MVP recortado.** Existe un documento de priorización (`MVP_Priorizacion_Definitiva.docx`, 122 features en 6 secciones etiquetadas MVP/V2.0/V3.0) pero Renata decidió explícitamente construir el alcance completo, no solo lo etiquetado "MVP". Al abordar una sección hay que usar la lista completa de features del doc como objetivo, respetando solo dependencias técnicas reales (ej: el widget del partner en Inicio necesita el sistema de cuentas partner primero).
- **Multimedia usa una curaduría propia de 14 features**, no las ~25 filas crudas del doc original.

## Cosas no obvias / gotchas conocidos

- La tabla `profiles` de Supabase **no tiene migración versionada** (a diferencia de `comunidad_perfiles`, `email_verification_codes`, `google_calendar_tokens`, que sí viven en `supabase/migrations/`). Se creó a mano. Si aparecen bugs raros de columnas faltantes en perfil, revisar el esquema real en la DB antes de asumir que el bug está en el frontend.
- `vercel link` sin pasar `--project mamadashboard --scope renata18` explícitamente puede crear un proyecto duplicado vacío. Siempre especificar ambos flags.
- Tocar archivos en `.github/workflows/*.yml` requiere un token de GitHub con permiso `workflow`.
- Vercel CLI no está instalado globalmente en la máquina de desarrollo — se usa `npx vercel <cmd>`.

## Cómo correr el proyecto

```bash
npm install
npx vercel dev   # sirve frontend + /api juntos (recomendado)
# o, solo frontend sin backend:
npm run dev
```

Variables de entorno necesarias están en `.env.local` (gitignored): claves de Supabase, Resend, Google OAuth, y credenciales de Postgres directo (usadas puntualmente para DDL que el cliente REST de Supabase no puede ejecutar).

## Convenciones de trabajo con IA en este repo

- Confirmar y pushear a `main` una vez que el trabajo esté terminado (Vercel autodeploya en cada push a `main`).
- Es común correr varias sesiones de Claude Code en paralelo sobre este mismo repo — conviene revisar el estado de git antes de crear ramas o hacer checkout, y preferir worktrees si se van a tocar los mismos archivos en paralelo.
