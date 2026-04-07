'use client'

import { getTipDelDia } from '@/lib/tips'

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

export default function HomePage() {
  const tip = getTipDelDia()
  const estilo = getEstilo(tip.categoria)

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
    </div>
  )
}
