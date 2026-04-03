'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Grupo, Clase } from '@/lib/types'

export default function NuevaSesionPage() {
  const router = useRouter()
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [clases, setClases] = useState<Clase[]>([])
  const [grupoId, setGrupoId] = useState('')
  const [claseId, setClaseId] = useState('')
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10))
  const [hora, setHora] = useState('')
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/'); return }

      const [{ data: gs }, { data: cs }] = await Promise.all([
        supabase.from('grupos').select('*').eq('coach_id', user.id).eq('activo', true).order('nombre'),
        supabase.from('clases').select('*').eq('coach_id', user.id).order('titulo'),
      ])
      setGrupos(gs ?? [])
      setClases(cs ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!grupoId) { setError('Elegí un grupo.'); return }
    setError(null)
    setGuardando(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/'); return }

    const { data: sesion, error: err } = await supabase
      .from('sesiones')
      .insert({
        coach_id: user.id,
        grupo_id: grupoId,
        clase_id: claseId || null,
        fecha,
        hora: hora || null,
        estado: 'pendiente',
      })
      .select()
      .single()

    if (err || !sesion) {
      setError('Error al crear la sesión. Intentá de nuevo.')
      setGuardando(false)
      return
    }

    // Crear registros para cada alumno del grupo
    const { data: alumnos } = await supabase
      .from('alumno_grupo')
      .select('alumno_id')
      .eq('grupo_id', grupoId)

    if (alumnos && alumnos.length > 0) {
      await supabase.from('registros_alumno').insert(
        alumnos.map((a) => ({
          sesion_id: sesion.id,
          alumno_id: a.alumno_id,
          asistencia: 'presente',
        }))
      )
    }

    router.push(`/sesiones/${sesion.id}`)
  }

  if (loading) return <div className="px-4 pt-6"><p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Cargando...</p></div>

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-primary)' }}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>Nueva sesión</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="label-section">Fecha</label>
            <input
              className="input"
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1" style={{ width: 110 }}>
            <label className="label-section">Hora <span style={{ color: 'var(--color-text-muted)', textTransform: 'none', fontSize: 11 }}>(opc.)</span></label>
            <input
              className="input"
              type="time"
              value={hora}
              onChange={e => setHora(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-section">Grupo</label>
          {grupos.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No tenés grupos activos.</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {grupos.map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGrupoId(g.id)}
                  className="card text-left"
                  style={{
                    borderColor: grupoId === g.id ? 'var(--color-accent)' : 'var(--color-border)',
                    backgroundColor: grupoId === g.id ? 'var(--color-bg-surface)' : 'var(--color-bg-card)',
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: grupoId === g.id ? 600 : 400, color: 'var(--color-text-primary)' }}>
                    {g.nombre}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="label-section">Clase <span style={{ color: 'var(--color-text-muted)', textTransform: 'none', fontSize: 11 }}>(opcional)</span></label>
            {claseId && (
              <button type="button" onClick={() => setClaseId('')} style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                Quitar
              </button>
            )}
          </div>
          {clases.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>No tenés clases creadas.</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {clases.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setClaseId(claseId === c.id ? '' : c.id)}
                  className="card text-left"
                  style={{
                    borderColor: claseId === c.id ? 'var(--color-accent)' : 'var(--color-border)',
                    backgroundColor: claseId === c.id ? 'var(--color-bg-surface)' : 'var(--color-bg-card)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 14, fontWeight: claseId === c.id ? 600 : 400, color: 'var(--color-text-primary)' }}>
                      {c.titulo}
                    </span>
                    {c.tecnica && (
                      <span className="badge badge-tecnica">{c.tecnica.charAt(0).toUpperCase() + c.tecnica.slice(1)}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p style={{ fontSize: 13, color: '#c0392b', textAlign: 'center' }}>{error}</p>
        )}

        <button type="submit" className="btn-primary mt-2" disabled={guardando || !grupoId}>
          {guardando ? 'Creando...' : 'Crear sesión'}
        </button>
      </form>
    </div>
  )
}
