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
| sofi | s.aishemberg@gmail.com | coach | Sofi123 |

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

### Perfil de usuario ✅
- Header fijo con ícono de perfil en esquina superior derecha
- Página `/perfil`: editar nombre y username, cambiar contraseña, cerrar sesión
- Logo (`logo.png`) como favicon y en pantalla de login

### Sesiones ✅
- **Lista semanal:** navegación ←/→ por semana, días agrupados, badge de estado
- **Crear sesión:** fecha + hora (opcional), grupo (obligatorio), clase (opcional)
  - Al crear se generan automáticamente los registros de todos los alumnos del grupo con asistencia "presente"
- **Detalle de sesión:**
  - Estado (Pendiente/Finalizada/Cancelada) — badge clickeable para cambiar
  - Clase asignable/cambiable desde el detalle
  - Cada alumno es una card expandible: asistencia (3 opciones), nota 1-10, comentarios cronológicos
  - Todo se guarda al instante, sin botón "Guardar" general

---

### Historial y filtros ✅
- **Ficha de alumno:** historial de sesiones con fecha, grupo, clase, badge de técnica, asistencia y nota. Cada sesión expandible para ver comentarios y link directo a la sesión. Promedio de notas destacado (actualizable al filtrar por técnica). Dropdown de técnica que solo muestra las que el alumno realmente tuvo. Chips clicables de promedio por técnica debajo del promedio general (se ocultan al filtrar).
- **Ficha de grupo:** historial de sesiones con fecha, clase, técnica y estado. Dropdown de técnica con contador de sesiones al filtrar.

### Sincronización de alumnos en sesiones pendientes ✅
- Al abrir una sesión **pendiente**, se comparan los alumnos actuales del grupo con los registros existentes.
- Se agregan los que faltan y se eliminan los que ya no están (solo si no tienen nota ni comentarios).
- Sesiones finalizadas o canceladas no se tocan.

### Edición de fecha y hora en sesión ✅
- En el detalle de cualquier sesión hay un botón "Editar fecha" para corregir fecha y hora inline.

### RLS admin — acceso completo de escritura ✅
- Diego (admin) tiene acceso completo de escritura en todas las tablas durante el período de ajuste de la app.
- Migración: `admin_full_write_access`

---

### Home con tip del día ✅
- Nueva ruta `/home` — pantalla de bienvenida con tip de coaching del día
- `lib/tips.ts` — array de tips con `getTipDelDia()` (rota por fecha)
- Tab "Inicio" agregado como primera opción en la bottom nav
- Login redirige a `/home` en lugar de `/sesiones`
- `docs/tips-bank.md` — banco de 22 tips categorizados (Metodología, Táctica, Mental, Físico, Gestión, Desarrollo), basados en ITF, USTA, Mouratoglou, Kovacs Institute
- `docs/tips-history.md` — registro de tips ya usados para evitar repetición
- Skill `/add-tip` — agrega el próximo tip libre del banco a la app y pushea
- **Tips en la app:** 2 (001 y 002 usados, 20 libres restantes) — último agregado: tip 002 (2026-04-08)

---

### Distinción niños / adultos ✅ (2026-04-07)
- Migración `add_nino_niveles`: columna `es_nino boolean` en `alumnos` + nuevos valores en enum `nivel_alumno`: `presco`, `escuela`, `entrenamiento`
- **Crear alumno:** toggle Adulto / Niño; el selector de nivel cambia dinámicamente (adultos: Principiante/Intermedio/Avanzado — niños: Presco/Escuela/Entrenamiento)
- **Editar alumno (ficha):** mismo toggle con niveles dinámicos; al cambiar de categoría resetea el nivel al primero correspondiente
- **Lista de alumnos:** badge azul `Niño` al lado del nombre si `es_nino = true`
- **Ficha de alumno:** sección "Categoría" muestra badge `Niño` + badge de nivel
- **Lista de grupos:** badge `Niños` automático si todos los alumnos del grupo son niños

### Eliminar sesión ✅ (2026-04-07)
- Botón "Eliminar sesión" al final del detalle de sesión
- Confirmación mediante bottom sheet modal (no `confirm()` del browser): fondo oscuro, sube desde abajo, botón rojo "Sí, eliminar" y botón gris "Cancelar". Se cierra tocando el fondo.
- Al confirmar elimina la sesión y vuelve a `/sesiones`

---

### Compartir clases entre colegas ✅ (2026-04-07)
- Tablas `coach_colega` (relación entre coaches que pueden compartir) y `clase_compartida` (a quién está compartida cada clase)
- Relación vane-sofi insertada en `coach_colega`
- Nueva clase y editar clase: selector de colegas para compartir (chips violetas)
- Lista de clases: badge violeta `Compartida` en clases compartidas, mezcladas con las propias
- Detalle de clase: el dueño ve "Compartida con [nombre]", la colega ve "Compartida por [nombre]"
- Ambas pueden editar la misma clase y asignarla a sus sesiones
- Escala: agregar más colegas solo requiere insertar en `coach_colega`
- RLS: políticas sin loops circulares — `clase_compartida` y `usuarios` con acceso abierto a autenticados

## Pendiente 🔜

### Ideas futuras (fuera de v1)
- Progreso por técnica por alumno (la base está: `tecnica` en clases + `nota` en registros)
- Selector de tema (polvo de ladrillo / cancha azul)
- PWA — installable en el celular
- Historial visual de progresión por alumno
- Múltiples coaches con comunidad
- Automatizar `/add-tip` con schedule (hoy es a demanda)
