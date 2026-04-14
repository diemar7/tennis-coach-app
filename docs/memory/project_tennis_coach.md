---
name: Tennis Coach App — estado del proyecto
description: Estado actual, stack, usuarios y próximos pasos de la app tennis-coach
type: project
---

App web para coaches de tenis. Directorio: `/Users/user/Documents/dfleitas/tennis-coach-app`.

Stack: Next.js + Supabase + Tailwind + Vercel. Repo: https://github.com/diemar7/tennis-coach-app. URL prod: https://tennis-coach-app-seven.vercel.app

Supabase proyecto: `vrdcjhdjctvkhadjqiao`, org Baseline (`spgyrvqpaewcjyoqdmap`) — cuenta nueva separada de tias-locas.

**Why:** Cuenta separada porque la org anterior (Tias Locas) tenía 2 proyectos y el free tier solo permite 2 activos.

**Usuarios creados:**
- Diego: `diemar7@gmail.com`, username `diemar7`, rol `admin`, pass `Nano14`
- Vane: `profetenisvanessa@gmail.com`, username `vane`, rol `coach`, pass `Vane123` — creada el 2026-04-03
- Sofía (amiga y colega de Vane): `s.aishemberg@gmail.com`, username `sofi`, rol `coach`, pass `Sofi123` — creada el 2026-04-05
- Andy Tapia (profe de tenis del hijo de Diego): `andytapiaok07@gmail.com`, username `andy`, rol `coach`, pass `Andy123` — creado el 2026-04-07

**Lo implementado:**
- Login con username o email
- Layout autenticado con bottom nav
- Alumnos (lista, crear, ficha, editar, archivar)
- Grupos (lista, crear con alumnos, detalle, editar, archivar)
- Clases (lista con duración total + badge de técnica, crear con etapas, detalle, editar, reordenar etapas ↑↓)
  - Campo `tecnica` en clases: enum de 11 valores (drive, reves, saque, volea, smash, globo, slice, drop, fisico, tactica, otro), opcional
- Sesiones (lista semanal navegable, crear, detalle con asistencia/nota/comentarios por alumno)
  - Estado: pendiente | finalizada | cancelada
  - Hora opcional
  - Clase opcional, asignable/cambiable desde el detalle
  - Registros de alumnos creados automáticamente al crear la sesión

**También implementado:**
- Perfil de usuario: editar nombre/username, cambiar contraseña, cerrar sesión — accesible desde ícono en header
- Logo (`logo.png`) como favicon y en pantalla de login

**También implementado (2026-04-07):**
- Chips de promedio por técnica en ficha de alumno (clicables, activan el filtro)
- Usuario Andy Tapia creado: `andytapiaok07@gmail.com`, username `andy`, rol `coach`, pass `Andy123`
- Home con tip del día: ruta `/home`, tab Inicio en nav, login redirige a `/home`
- `lib/tips.ts` con array de tips y `getTipDelDia()` rotativo por fecha
- `docs/tips-bank.md` con 22 tips (003 usado, 19 libres) — último tip agregado: 003 (2026-04-09)
- `docs/tips-history.md` como registro anti-repetición
- Skill `/add-tip` para agregar el próximo tip a demanda
- **Tips anteriores en /home (2026-04-08):** sección colapsable al final de `/home` con todos los tips publicados excepto el de hoy. `getTipsAnteriores()` en `lib/tips.ts`.
- **Fix lógica tip del día (2026-04-09):** último del array = tip del día, resto = historial. Sin rotación por fecha.
- **Distinción niños/adultos:** campo `es_nino` en alumnos, niveles propios (Presco/Escuela/Entrenamiento), badge azul `Niño` en lista y ficha, badge `Niños` automático en grupos si todos son niños
- **Eliminar sesión:** botón en detalle de sesión con bottom sheet modal de confirmación
- **Compartir clases:** tablas coach_colega + clase_compartida. Selector de colegas al crear/editar clase. Badge violeta en lista. Dueño ve con quién compartió, colega ve quién compartió. Ambas editan la misma clase.

**También implementado (2026-04-05):**
- Ficha de alumno: historial de sesiones con asistencia, nota, comentarios expandibles, filtro por técnica y promedio de notas destacado
- Ficha de grupo: historial de sesiones con filtro por técnica y contador de sesiones
- Sincronización automática de alumnos en sesiones pendientes (al abrir la sesión compara con el grupo actual)
- Edición de fecha y hora en el detalle de sesión
- RLS: admin tiene acceso completo de escritura en todas las tablas (migración `admin_full_write_access`)

**También implementado (2026-04-09):**
- **Desarrollo Profesional:** sección en `/home` con mini cursos. Curso 01 "Más herramientas, mejores clases" — 5 capítulos expandibles, marcar como leído, quiz final con nota guardada. Progreso individual por coach. Tablas: `progreso_curso` + `capitulo_leido`. Fuente del contenido: `docs/courses/`.

**También implementado (2026-04-10):**
- **Tip 004** agregado: "El ambiente entrena tanto como vos" (Metodología — Dinámica Ecológica). 4 tips en la app, 18 libres.
- **Ver etapas en detalle de sesión:** botón "Ver clase" colapsable debajo del nombre de la clase asignada. Muestra etapas con badge de tipo, descripción y duración. Se actualiza al cambiar la clase.
- **Curso 02** — "Enseñar jugando": 6 capítulos + quiz de 7 preguntas. GBL, interferencia contextual, diseño de situaciones por nivel, rol del coach, 3 clases modelo. Fuente: `docs/courses/02-ensenar-jugando.md`.
- **Buscador en Alumnos y Grupos:** filtrado en tiempo real en el cliente (sin llamadas extra a Supabase). Alumnos: por nombre/apellido + respeta filtro activos/todos. Grupos: por nombre + respeta separación activos/archivados.

**También implementado (2026-04-14):**
- **Repetir semana:** botón en lista de sesiones que copia todas las sesiones de la semana visible a la siguiente (mismo grupo/hora, estado pendiente, sin clase). Con confirmación via bottom sheet. Genera registros de alumnos automáticamente.
- **Fix repetir semana:** incluir `coach_id` en el insert — faltaba y causaba fallo silencioso.
- **Fix sesiones por coach propio:** la lista de sesiones ahora filtra siempre por `coach_id = user.id`, sin excepción para admin. Decisión: el admin usa SQL directo si necesita ver datos de otro coach.

**Próximo paso:** Curso 03 — "Biomecánica en el tenis".

**How to apply:** Al retomar, leer CLAUDE.md del proyecto para contexto completo.
