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
]

export function getTipDelDia(): Tip {
  const idx = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % TIPS.length
  return TIPS[idx]
}
