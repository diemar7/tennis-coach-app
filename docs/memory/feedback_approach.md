---
name: Forma de trabajar en tennis-coach
description: Preferencias y decisiones de approach confirmadas por Diego
type: feedback
---

Avanzar de a funcionalidades completas y probadas antes de seguir a la siguiente. No codear en masa.

**Why:** Diego quiere poder probar en el celular (y en Vercel) antes de seguir. Funciona bien así.

**How to apply:** Terminar cada feature (lista + crear + detalle), hacer push, esperar confirmación de que funciona, recién ahí seguir.

---

Stack simple sobre arquitectura compleja. Se descartó separar backend Java + frontend Node.

**Why:** La app es un CRUD con auth. Java no aporta nada real acá y agrega complejidad innecesaria. Diego estuvo de acuerdo tras el debate.

**How to apply:** Si en el futuro surge la tentación de agregar capas, recordar que el valor está en la simplicidad.

---

Tabla separada sobre JSONB para los comentarios de registro.

**Why:** Diego eligió tabla separada pensando en escalabilidad futura (edición individual, notificaciones).

**How to apply:** `comentarios_registro` es una tabla propia, no un campo JSONB en `registros_alumno`.
