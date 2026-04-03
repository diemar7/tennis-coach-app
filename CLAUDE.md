# CLAUDE.md — Tennis Coach App

## ¿Qué es esto?

App web para coaches de tenis independientes. Permite planificar clases, registrar asistencia y dejar notas por alumno en cada sesión.

**Usuario principal:** la profe de tenis de Diego.
**Diego** tiene rol `admin` — puede ver todos los datos de todos los coaches.

---

## Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Base de datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth (email + password)
- **Estilos:** Tailwind CSS + CSS variables para theming
- **Deploy:** Vercel

### Supabase

- **Proyecto:** `vrdcjhdjctvkhadjqiao`
- **URL:** `https://vrdcjhdjctvkhadjqiao.supabase.co`
- **Anon key (legacy):** hardcodeada en `lib/supabase.ts` (igual que tias-locas — las env vars no funcionan bien en Vercel con builds estáticos)

---

## Estructura de archivos

```
app/
  layout.tsx              — layout raíz, theming CSS vars
  page.tsx                — login
  (app)/
    layout.tsx            — layout autenticado con nav
    clases/
      page.tsx            — lista de clases (plantillas)
      nueva/page.tsx      — crear clase
      [id]/page.tsx       — detalle/editar clase
    sesiones/
      page.tsx            — lista de sesiones
      nueva/page.tsx      — crear sesión (elegir grupo + clase)
      [id]/page.tsx       — detalle sesión + registro por alumno
    alumnos/
      page.tsx            — lista de alumnos
      nuevo/page.tsx
      [id]/page.tsx       — ficha del alumno con historial
    grupos/
      page.tsx            — lista de grupos
      nuevo/page.tsx
      [id]/page.tsx
lib/
  supabase.ts             — cliente Supabase singleton
  types.ts                — tipos TypeScript de todas las entidades
```

---

## Modelo de datos

```
Usuario         → rol: 'coach' | 'admin'
Alumno          → pertenece a coach, nivel: principiante|intermedio|avanzado
Grupo           → pertenece a coach
AlumnoGrupo     → pivot many-to-many alumno <-> grupo
Clase           → plantilla reutilizable, pertenece a coach
Etapa           → pasos de una clase: calentamiento|drill|juego|fisico
Sesion          → evento real: grupo + clase + fecha
RegistroAlumno  → alumno en sesión: asistencia + nota 1-10
ComentarioRegistro → comentarios cronológicos por registro
```

---

## Theming

Dos temas: **polvo-de-ladrillo** y **cancha-azul**. Ambos usan `#ccff00` como color de acción (botón CTA).
El tema se activa con un atributo `data-theme` en el `<html>` y variables CSS.
Ver `tennis-design.md` para la paleta completa.

---

## Decisiones técnicas importantes

### Cliente Supabase — singleton con lazy init
Igual que tias-locas. No usar `@supabase/ssr` — causa errores en SSR.

```typescript
// lib/supabase.ts
let client: SupabaseClient | null = null
export function createClient() {
  if (!client) {
    client = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
  return client
}
```

### Deploy
```bash
git push origin main
```
El repo está conectado a Vercel — cada push a `main` deployea automáticamente.
**URL producción:** https://tennis-coach-app-seven.vercel.app

---

## MCP disponibles
- **Supabase MCP** — ejecutar SQL, migraciones, logs
