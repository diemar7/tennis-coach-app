'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Alumno } from '@/lib/types'

export default function NuevoGrupoPage() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAlumnos() {
      const supabase = createClient()
      const { data } = await supabase
        .from('alumnos')
        .select('*')
        .eq('activo', true)
        .order('apellido', { ascending: true })
      setAlumnos(data ?? [])
    }
    loadAlumnos()
  }, [])

  function toggleAlumno(id: string) {
    setSeleccionados(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) { router.replace('/'); return }

    const { data: grupo, error: errGrupo } = await supabase
      .from('grupos')
      .insert({ coach_id: user.id, nombre: nombre.trim(), descripcion: descripcion.trim() || null })
      .select()
      .single()

    if (errGrupo || !grupo) {
      setError('Error al guardar el grupo. Intentá de nuevo.')
      setLoading(false)
      return
    }

    // Asignar alumnos seleccionados
    if (seleccionados.size > 0) {
      await supabase.from('alumno_grupo').insert(
        [...seleccionados].map(alumno_id => ({ alumno_id, grupo_id: grupo.id }))
      )
    }

    router.push('/grupos')
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-primary)' }}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>Nuevo grupo</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="label-section">Nombre</label>
          <input
            className="input"
            placeholder="ej: Martes 18hs"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-section">Descripción <span style={{ color: 'var(--color-text-muted)', textTransform: 'none', fontSize: 11 }}>(opcional)</span></label>
          <input
            className="input"
            placeholder="ej: Grupo de adultos intermedios"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
          />
        </div>

        {alumnos.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="label-section">Alumnos <span style={{ color: 'var(--color-text-muted)', textTransform: 'none', fontSize: 11 }}>(opcional)</span></label>
            <div className="flex flex-col gap-2">
              {alumnos.map(alumno => {
                const sel = seleccionados.has(alumno.id)
                return (
                  <button
                    key={alumno.id}
                    type="button"
                    onClick={() => toggleAlumno(alumno.id)}
                    className="card flex items-center justify-between"
                    style={{
                      borderColor: sel ? 'var(--color-primary)' : 'var(--color-border)',
                      backgroundColor: sel ? 'var(--color-bg-surface)' : 'var(--color-bg-card)',
                    }}
                  >
                    <span style={{ fontSize: 14, color: 'var(--color-text-primary)' }}>
                      {alumno.nombre} {alumno.apellido}
                    </span>
                    <div
                      style={{
                        width: 20, height: 20, borderRadius: '50%',
                        border: `1.5px solid ${sel ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        backgroundColor: sel ? 'var(--color-primary)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {sel && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {error && (
          <p className="text-sm text-center" style={{ color: '#c0392b' }}>{error}</p>
        )}

        <button type="submit" className="btn-primary mt-2" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar grupo'}
        </button>
      </form>
    </div>
  )
}
