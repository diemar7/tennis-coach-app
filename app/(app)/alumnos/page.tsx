'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Alumno, NivelAlumno } from '@/lib/types'

const NIVEL_LABEL: Record<NivelAlumno, string> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
}

const NIVEL_STYLE: Record<NivelAlumno, { bg: string; color: string }> = {
  principiante: { bg: '#e8f5e9', color: '#2e7d32' },
  intermedio:   { bg: '#fff8e1', color: '#f57f17' },
  avanzado:     { bg: '#fce4ec', color: '#c62828' },
}

export default function AlumnosPage() {
  const router = useRouter()
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [loading, setLoading] = useState(true)
  const [soloActivos, setSoloActivos] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('alumnos')
        .select('*')
        .order('apellido', { ascending: true })
      setAlumnos(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const filtrados = alumnos.filter(a => soloActivos ? a.activo : true)

  return (
    <div className="px-4 pt-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>
          Alumnos
        </h1>
        <button
          onClick={() => router.push('/alumnos/nuevo')}
          className="btn-primary"
          style={{ width: 'auto', padding: '8px 16px', fontSize: 13 }}
        >
          + Nuevo
        </button>
      </div>

      {/* Filtro activos/todos */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSoloActivos(true)}
          className="badge"
          style={{
            backgroundColor: soloActivos ? 'var(--color-primary)' : 'var(--color-bg-surface)',
            color: soloActivos ? '#fff' : 'var(--color-text-secondary)',
            padding: '5px 12px',
          }}
        >
          Activos
        </button>
        <button
          onClick={() => setSoloActivos(false)}
          className="badge"
          style={{
            backgroundColor: !soloActivos ? 'var(--color-primary)' : 'var(--color-bg-surface)',
            color: !soloActivos ? '#fff' : 'var(--color-text-secondary)',
            padding: '5px 12px',
          }}
        >
          Todos
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Cargando...</p>
      ) : filtrados.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>No hay alumnos todavía.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtrados.map(alumno => (
            <button
              key={alumno.id}
              onClick={() => router.push(`/alumnos/${alumno.id}`)}
              className="card text-left flex items-center justify-between"
              style={{ opacity: alumno.activo ? 1 : 0.5 }}
            >
              <div className="flex flex-col gap-1">
                <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                  {alumno.nombre} {alumno.apellido}
                </span>
                {alumno.notas_generales && (
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }} className="line-clamp-1">
                    {alumno.notas_generales}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 ml-3 shrink-0">
                <span
                  className="badge"
                  style={{
                    backgroundColor: NIVEL_STYLE[alumno.nivel].bg,
                    color: NIVEL_STYLE[alumno.nivel].color,
                  }}
                >
                  {NIVEL_LABEL[alumno.nivel]}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)' }}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
