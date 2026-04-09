'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getTipDelDia, getTipsAnteriores, type Tip } from '@/lib/tips'
import { CURSOS } from '@/lib/cursos'
import { createClient } from '@/lib/supabase'

const CATEGORIA_STYLE: Record<string, { bg: string; color: string }> = {
  'Metodología': { bg: '#e8e0f0', color: '#4a2a80' },
  'Táctica':     { bg: '#c8e6d4', color: '#1a4d30' },
  'Técnica':     { bg: '#f5d9c0', color: '#7a3a10' },
  'Mental':      { bg: '#fde8c0', color: '#7a4a10' },
  'Físico':      { bg: '#d0f0e8', color: '#0a3a2a' },
}

function getEstilo(categoria: string) {
  return CATEGORIA_STYLE[categoria] ?? { bg: '#e8e8e8', color: '#333' }
}

function TipAnteriorCard({ tip }: { tip: Tip }) {
  const [abierto, setAbierto] = useState(false)
  const estilo = getEstilo(tip.categoria)

  return (
    <div
      className="card"
      style={{ borderLeft: `3px solid ${estilo.color}`, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', gap: 12 }}
        onClick={() => setAbierto(v => !v)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span
            style={{
              display: 'inline-block',
              alignSelf: 'flex-start',
              backgroundColor: estilo.bg,
              color: estilo.color,
              fontSize: 10,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 20,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {tip.categoria}
          </span>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
            {tip.titulo}
          </span>
        </div>
        <span style={{ fontSize: 18, color: 'var(--color-text-muted)', flexShrink: 0 }}>
          {abierto ? '▲' : '▼'}
        </span>
      </div>

      {abierto && (
        <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--color-text-secondary)', margin: 0 }}>
          {tip.cuerpo}
        </p>
      )}
    </div>
  )
}

type ProgresoCurso = {
  curso_id: string
  nota: number | null
  fecha_completado: string | null
}

type CapituloLeido = {
  curso_id: string
  capitulo_idx: number
}

export default function HomePage() {
  const router = useRouter()
  const tip = getTipDelDia()
  const anteriores = getTipsAnteriores()
  const estilo = getEstilo(tip.categoria)

  const [progresos, setProgresos] = useState<ProgresoCurso[]>([])
  const [capitulosLeidos, setCapitulosLeidos] = useState<CapituloLeido[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const uid = session.user.id

      const [{ data: progs }, { data: caps }] = await Promise.all([
        supabase.from('progreso_curso').select('curso_id, nota, fecha_completado').eq('coach_id', uid),
        supabase.from('capitulo_leido').select('curso_id, capitulo_idx').eq('coach_id', uid),
      ])

      setProgresos(progs ?? [])
      setCapitulosLeidos(caps ?? [])
    })
  }, [])

  return (
    <div className="px-4 pt-6 pb-4 flex flex-col gap-6">

      {/* Encabezado */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)' }}>
          Hola, profe 👋
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginTop: 4 }}>
          Tu tip de coaching de hoy
        </p>
      </div>

      {/* Card del tip */}
      <div
        className="card"
        style={{
          borderLeft: `4px solid ${estilo.color}`,
          padding: '20px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {/* Badge categoría */}
        <span
          style={{
            display: 'inline-block',
            alignSelf: 'flex-start',
            backgroundColor: estilo.bg,
            color: estilo.color,
            fontSize: 11,
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 20,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {tip.categoria}
        </span>

        {/* Título */}
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {tip.titulo}
        </h2>

        {/* Separador */}
        <div style={{ height: 1, backgroundColor: 'var(--color-border)' }} />

        {/* Cuerpo */}
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}
        >
          {tip.cuerpo}
        </p>
      </div>

      {/* Pie */}
      <p
        style={{
          fontSize: 12,
          color: 'var(--color-text-muted)',
          textAlign: 'center',
        }}
      >
        Nuevo tip cada día · Basado en metodología moderna
      </p>

      {/* Desarrollo Profesional */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
          Desarrollo Profesional
        </h2>
        {CURSOS.map(curso => {
          const prog = progresos.find(p => p.curso_id === curso.id)
          const caps = capitulosLeidos.filter(c => c.curso_id === curso.id)
          const totalCaps = curso.capitulos.length
          const leidos = caps.length
          const completado = !!prog?.fecha_completado

          return (
            <button
              key={curso.id}
              className="card"
              onClick={() => router.push(`/home/cursos/${curso.id}`)}
              style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', width: '100%', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#e8e0f0',
                    color: '#4a2a80',
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 20,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    marginBottom: 6,
                  }}>
                    {curso.categoria}
                  </span>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.3 }}>
                    {curso.titulo}
                  </p>
                </div>
                {completado && prog?.nota !== null && (
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', flexShrink: 0, marginTop: 2 }}>
                    {prog.nota}/10
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {Array.from({ length: totalCaps }).map((_, i) => (
                    <div key={i} style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: i < leidos ? 'var(--color-primary)' : 'var(--color-border)',
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  {completado ? '✓ Completado' : leidos === 0 ? 'No iniciado' : `${leidos}/${totalCaps} capítulos`}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Tips anteriores */}
      {anteriores.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
            Tips anteriores
          </h2>
          {anteriores.map(t => (
            <TipAnteriorCard key={t.id} tip={t} />
          ))}
        </div>
      )}

    </div>
  )
}
