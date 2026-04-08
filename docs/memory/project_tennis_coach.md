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
- `docs/tips-bank.md` con 22 tips listos (002 usado, 20 libres) — último tip agregado: 002 (2026-04-08)
- `docs/tips-history.md` como registro anti-repetición
- Skill `/add-tip` para agregar el próximo tip a demanda
- **Tips anteriores en /home (2026-04-08):** sección colapsable al final de `/home` con todos los tips publicados excepto el de hoy. `getTipsAnteriores()` en `lib/tips.ts`.
- **Distinción niños/adultos:** campo `es_nino` en alumnos, niveles propios (Presco/Escuela/Entrenamiento), badge azul `Niño` en lista y ficha, badge `Niños` automático en grupos si todos son niños
- **Eliminar sesión:** botón en detalle de sesión con bottom sheet modal de confirmación
- **Compartir clases:** tablas coach_colega + clase_compartida. Selector de colegas al crear/editar clase. Badge violeta en lista. Dueño ve con quién compartió, colega ve quién compartió. Ambas editan la misma clase.

**También implementado (2026-04-05):**
- Ficha de alumno: historial de sesiones con asistencia, nota, comentarios expandibles, filtro por técnica y promedio de notas destacado
- Ficha de grupo: historial de sesiones con filtro por técnica y contador de sesiones
- Sincronización automática de alumnos en sesiones pendientes (al abrir la sesión compara con el grupo actual)
- Edición de fecha y hora en el detalle de sesión
- RLS: admin tiene acceso completo de escritura en todas las tablas (migración `admin_full_write_access`)

**Próximo paso:** por definir — v1 completa.

**How to apply:** Al retomar, leer CLAUDE.md del proyecto para contexto completo.
