# Tennis Coach App – Guía de Estilos

## Concepto visual

La app tiene identidad propia vinculada al tenis. La paleta se inspira en los materiales y superficies del deporte:
- **Polvo de ladrillo** — tierra rojiza cálida, típica de canchas de arcilla
- **Cancha azul** — azul profundo, típico de canchas duras (US Open, Australian Open)
- **Amarillo flúor** — color universal de la pelota de tenis, usado como color de acción principal en ambos estilos

Se proponen **dos temas visuales**. La elección final queda a criterio, pero ambos comparten la misma estructura, componentes y lógica — solo cambia la paleta.

---

## Color de acción: amarillo flúor

Compartido por ambos temas. Se usa en:
- Botón principal (CTA)
- Elementos de confirmación o éxito

| Token | Valor | Uso |
|---|---|---|
| `--color-action` | `#ccff00` | Fondo del botón principal |
| `--color-action-text` | `#3a4a00` | Texto sobre el botón principal |

---

## Tema 1 – Polvo de ladrillo

Inspirado en canchas de arcilla. Tonos cálidos, tierra, ocre y verde cancha.

### Paleta

| Token | Valor | Uso |
|---|---|---|
| `--color-bg-app` | `#faf6f0` | Fondo general de la app |
| `--color-bg-card` | `#fff9f4` | Fondo de cards y etapas |
| `--color-bg-surface` | `#f5ede0` | Superficies secundarias, tags neutros |
| `--color-primary` | `#b85c2e` | Status bar, header principal |
| `--color-accent` | `#2d6a4f` | Links, botones secundarios (verde cancha) |
| `--color-text-primary` | `#2c1a0e` | Texto principal |
| `--color-text-secondary` | `#6b4a30` | Texto secundario, descripciones |
| `--color-text-muted` | `#a07050` | Labels, hints, placeholders |
| `--color-border` | `#e0c9b0` | Bordes de cards y divisores |
| `--color-border-input` | `#d4b896` | Bordes de inputs |

### Badges de tipo de etapa

| Tipo | Fondo | Texto |
|---|---|---|
| Calentamiento | `#f5d9c0` | `#7a3a10` |
| Drill | `#c8e6d4` | `#1a4d30` |
| Juego | `#f5d9c0` | `#7a3a10` |
| Físico | `#e8c9a0` | `#6b3a10` |

---

## Tema 2 – Cancha azul

Inspirado en canchas duras. Azules fríos y profundos, superficies limpias.

### Paleta

| Token | Valor | Uso |
|---|---|---|
| `--color-bg-app` | `#f4f8ff` | Fondo general de la app |
| `--color-bg-card` | `#ffffff` | Fondo de cards y etapas |
| `--color-bg-surface` | `#e8f0fc` | Superficies secundarias, tags neutros |
| `--color-primary` | `#1a3f6f` | Status bar, header principal, botón secundario |
| `--color-accent` | `#1a3f6f` | Links y navegación |
| `--color-text-primary` | `#0d1f3c` | Texto principal |
| `--color-text-secondary` | `#3a5a8a` | Texto secundario, descripciones |
| `--color-text-muted` | `#5a7aaa` | Labels, hints, placeholders |
| `--color-border` | `#c0d4ee` | Bordes de cards y divisores |
| `--color-border-input` | `#b0c8e8` | Bordes de inputs |

### Badges de tipo de etapa

| Tipo | Fondo | Texto |
|---|---|---|
| Calentamiento | `#ffe4cc` | `#7a3a10` |
| Drill | `#d0e8ff` | `#0d3060` |
| Juego | `#e0d0f8` | `#3a1a70` |
| Físico | `#d0f0e8` | `#0a3a2a` |

---

## Componentes compartidos

### Botón principal
```css
background-color: #ccff00;
color: #3a4a00;
border: none;
border-radius: 8px;
padding: 13px;
font-size: 15px;
font-weight: 500;
width: 100%;
```

### Tags de alumnos — activo vs inactivo
Los tags muestran si el alumno está asignado a esa clase. El inactivo es neutro (surface color del tema), el activo tiene borde más marcado del mismo tono del tema.

### Etapas de clase
Cada etapa es una card con:
- Badge de tipo (color según tabla de cada tema)
- Duración opcional en minutos
- Ícono de reordenamiento (drag handle)
- Descripción en texto libre

Las etapas se pueden agregar libremente y reordenar. No hay estructura fija.

### Bordes y radios
- Cards: `border-radius: 8px`, borde `0.5px`
- Inputs: `border-radius: 7px`, borde `0.5px`
- Badges: `border-radius: 20px` (pill)
- Teléfono/contenedor: `border-radius: 28px`

---

## Tipografía

- Fuente del sistema: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Labels de sección: `11px`, `font-weight: 500`, uppercase, `letter-spacing: 0.05em`
- Texto de cards: `13px`, `line-height: 1.4`
- Títulos de pantalla: `16px`, `font-weight: 500`
- Botón principal: `15px`, `font-weight: 500`

---

## Notas para el desarrollo

- **Mobile first** — toda la UI está pensada para celular. Ancho de referencia del mock: 320px.
- El amarillo flúor `#ccff00` es el único color de alta saturación en la app — úsarlo con criterio, solo en el CTA principal.
- Ambos temas deben poder activarse con un simple cambio de variables CSS (theming por tokens).
- Se puede ofrecer selección de tema en los ajustes de la app, o definir uno como default.
