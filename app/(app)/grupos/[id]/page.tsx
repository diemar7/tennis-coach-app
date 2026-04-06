'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Grupo, Alumno, TecnicaTipo, SesionEstado } from '@/lib/types'

const TECNICA_LABEL: Record<TecnicaTipo, string> = {
  drive: 'Drive', reves: 'Revés', saque: 'Saque', volea: 'Volea',
  smash: 'Smash', globo: 'Globo', slice: 'Slice', drop: 'Drop',
  fisico: 'Físico', tactica: 'Táctica', otro: 'Otro',
}

const ESTADO_STYLE: Record<SesionEstado, { bg: string; color: string }> = {
  pendiente:  { bg: '#fff8e1', color: '#f57f17' },
  finalizada: { bg: '#e8f5e9', color: '#2e7d32' },
  cancelada:  { bg: '#fce4ec', color: '#c62828' },
}

interface SesionHistorial {
  id: string
  fecha: string
  hora: string | null
  estado: SesionEstado
  clase: { titulo: string; tecnica: TecnicaTipo | null } | null
}

export default function DetalleGrupoPage() {
  const router = useRouter()
  const params = useParams()
  const [grupo, setGrupo] = useState<Grupo | null>(null)
  const [miembros, setMiembros] = useState<Alumno[]>([])
  const [todosAlumnos, setTodosAlumnos] = useState<Alumno[]>([])
  const [sesiones, setSesiones] = useState<SesionHistorial[]>([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [filtroTecnica, setFiltroTecnica] = useState<TecnicaTipo | ''>('')

  // Campos editables
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function load() {
      const supabase = createClient()

      const [{ data: grupoData }, { data: miembrosData }, { data: alumnosData }, { data: sesionesData }] = await Promise.all([
        supabase.from('grupos').select('*').eq('id', params.id).single(),
        supabase.from('alumno_grupo').select('alumno_id').eq('grupo_id', params.id),
        supabase.from('alumnos').select('*').eq('activo', true).order('apellido'),
        supabase
          .from('sesiones')
          .select('id, fecha, hora, estado, clase:clases(titulo, tecnica)')
          .eq('grupo_id', params.id)
          .order('fecha', { ascending: false }),
      ])

      if (grupoData) {
        setGrupo(grupoData)
        setNombre(grupoData.nombre)
        setDescripcion(grupoData.descripcion ?? '')
      }

      const ids = new Set((miembrosData ?? []).map((m: { alumno_id: string }) => m.alumno_id))
      setSeleccionados(ids)

      const todos = alumnosData ?? []
      setTodosAlumnos(todos)
      setMiembros(todos.filter(a => ids.has(a.id)))

      setSesiones((sesionesData ?? []) as unknown as SesionHistorial[])
      setLoading(false)
    }
    load()
  }, [params.id])

  function toggleAlumno(id: string) {
    setSeleccionados(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handleGuardar() {
    if (!grupo) return
    setGuardando(true)
    const supabase = createClient()

    await supabase
      .from('grupos')
      .update({ nombre: nombre.trim(), descripcion: descripcion.trim() || null })
      .eq('id', grupo.id)

    await supabase.from('alumno_grupo').delete().eq('grupo_id', grupo.id)
    if (seleccionados.size > 0) {
      await supabase.from('alumno_grupo').insert(
        [...seleccionados].map(alumno_id => ({ alumno_id, grupo_id: grupo.id }))
      )
    }

    setGrupo({ ...grupo, nombre: nombre.trim(), descripcion: descripcion.trim() || null })
    setMiembros(todosAlumnos.filter(a => seleccionados.has(a.id)))
    setGuardando(false)
    setEditando(false)
  }

  async function handleArchivar() {
    if (!grupo) return
    const supabase = createClient()
    await supabase.from('grupos').update({ activo: !grupo.activo }).eq('id', grupo.id)
    setGrupo({ ...grupo, activo: !grupo.activo })
  }

  const sesionesFiltradas = filtroTecnica
    ? sesiones.filter(s => s.clase?.tecnica === filtroTecnica)
    : sesiones

  const tecnicasUsadas = Array.from(
    new Set(sesiones.map(s => s.clase?.tecnica).filter(Boolean) as TecnicaTipo[])
  )

  if (loading) return <div className="px-4 pt-6"><p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Cargando...</p></div>
  if (!grupo) return <div className="px-4 pt-6"><p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Grupo no encontrado.</p></div>

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-primary)' }}>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {grupo.nombre}
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
        <div className="flex flex-col gap-4">
          {grupo.descripcion && (
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{grupo.descripcion}</p>
          )}

          {/* Alumnos */}
          <div>
            <p className="label-section mb-2">Alumnos ({miembros.length})</p>
            {miembros.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Sin alumnos asignados.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {miembros.map(alumno => (
                  <button
                    key={alumno.id}
                    onClick={() => router.push(`/alumnos/${alumno.id}`)}
                    className="card flex items-center justify-between"
                  >
                    <span style={{ fontSize: 14, color: 'var(--color-text-primary)' }}>
                      {alumno.nombre} {alumno.apellido}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}>
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Historial de sesiones */}
          <div>
            <p className="label-section mb-3">Historial de sesiones</p>

            {tecnicasUsadas.length > 0 && (
              <div className="mb-3">
                <select
                  className="input"
                  value={filtroTecnica}
                  onChange={e => setFiltroTecnica(e.target.value as TecnicaTipo | '')}
                  style={{ fontSize: 13 }}
                >
                  <option value="">Todas las técnicas</option>
                  {tecnicasUsadas.map(t => (
                    <option key={t} value={t}>{TECNICA_LABEL[t]}</option>
                  ))}
                </select>
              </div>
            )}

            {filtroTecnica && (
              <div className="mb-3 card" style={{ padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1 }}>
                  {sesionesFiltradas.length}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                  {sesionesFiltradas.length === 1 ? 'sesión' : 'sesiones'} de {TECNICA_LABEL[filtroTecnica].toLowerCase()}
                </div>
              </div>
            )}

            {sesionesFiltradas.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                {filtroTecnica ? 'No hay sesiones con esa técnica.' : 'Todavía no hay sesiones registradas.'}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {sesionesFiltradas.map(s => {
                  const fecha = new Date(s.fecha + 'T12:00:00').toLocaleDateString('es-UY', {
                    weekday: 'short', day: 'numeric', month: 'short',
                  })
                  return (
                    <button
                      key={s.id}
                      className="card text-left"
                      style={{ padding: '12px' }}
                      onClick={() => router.push(`/sesiones/${s.id}`)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col gap-1" style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', textTransform: 'capitalize' }}>
                            {fecha}
                          </div>
                          {s.clase && (
                            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                              {s.clase.titulo}
                            </div>
                          )}
                          {s.clase?.tecnica && (
                            <span className="badge-tecnica" style={{ alignSelf: 'flex-start', marginTop: 2 }}>
                              {TECNICA_LABEL[s.clase.tecnica]}
                            </span>
                          )}
                        </div>
                        <span className="badge" style={{
                          backgroundColor: ESTADO_STYLE[s.estado].bg,
                          color: ESTADO_STYLE[s.estado].color,
                          fontSize: 11,
                          flexShrink: 0,
                        }}>
                          {s.estado.charAt(0).toUpperCase() + s.estado.slice(1)}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <button
            onClick={handleArchivar}
            style={{ fontSize: 13, color: grupo.activo ? '#c0392b' : 'var(--color-accent)', fontWeight: 500, textAlign: 'left', marginTop: 8 }}
          >
            {grupo.activo ? 'Archivar grupo' : 'Reactivar grupo'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="label-section">Nombre</label>
            <input className="input" value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-section">Descripción <span style={{ color: 'var(--color-text-muted)', textTransform: 'none', fontSize: 11 }}>(opcional)</span></label>
            <input className="input" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="label-section">Alumnos</label>
            {todosAlumnos.map(alumno => {
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
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    border: `1.5px solid ${sel ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    backgroundColor: sel ? 'var(--color-primary)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
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

          <button onClick={handleGuardar} className="btn-primary mt-2" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      )}
    </div>
  )
}
