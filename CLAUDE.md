# CLAUDE.md — Tennis Coach App

## ¿Qué es esto?

App web para coaches de tenis independientes. Permite planificar clases, registrar asistencia y dejar notas por alumno en cada sesión.

**Coaches activas:**
- Vane: username `vane`, email `profetenisvanessa@gmail.com`, pass `Vane123`
- Sofía: username `sofi`, email `s.aishemberg@gmail.com`, pass `Sofi123`
- Andy Tapia: username `andy`, email `andytapiaok07@gmail.com`, pass `Andy123` — profe de tenis del hijo de Diego

**Diego** tiene rol `admin` — puede ver todos los datos de todos los coaches (username: `diemar7`, email: `diemar7@gmail.com`, pass: `Nano14`).

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
- Header fijo con ícono de perfil (esquina superior derecha)
- Logo (`public/logo.png`) como favicon y en pantalla de login
- **Perfil:** editar nombre y username, cambiar contraseña, cerrar sesión
- **Alumnos:** lista (filtro activos/todos), crear, ficha con edición y archivar/reactivar
- **Grupos:** lista, crear con selección de alumnos, detalle con edición de nombre/alumnos y archivar
- **Clases:** lista con duración total + badge de técnica, crear con etapas y técnica, detalle con edición y reordenamiento ↑↓ de etapas
- **Sesiones:** lista semanal navegable (lunes a domingo), crear (fecha+hora+grupo+clase opcionales), detalle con asistencia/nota/comentarios por alumno, cambio de estado (pendiente/finalizada/cancelada), asignación de clase desde el detalle
- Trigger Supabase: al crear usuario en Auth se crea automáticamente en `public.usuarios`

- **Ficha de alumno:** historial de sesiones con asistencia, nota, comentarios expandibles, filtro por técnica, promedio destacado y chips de promedio por técnica clicables
- **Ficha de grupo:** historial de sesiones con filtro por técnica y contador de sesiones
- **Sesiones pendientes:** al abrirlas se sincronizan automáticamente los alumnos del grupo (agrega faltantes, elimina los que ya no están sin datos)
- **Edición de fecha/hora** en el detalle de sesión
- **RLS admin:** Diego tiene acceso completo de escritura en todas las tablas durante el período de ajuste
- **Home con tip del día:** ruta `/home` con card de tip rotativo, tab Inicio en nav, login redirige a `/home`. Tips en `lib/tips.ts`, banco en `docs/tips-bank.md`, skill `/add-tip` para agregar el próximo a demanda
- **Tips anteriores en /home:** sección colapsable al final con todos los tips publicados excepto el de hoy, en orden inverso. `getTipsAnteriores()` en `lib/tips.ts`. Lógica: último del array = tip del día, resto = historial (sin rotación por fecha).
- **Distinción niños/adultos:** campo `es_nino` en `alumnos`, enum `nivel_alumno` ampliado (presco, escuela, entrenamiento). Toggle Adulto/Niño en crear y editar alumno, niveles dinámicos según categoría. Badge azul `Niño` en lista y ficha. Lista de grupos: badge `Niños` automático si todos los alumnos son niños.
- **Eliminar sesión:** botón al final del detalle con bottom sheet modal de confirmación estilizado
- **Compartir clases entre colegas:** tablas `coach_colega` + `clase_compartida`. Al crear/editar clase aparece selector de colegas. Badge violeta `Compartida` en lista. Detalle muestra "Compartida con X" (dueño) o "Compartida por X" (colega). Ambas editan la misma clase.
- **Desarrollo Profesional:** sección en `/home` con mini cursos. Curso 01 ("Más herramientas, mejores clases") y Curso 02 ("Enseñar jugando") implementados. Capítulos expandibles marcables como leídos, quiz final con nota guardada. Progreso individual por coach en tablas `progreso_curso` + `capitulo_leido`. Contenido fuente en `docs/courses/`. Cursos en `lib/cursos.ts`.
- **Ver etapas en detalle de sesión:** botón "Ver clase" colapsable bajo el nombre de la clase asignada. Muestra etapas (badge tipo + descripción + duración). Se actualiza al cambiar la clase.
- **Buscador en Alumnos y Grupos:** input de búsqueda en tiempo real al tope de cada lista. Sin llamadas extra a Supabase.
- **Repetir semana:** botón en lista de sesiones que copia todas las sesiones de la semana a la semana siguiente (mismo grupo/hora, estado pendiente, sin clase, con registros de alumnos automáticos).
- **Sesiones filtra por coach propio:** cada usuario ve solo sus sesiones (`coach_id = user.id`), sin excepción para admin. Si Diego necesita ver datos de otro coach, se hace por SQL directo.

### 🔜 Pendiente
- **Cursos 03, 04:** Biomecánica en el tenis / Psicología deportiva — contenido pendiente de escribir
- Ideas futuras: progreso por técnica, selector de tema, PWA
- Automatizar `/add-tip` con schedule (hoy es a demanda)

---

## Estructura de archivos

```
app/
  layout.tsx              — layout raíz, data-theme="polvo-de-ladrillo"
  page.tsx                — login (acepta username o email)
  globals.css             — theming CSS variables, componentes base (.badge-tecnica, etc)
  (app)/
    layout.tsx            — layout autenticado, chequea sesión, bottom nav
    clases/
      page.tsx            — lista con duración total y badge de técnica
      nueva/page.tsx      — crear clase con etapas reordenables y selector de técnica
      [id]/page.tsx       — detalle/editar clase
    sesiones/
      page.tsx            — lista semanal navegable ←/→
      nueva/page.tsx      — crear sesión (fecha, hora, grupo, clase)
      [id]/page.tsx       — detalle con asistencia/nota/comentarios por alumno
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
  tips.ts                 — array de tips, getTipDelDia() (último del array) y getTipsAnteriores()
  cursos.ts               — array de cursos con capítulos y quiz, getCurso(id)
public/
  favicon.svg             — pelota de tenis amarilla (#ccff00)
docs/
  tips-bank.md            — banco de tips categorizados (LIBRE/USADO)
  tips-history.md         — registro de tips ya publicados
  courses/
    01-mas-herramientas-mejores-clases.md  — fuente de verdad del Curso 01
    02-ensenar-jugando.md                  — fuente de verdad del Curso 02
```

---

## Modelo de datos

```
Usuario            → rol: 'coach' | 'admin', username único
Alumno             → pertenece a coach, nivel: principiante|intermedio|avanzado|presco|escuela|entrenamiento, es_nino: bool, activo
Grupo              → pertenece a coach, activo
AlumnoGrupo        → pivot many-to-many alumno <-> grupo
Clase              → plantilla reutilizable, pertenece a coach, tecnica?: tecnica_tipo
Etapa              → pasos de una clase: calentamiento|drill|juego|fisico, orden
Sesion             → evento real: grupo + clase? + fecha + hora? + estado: pendiente|finalizada|cancelada
RegistroAlumno     → alumno en sesión: asistencia + nota 1-10
ComentarioRegistro → comentarios cronológicos por registro (tabla separada)
ProgresoCurso      → coach_id, curso_id, nota, fecha_completado (quiz finalizado)
CapituloLeido      → coach_id, curso_id, capitulo_idx (progreso individual por capítulo)
```

---

## Theming

Dos temas: **polvo-de-ladrillo** (default) y **cancha-azul**. Ambos usan `#ccff00` como color de acción (botón CTA).
El tema se activa con `data-theme` en el `<html>`. Ver `docs/tennis-design.md` para la paleta completa.

Clases CSS base definidas en `globals.css`: `.btn-primary`, `.btn-secondary`, `.card`, `.input`, `.label-section`, `.badge`, `.badge-calentamiento`, `.badge-drill`, `.badge-juego`, `.badge-fisico`, `.badge-tecnica`

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

### Sesiones — registros automáticos
Al crear una sesión, se insertan automáticamente registros en `registros_alumno` para todos los alumnos del grupo, con asistencia `presente` por defecto.

### Deploy
```bash
git push origin main
```

### Crear usuario nuevo
```bash
curl -X POST 'https://vrdcjhdjctvkhadjqiao.supabase.co/auth/v1/admin/users' \
  -H 'apikey: SERVICE_ROLE_KEY' \
  -H 'Authorization: Bearer SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "EMAIL",
    "password": "PASSWORD",
    "email_confirm": true,
    "user_metadata": { "nombre": "NOMBRE", "username": "USERNAME", "rol": "coach" }
  }'
```

---

## Contexto de sesión
Al arrancar una sesión nueva, leer `docs/memory/CONTEXT.md` — apunta a todo lo necesario para retomar sin perder nada.

---

## MCP disponibles
- **Supabase MCP** — ejecutar SQL, migraciones, logs (cuenta Baseline)
