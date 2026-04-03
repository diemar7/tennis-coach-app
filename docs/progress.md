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

### Usuarios creados
| Username | Email | Rol | Password |
|----------|-------|-----|----------|
| diemar7 | diemar7@gmail.com | admin | Nano14 |
| vane | pendiente (Diego la ve) | coach | pendiente |

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
- **Probado:** Diego creó a Florencia Abreo y Diego Fleitas ✓, agregó un tercer alumno ✓

### Grupos
- Lista con activos y archivados separados
- Crear grupo: nombre, descripción, selección de alumnos con checkboxes
- Detalle: lista de miembros (con link a ficha), editar nombre/alumnos, archivar/reactivar
- **Probado:** creó grupo, editó para agregar un alumno nuevo ✓

### Clases
- Lista con badges de etapas y duración total sumada
- Crear clase: título, objetivo, etapas con tipo/descripción/duración, botón "+ Agregar etapa"
- Detalle: ver estructura con badges de color por tipo
- Editar: modificar título/objetivo/etapas, reordenar etapas con botones ↑↓
- **Probado:** creación y edición funcionando ✓

---

## Pendiente 🔜

### Sesiones (próximo paso)
- Lista de sesiones (más recientes primero): fecha, clase, grupo, cantidad de asistentes
- Crear sesión: elegir grupo + elegir clase plantilla → se precarga lista de alumnos del grupo
- Detalle de sesión:
  - Ver clase utilizada y grupo
  - Marcar asistencia por alumno (presente / ausente / justificado)
  - Nota 1-10 por alumno (opcional)
  - Comentarios cronológicos por alumno (tabla separada, se pueden agregar varios)

### Ficha de alumno
- Historial de sesiones con asistencia, nota y comentarios (placeholder hasta tener sesiones)

### Usuario Vane
- Crear cuando Diego tenga el mail

### Ideas futuras (fuera de v1)
- Selector de tema (polvo de ladrillo / cancha azul)
- PWA — installable en el celular
- Historial visual de progresión por alumno
- Múltiples coaches con comunidad
