'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
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

export default function FichaAlumnoPage() {
  const router = useRouter()
  const params = useParams()
  const [alumno, setAlumno] = useState<Alumno | null>(null)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [editando, setEditando] = useState(false)

  // Campos editables
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [nivel, setNivel] = useState<NivelAlumno>('principiante')
  const [notas, setNotas] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('alumnos')
        .select('*')
        .eq('id', params.id)
        .single()

      if (data) {
        setAlumno(data)
        setNombre(data.nombre)
        setApellido(data.apellido)
        setNivel(data.nivel)
        setNotas(data.notas_generales ?? '')
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  async function handleGuardar() {
    if (!alumno) return
    setGuardando(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('alumnos')
      .update({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        nivel,
        notas_generales: notas.trim() || null,
      })
      .eq('id', alumno.id)
      .select()
      .single()

    if (data) setAlumno(data)
    setGuardando(false)
    setEditando(false)
  }

  async function handleArchivar() {
    if (!alumno) return
    const supabase = createClient()
    await supabase
      .from('alumnos')
      .update({ activo: !alumno.activo })
      .eq('id', alumno.id)
    setAlumno({ ...alumno, activo: !alumno.activo })
  }

  if (loading) {
    return (
      <div className="px-4 pt-6">
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Cargando...</p>
      </div>
    )
  }

  if (!alumno) {
    return (
      <div className="px-4 pt-6">
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Alumno no encontrado.</p>
      </div>
    )
  }

  const NIVELES: { value: NivelAlumno; label: string }[] = [
    { value: 'principiante', label: 'Principiante' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'avanzado', label: 'Avanzado' },
  ]

  return (
    <div className="px-4 pt-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-primary)' }}>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {alumno.nombre} {alumno.apellido}
          </h1>
        </div>
        <button
          onClick={() => setEditando(!editando)}
          style={{ fontSize: 13, color: 'var(--color-accent)', fontWeight: 500 }}
        >
          {editando ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      {!editando ? (
        /* Vista */
        <div className="flex flex-col gap-4">
          <div className="card flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="label-section">Nivel</span>
              <span
                className="badge"
                style={{
                  backgroundColor: NIVEL_STYLE[alumno.nivel].bg,
                  color: NIVEL_STYLE[alumno.nivel].color,
                }}
              >
                {NIVEL_LABEL[alumno.nivel]}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="label-section">Estado</span>
              <span
                className="badge"
                style={{
                  backgroundColor: alumno.activo ? '#e8f5e9' : 'var(--color-bg-surface)',
                  color: alumno.activo ? '#2e7d32' : 'var(--color-text-muted)',
                }}
              >
                {alumno.activo ? 'Activo' : 'Archivado'}
              </span>
            </div>

            {alumno.notas_generales && (
              <div className="flex flex-col gap-1">
                <span className="label-section">Notas</span>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  {alumno.notas_generales}
                </p>
              </div>
            )}
          </div>

          {/* Historial — placeholder hasta tener sesiones */}
          <div>
            <p className="label-section mb-2">Historial de sesiones</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
              Todavía no hay sesiones registradas.
            </p>
          </div>

          <button
            onClick={handleArchivar}
            style={{
              fontSize: 13,
              color: alumno.activo ? '#c0392b' : 'var(--color-accent)',
              fontWeight: 500,
              textAlign: 'left',
              marginTop: 8,
            }}
          >
            {alumno.activo ? 'Archivar alumno' : 'Reactivar alumno'}
          </button>
        </div>
      ) : (
        /* Edición */
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="label-section">Nombre</label>
            <input className="input" value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-section">Apellido</label>
            <input className="input" value={apellido} onChange={e => setApellido(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-section">Nivel</label>
            <div className="flex gap-2">
              {NIVELES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setNivel(value)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium"
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
            <label className="label-section">Notas generales <span style={{ color: 'var(--color-text-muted)', textTransform: 'none' }}>(opcional)</span></label>
            <textarea
              className="input"
              value={notas}
              onChange={e => setNotas(e.target.value)}
              rows={3}
              style={{ resize: 'none' }}
            />
          </div>

          <button onClick={handleGuardar} className="btn-primary mt-2" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      )}
    </div>
  )
}
