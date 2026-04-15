export type Tip = {
  id: number
  categoria: string
  titulo: string
  cuerpo: string
}

export const TIPS: Tip[] = [
  {
    id: 1,
    categoria: 'Metodología',
    titulo: 'Táctica antes que técnica',
    cuerpo:
      'Invertí el orden tradicional: primero enseñá qué hacer (dónde golpear, cuándo atacar, cómo posicionarse), y recién después perfeccioná el cómo ejecutarlo. Usá juegos pequeños y situaciones reales de partido para que el alumno descubra el "por qué" de cada movimiento antes de pulir la mecánica. Los jugadores entrenados así toman mejores decisiones bajo presión y retienen los conceptos técnicos más rápido, porque tienen contexto real donde aplicarlos.',
  },
  {
    id: 2,
    categoria: 'Metodología',
    titulo: 'Rompé la rutina del "mismo golpe 100 veces"',
    cuerpo:
      'La práctica bloqueada (repetir el mismo golpe en las mismas condiciones) da sensación de mejora rápida, pero los resultados en el partido son pobres. La práctica variable —mezclando tipos de golpes, direcciones y situaciones sin previo aviso— genera más errores al principio pero una retención mucho mayor. El cerebro aprende mejor cuando tiene que resolver pequeños problemas en cada pelota, no cuando está en piloto automático.',
  },
  {
    id: 3,
    categoria: 'Metodología',
    titulo: 'Jugá primero, corregí después',
    cuerpo:
      'Antes de cualquier corrección técnica, dejá que el alumno juegue el punto o el drill completo. Interrumpir el movimiento constantemente fragmenta el aprendizaje motor y genera dependencia del coach. La regla práctica: máximo una corrección por turno, elegida según lo que más limita al jugador en ese momento. Menos feedback, más calidad de aprendizaje.',
  },
  {
    id: 4,
    categoria: 'Metodología',
    titulo: 'El ambiente entrena tanto como vos',
    cuerpo:
      'El enfoque de Dinámica Ecológica plantea que el jugador aprende adaptándose a las restricciones del entorno: el espacio, la pelota, el oponente, la presión del marcador. En lugar de explicar cómo hacer un golpe, modificá el juego para que el golpe correcto sea la solución más natural. Por ejemplo, achicá la cancha para forzar el topspin, o jugá con puntaje real para que practiquen bajo presión real.',
  },
  {
    id: 5,
    categoria: 'Táctica',
    titulo: 'El patrón que más puntos te da en el fondo',
    cuerpo:
      'El patrón "2-1" es el más efectivo para jugadores de base: primer golpe profundo para empujar al rival atrás, segundo golpe cruzado para abrirle la cancha, tercer golpe al espacio creado para el punto. Enseñalo como una secuencia de intenciones, no de técnicas. Cuando el alumno entiende el "para qué" de cada pelota, empieza a tomar decisiones propias dentro del patrón.',
  },
  {
    id: 6,
    categoria: 'Táctica',
    titulo: 'Tres zonas, tres estrategias distintas',
    cuerpo:
      'Enseñá a tus alumnos que la cancha tiene tres zonas con lógicas diferentes. Zona defensiva (más de 2 metros atrás de la línea de base): pelota alta, con margen, tiempo para recuperar. Zona neutral (cerca de la línea de base): pelota profunda, mantener el intercambio. Zona de ataque (dentro de la línea): pelota baja sobre la red, finalizá el punto. Saber en qué zona estás cambia completamente la decisión de cada golpe.',
  },
]

export function getTipDelDia(): Tip {
  return TIPS[TIPS.length - 1]
}

export function getTipsAnteriores(): Tip[] {
  return TIPS.slice(0, TIPS.length - 1).reverse()
}
