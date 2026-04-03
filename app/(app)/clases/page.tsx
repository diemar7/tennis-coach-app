'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Clase, Etapa, TecnicaTipo } from '@/lib/types'

type ClaseConEtapas = Clase & { etapas: Etapa[] }

const TIPO_LABEL: Record<string, string> = {
  calentamiento: 'Calentamiento',
  drill: 'Drill',
  juego: 'Juego',
  fisico: 'Físico',
}

const TECNICA_LABEL: Record<TecnicaTipo, string> = {
  drive: 'Drive', reves: 'Revés', saque: 'Saque', volea: 'Volea', smash: 'Smash',
  globo: 'Globo', slice: 'Slice', drop: 'Drop', fisico: 'Físico', tactica: 'Táctica', otro: 'Otro',
}

export default function ClasesPage() {
  const router = useRouter()
  const [clases, setClases] = useState<ClaseConEtapas[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('clases')
        .select('*, etapas(*)')
        .order('created_at', { ascending: false })
      setClases(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>Clases</h1>
        <button
          onClick={() => router.push('/clases/nueva')}
          className="btn-primary"
          style={{ width: 'auto', padding: '8px 16px', fontSize: 13 }}
        >
          + Nueva
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Cargando...</p>
      ) : clases.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>No hay clases todavía.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {clases.map(clase => {
            const etapas = (clase.etapas ?? []).sort((a, b) => a.orden - b.orden)
            const duracionTotal = etapas.reduce((sum, e) => sum + (e.duracion_minutos ?? 0), 0)
            return (
              <button
                key={clase.id}
                onClick={() => router.push(`/clases/${clase.id}`)}
                className="card text-left flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {clase.titulo}
                    </span>
                    {clase.tecnica && (
                      <span className="badge badge-tecnica" style={{ flexShrink: 0 }}>
                        {TECNICA_LABEL[clase.tecnica]}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {duracionTotal > 0 && (
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{duracionTotal} min</span>
                    )}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)' }}>
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </div>

                {clase.objetivo && (
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.4 }} className="line-clamp-2">
                    {clase.objetivo}
                  </p>
                )}

                {etapas.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {etapas.map(etapa => (
                      <span key={etapa.id} className={`badge badge-${etapa.tipo}`}>
                        {TIPO_LABEL[etapa.tipo]}
                        {etapa.duracion_minutos ? ` · ${etapa.duracion_minutos}min` : ''}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
