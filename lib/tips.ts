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
]

export function getTipDelDia(): Tip {
  return TIPS[TIPS.length - 1]
}

export function getTipsAnteriores(): Tip[] {
  return TIPS.slice(0, TIPS.length - 1).reverse()
}
