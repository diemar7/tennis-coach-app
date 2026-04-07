'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { NivelAlumno } from '@/lib/types'

const NIVELES_ADULTO: { value: NivelAlumno; label: string }[] = [
  { value: 'principiante', label: 'Principiante' },
  { value: 'intermedio', label: 'Intermedio' },
  { value: 'avanzado', label: 'Avanzado' },
]

const NIVELES_NINO: { value: NivelAlumno; label: string }[] = [
  { value: 'presco', label: 'Presco' },
  { value: 'escuela', label: 'Escuela' },
  { value: 'entrenamiento', label: 'Entrenamiento' },
]

export default function NuevoAlumnoPage() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [esNino, setEsNino] = useState(false)
  const [nivel, setNivel] = useState<NivelAlumno>('principiante')
  const [notas, setNotas] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleToggleNino(value: boolean) {
    setEsNino(value)
    setNivel(value ? 'presco' : 'principiante')
  }

  const niveles = esNino ? NIVELES_NINO : NIVELES_ADULTO

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.replace('/')
      return
    }

    const { error } = await supabase.from('alumnos').insert({
      coach_id: user.id,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      nivel,
      es_nino: esNino,
      notas_generales: notas.trim() || null,
    })

    if (error) {
      setError('Error al guardar el alumno. Intentá de nuevo.')
      setLoading(false)
      return
    }

    router.push('/alumnos')
  }

  return (
    <div className="px-4 pt-6 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-primary)' }}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>
          Nuevo alumno
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="label-section">Nombre</label>
          <input
            className="input"
            placeholder="Juan"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-section">Apellido</label>
          <input
            className="input"
            placeholder="Pérez"
            value={apellido}
            onChange={e => setApellido(e.target.value)}
            required
          />
        </div>

        {/* Toggle niño / adulto */}
        <div className="flex flex-col gap-1">
          <label className="label-section">Categoría</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleToggleNino(false)}
              className="flex-1 py-2 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: !esNino ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                color: !esNino ? '#fff' : 'var(--color-text-secondary)',
                border: '0.5px solid',
                borderColor: !esNino ? 'var(--color-primary)' : 'var(--color-border)',
              }}
            >
              Adulto
            </button>
            <button
              type="button"
              onClick={() => handleToggleNino(true)}
              className="flex-1 py-2 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: esNino ? '#4fc3f7' : 'var(--color-bg-surface)',
                color: esNino ? '#fff' : 'var(--color-text-secondary)',
                border: '0.5px solid',
                borderColor: esNino ? '#4fc3f7' : 'var(--color-border)',
              }}
            >
              Niño
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-section">Nivel</label>
          <div className="flex gap-2">
            {niveles.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setNivel(value)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: nivel === value ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                  color: nivel === value ? '#fff' : 'var(--color-text-secondary)',
                  border: '0.5px solid',
                  borderColor: nivel === value ? 'var(--color-primary)' : 'var(--color-border)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-section">Notas generales <span style={{ color: 'var(--color-text-muted)', textTransform: 'none', fontSize: 11 }}>(opcional)</span></label>
          <textarea
            className="input"
            placeholder="ej: tiene lesión en el hombro, viene los martes y jueves..."
            value={notas}
            onChange={e => setNotas(e.target.value)}
            rows={3}
            style={{ resize: 'none' }}
          />
        </div>

        {error && (
          <p className="text-sm text-center" style={{ color: '#c0392b' }}>{error}</p>
        )}

        <button type="submit" className="btn-primary mt-2" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar alumno'}
        </button>
      </form>
    </div>
  )
}
