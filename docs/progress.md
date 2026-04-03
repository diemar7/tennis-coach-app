# Tennis Coach App – Progreso

## Stack definido
- Next.js (App Router) + TypeScript
- Supabase (PostgreSQL + Auth + RLS) — proyecto `vrdcjhdjctvkhadjqiao`, org Baseline
- Tailwind CSS + CSS variables para theming
- Vercel — deploy automático con cada push a `main`
- Repo: https://github.com/diemar7/tennis-coach-app
- URL prod: https://tennis-coach-app-seven.vercel.app

---

## Base de datos

### Migraciones aplicadas
1. `initial_schema` — tablas completas: `usuarios`, `alumnos`, `grupos`, `alumno_grupo`, `clases`, `etapas`, `sesiones`, `registros_alumno`, `comentarios_registro`
2. `rls_policies` — Row Level Security en todas las tablas, función `is_admin()`
3. `create_user_trigger` — trigger `on_auth_user_created` que inserta en `public.usuarios`
4. `add_username_to_usuarios` — campo `username` único con índice
5. `fix_user_trigger` — manejo explícito del enum `user_role`
6. `fix_trigger_search_path` — `SET search_path = public` para resolver enums desde `supabase_auth_admin`
7. `add_tecnica_to_clases` — enum `tecnica_tipo` + columna `tecnica` en `clases`
8. `add_estado_hora_to_sesiones` — enum `sesion_estado` + columnas `hora` y `estado` en `sesiones`

### Usuarios creados
| Username | Email | Rol | Password |
|----------|-------|-----|----------|
| diemar7 | diemar7@gmail.com | admin | Nano14 |
| vane | profetenisvanessa@gmail.com | coach | Vane123 |

---

## Funcionalidades implementadas y probadas ✅

### Autenticación
- Login con **email o username** — si no tiene `@` busca el email en `public.usuarios`
- Redirección automática a `/sesiones` tras login exitoso
- Guard en el layout autenticado — redirige a `/` si no hay sesión

### Layout
- Bottom navigation con 4 tabs: Sesiones / Clases / Alumnos / Grupos
- Tab activo resaltado con color primario
- Favicon pelota de tenis amarilla (SVG)

### Alumnos
- Lista con badge de nivel (principiante / intermedio / avanzado) y filtro activos/todos
- Crear alumno: nombre, apellido, nivel (selector visual), notas generales
- Ficha: ver datos, editar inline, archivar/reactivar
- **Probado:** Diego creó alumnos de prueba ✓

### Grupos
- Lista con activos y archivados separados
- Crear grupo: nombre, descripción, selección de alumnos con checkboxes
- Detalle: lista de miembros (con link a ficha), editar nombre/alumnos, archivar/reactivar
- **Probado:** creó grupo, editó para agregar un alumno nuevo ✓

### Clases
- Lista con badges de etapas, duración total sumada y badge de **técnica**
- Crear clase: título, objetivo, **técnica** (opcional), etapas con tipo/descripción/duración
- Detalle: ver estructura con badges de color por tipo, técnica destacada
- Editar: modificar título/objetivo/técnica/etapas, reordenar etapas con botones ↑↓
- **Probado:** creación y edición funcionando ✓

### Sesiones ✅ (recién implementado)
- **Lista semanal:** navegación ←/→ por semana, días agrupados, badge de estado
- **Crear sesión:** fecha + hora (opcional), grupo (obligatorio), clase (opcional)
  - Al crear se generan automáticamente los registros de todos los alumnos del grupo con asistencia "presente"
- **Detalle de sesión:**
  - Estado (Pendiente/Finalizada/Cancelada) — badge clickeable para cambiar
  - Clase asignable/cambiable desde el detalle
  - Cada alumno es una card expandible: asistencia (3 opciones), nota 1-10, comentarios cronológicos
  - Todo se guarda al instante, sin botón "Guardar" general

---

## Pendiente 🔜

### Ficha de alumno
- Historial de sesiones con asistencia, nota y comentarios

### Ideas futuras (fuera de v1)
- Progreso por técnica por alumno (la base está: `tecnica` en clases + `nota` en registros)
- Selector de tema (polvo de ladrillo / cancha azul)
- PWA — installable en el celular
- Historial visual de progresión por alumno
- Múltiples coaches con comunidad
