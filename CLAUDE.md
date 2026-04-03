# CLAUDE.md — Tennis Coach App

## ¿Qué es esto?

App web para coaches de tenis independientes. Permite planificar clases, registrar asistencia y dejar notas por alumno en cada sesión.

**Usuario principal:** la profe de tenis de Diego (username: `vane`, mail pendiente).
**Diego** tiene rol `admin` — puede ver todos los datos de todos los coaches (username: `diemar7`, email: `diemar7@gmail.com`).

---

## Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Base de datos:** Supabase (PostgreSQL) — proyecto `vrdcjhdjctvkhadjqiao`
- **Autenticación:** Supabase Auth (email + password) con soporte de login por username
- **Estilos:** Tailwind CSS + CSS variables para theming
- **Deploy:** Vercel — conectado a GitHub, deploya automáticamente con cada push a `main`
- **URL producción:** https://tennis-coach-app-seven.vercel.app
- **Repo:** https://github.com/diemar7/tennis-coach-app

### Supabase

- **Proyecto:** `vrdcjhdjctvkhadjqiao`
- **URL:** `https://vrdcjhdjctvkhadjqiao.supabase.co`
- **Anon key (legacy):** hardcodeada en `lib/supabase.ts` (igual que tias-locas — las env vars no funcionan bien en Vercel con builds estáticos)
- **Org:** Baseline (`spgyrvqpaewcjyoqdmap`) — cuenta nueva separada de tias-locas

---

## Estado actual — qué está implementado

### ✅ Completado
- Login con email o username
- Layout autenticado con bottom navigation (Sesiones / Clases / Alumnos / Grupos)
- Favicon pelota de tenis (SVG)
- **Alumnos:** lista (filtro activos/todos), crear, ficha con edición y archivar/reactivar
- **Grupos:** lista, crear con selección de alumnos, detalle con edición de nombre/alumnos y archivar
- **Clases:** lista con duración total sumada, crear con etapas, detalle con edición y reordenamiento ↑↓ de etapas
- Trigger Supabase: al crear usuario en Auth se crea automáticamente en `public.usuarios`

### 🔜 Pendiente
- **Sesiones:** crear (elegir grupo + clase), detalle con registro de asistencia + notas por alumno, lista
- **Ficha de alumno:** historial de sesiones (placeholder hasta tener sesiones)
- Usuario de Vane (falta el mail)

---

## Estructura de archivos

```
app/
  layout.tsx              — layout raíz, data-theme="polvo-de-ladrillo"
  page.tsx                — login (acepta username o email)
  globals.css             — theming CSS variables, componentes base
  (app)/
    layout.tsx            — layout autenticado, chequea sesión, bottom nav
    clases/
      page.tsx            — lista con duración total por clase
      nueva/page.tsx      — crear clase con etapas reordenables
      [id]/page.tsx       — detalle/editar clase
    sesiones/
      page.tsx            — placeholder
      nueva/page.tsx      — TODO
      [id]/page.tsx       — TODO
    alumnos/
      page.tsx            — lista con badge de nivel
      nuevo/page.tsx      — formulario crear alumno
      [id]/page.tsx       — ficha con edición y archivar
    grupos/
      page.tsx            — lista activos/archivados
      nuevo/page.tsx      — crear grupo con selección de alumnos
      [id]/page.tsx       — detalle con edición de alumnos
lib/
  supabase.ts             — cliente Supabase singleton (lazy init)
  types.ts                — tipos TypeScript de todas las entidades
public/
  favicon.svg             — pelota de tenis amarilla (#ccff00)
```

---

## Modelo de datos

```
Usuario         → rol: 'coach' | 'admin', username único
Alumno          → pertenece a coach, nivel: principiante|intermedio|avanzado, activo
Grupo           → pertenece a coach, activo
AlumnoGrupo     → pivot many-to-many alumno <-> grupo
Clase           → plantilla reutilizable, pertenece a coach
Etapa           → pasos de una clase: calentamiento|drill|juego|fisico, orden
Sesion          → evento real: grupo + clase + fecha
RegistroAlumno  → alumno en sesión: asistencia + nota 1-10
ComentarioRegistro → comentarios cronológicos por registro (tabla separada)
```

---

## Theming

Dos temas: **polvo-de-ladrillo** (default) y **cancha-azul**. Ambos usan `#ccff00` como color de acción (botón CTA).
El tema se activa con `data-theme` en el `<html>`. Ver `docs/tennis-design.md` para la paleta completa.

Clases CSS base definidas en `globals.css`: `.btn-primary`, `.btn-secondary`, `.card`, `.input`, `.label-section`, `.badge`, `.badge-calentamiento`, `.badge-drill`, `.badge-juego`, `.badge-fisico`

---

## Decisiones técnicas importantes

### Login con username
Si el input no tiene `@`, se busca el email en `public.usuarios` por el campo `username` y se hace login con ese email.

### Cliente Supabase — singleton con lazy init
No usar `@supabase/ssr` — causa errores en SSR.

```typescript
let client: SupabaseClient | null = null
export function createClient() {
  if (!client) client = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  return client
}
```

### Trigger de usuario
Al crear un usuario en Supabase Auth, el trigger `on_auth_user_created` inserta automáticamente en `public.usuarios`. Requiere `SET search_path = public` para que resuelva el enum `user_role`.

### Deploy
```bash
git push origin main
```

### Crear usuario nuevo (ej: Vane)
```bash
curl -X POST 'https://vrdcjhdjctvkhadjqiao.supabase.co/auth/v1/admin/users' \
  -H 'apikey: SERVICE_ROLE_KEY' \
  -H 'Authorization: Bearer SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "EMAIL",
    "password": "PASSWORD",
    "email_confirm": true,
    "user_metadata": { "nombre": "Vane", "username": "vane", "rol": "coach" }
  }'
```

---

## MCP disponibles
- **Supabase MCP** — ejecutar SQL, migraciones, logs (cuenta Baseline)
