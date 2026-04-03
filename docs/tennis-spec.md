# Tennis Coach App – Especificación de Producto

## Contexto y problema a resolver

App web para coaches de tenis independientes. Permite planificar clases, registrar sesiones y hacer seguimiento del progreso de los alumnos.

El usuario principal es una profe de tenis independiente que trabaja con grupos de ~6 alumnos por cancha, en todos los niveles. Diego (el creador de la app) tiene rol admin y puede ver todos los datos para ayudar a la profe en el arranque.

---

## Propuesta de valor y diferencial

Las herramientas que existen hoy para coaches de tenis (Tennis Locker, Planubo, First Class, etc.) están pensadas desde el lado del **negocio**: reservas online, cobros, comunicación con padres, gestión de canchas. Son herramientas de administración, no de coaching.

Esta app apunta a un usuario distinto: el **profesor independiente que está en la cancha**. No necesita facturar ni gestionar reservas — necesita registrar lo que pasa en cada clase y hacer seguimiento real del progreso de sus alumnos.

**El diferencial es el foco:**
- No hay capa de negocio (pagos, reservas, padres).
- Todo gira alrededor de la clase y el alumno desde una perspectiva técnica.
- Diseñada para usarse en la cancha, con el celular en la mano, en 2 minutos.
- El registro no es burocrático — es una herramienta que le sirve al profesor para ser mejor coach.

**Usuario objetivo:** profesor de tenis independiente que da clases a grupos, de cualquier nivel, y quiere llevar un registro técnico simple y confiable de sus alumnos sin complicarse con software de gestión empresarial.

**Escalabilidad:** la app está pensada para que múltiples coaches puedan usarla de forma independiente. Cada coach tiene su propio mundo de datos (alumnos, grupos, clases). A futuro podría convertirse en una comunidad de coaches.

---

## Usuarios y roles

| Rol | Descripción |
|-----|-------------|
| `coach` | Profe de tenis. Ve y gestiona solo sus propios datos. |
| `admin` | Diego. Super usuario que puede ver los datos de todos los coaches. |

Login con email o username via Supabase Auth.

---

## Entidades principales

### Usuario
- Nombre, email, username único
- Rol: `coach` | `admin`

### Alumno (pertenece a un coach)
- Nombre y apellido
- Fecha de ingreso
- Nivel: `principiante` | `intermedio` | `avanzado`
- Notas generales (campo libre, opcional) — ej: "tiene lesión en el hombro"
- Activo / inactivo (para archivar alumnos sin borrarlos)

### Grupo (pertenece a un coach)
- Nombre — ej: "Martes 18hs", "Principiantes"
- Descripción (opcional)
- Activo / inactivo
- Alumnos: relación many-to-many con Alumno (un alumno puede estar en varios grupos)

### Clase — plantilla reutilizable (pertenece a un coach)
- Título — ej: "Drive – Consistencia cruzada"
- Objetivo (texto libre, opcional)
- Técnica (opcional): `drive` | `reves` | `saque` | `volea` | `smash` | `globo` | `slice` | `drop` | `fisico` | `tactica` | `otro`
- Etapas (ordenadas):
  - Tipo: `calentamiento` | `drill` | `juego` | `fisico`
  - Descripción (texto libre)
  - Duración en minutos (opcional)
  - Orden

### Sesión — el evento real
- Fecha y hora (hora opcional)
- Estado: `pendiente` | `finalizada` | `cancelada`
- Grupo (el grupo que realiza la clase)
- Clase (la plantilla utilizada, opcional — se puede asignar después)
- Notas generales (opcional)
- Registros por alumno

### Registro de sesión por alumno
Vincula un alumno con una sesión específica. Contiene:
- Asistencia: `presente` | `ausente` | `justificado`
- Nota numérica: 1 a 10 (opcional)
- Comentarios: array cronológico (tabla separada) — el coach puede agregar varios durante o después de la clase

---

## Flujos principales

### Flujo 1 – Crear una clase (plantilla)
1. El coach crea una clase con título, objetivo, técnica (opcional) y etapas.
2. La clase queda guardada como plantilla reutilizable.

### Flujo 2 – Crear una sesión
1. El coach elige fecha, hora (opcional), grupo y clase (opcional).
2. El sistema precarga automáticamente todos los alumnos activos del grupo con asistencia "presente".
3. La sesión queda en estado "Pendiente".

### Flujo 3 – Registrar la sesión (durante o después de la clase)
1. El coach abre la sesión del día.
2. Ve el listado de alumnos del grupo, cada uno expandible con tap.
3. Para cada alumno marca asistencia (presente / ausente / justificado).
4. Para los que asistieron puede dejar nota numérica y/o comentarios.
5. Al terminar cambia el estado a "Finalizada". Si no se dictó, puede marcarla "Cancelada".
6. Puede agregar comentarios adicionales en cualquier momento.

### Flujo 4 – Ver ficha de un alumno
1. El coach entra al perfil de un alumno.
2. Ve su historial: todas las sesiones con asistencia, nota y comentarios.
3. (Futuro) Puede ver su evolución por técnica.

### Flujo 5 – Gestionar alumnos
1. Agregar alumno nuevo con nombre, nivel y grupo(s).
2. Editar datos de un alumno.
3. Archivar un alumno (queda en historial, no aparece en sesiones nuevas).

---

## Vistas necesarias

### 1. Sesiones (home)
- Vista semanal navegable ←/→ por semana.
- Sesiones agrupadas por día con badge de estado.
- Botón para crear sesión nueva.

### 2. Detalle de sesión
- Fecha, hora, grupo, clase (asignable/cambiable desde acá).
- Estado cambiable con tap (Pendiente / Finalizada / Cancelada).
- Lista de alumnos expandibles: asistencia, nota 1-10, comentarios cronológicos.
- Todo se guarda al instante.

### 3. Clases (plantillas)
- Listado de clases del coach con badge de técnica y duración total.
- Botón para crear clase nueva.

### 4. Detalle / editar clase
- Título, objetivo, técnica.
- Listado de etapas con tipo, descripción y duración.
- Etapas reordenables con ↑↓.

### 5. Alumnos
- Listado de alumnos activos con badge de nivel.
- Filtro activos/todos.
- Botón para agregar alumno nuevo.

### 6. Ficha de alumno
- Datos del alumno (nombre, nivel, notas generales).
- Historial de sesiones: fecha, clase, asistencia, nota, comentarios. *(pendiente)*

### 7. Grupos
- Listado de grupos activos y archivados.
- Detalle: nombre, alumnos que lo integran, editar, archivar/reactivar.

---

## Lo que NO entra en la versión 1

- Acceso de alumnos a su propio historial.
- Estadísticas avanzadas o gráficos de progresión.
- Notificaciones o recordatorios de clase.
- Exportar reportes en PDF.
- App nativa (móvil). Con una web responsive bien hecha alcanza.
- Gestión de pagos o reservas.

---

## Stack técnico

- **Framework:** Next.js (App Router) + TypeScript
- **Base de datos:** Supabase (PostgreSQL) — proyecto `vrdcjhdjctvkhadjqiao`
- **Autenticación:** Supabase Auth (email + password), login por username
- **Estilos:** Tailwind CSS + CSS variables para theming
- **Deploy:** Vercel

---

## Consideraciones de UX

- **Mobile first.** El coach registra desde el celular, en la cancha o justo después de la clase.
- **Rapidez sobre completitud.** Registrar asistencia y dejar una nota en menos de 2 minutos.
- **Sin fricción en el registro.** Los alumnos del grupo ya están precargados en cada sesión.
- **Guardado instantáneo.** Sin botón "Guardar" general — cada cambio se persiste al instante.
- **Dos temas visuales:** Polvo de ladrillo (arcilla) y Cancha azul (hard court). Ver `tennis-design.md`.
