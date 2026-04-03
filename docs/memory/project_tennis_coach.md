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
- Vane (la profe): `profetenisvanessa@gmail.com`, username `vane`, rol `coach`, pass `Vane123` — creada el 2026-04-03

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

**Próximo paso:** Historial de sesiones en ficha de alumno.

**How to apply:** Al retomar, leer CLAUDE.md del proyecto para contexto completo.
