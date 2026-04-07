'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Alumno, NivelAlumno, TecnicaTipo, AsistenciaTipo, SesionEstado } from '@/lib/types'

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

const TECNICA_LABEL: Record<TecnicaTipo, string> = {
  drive: 'Drive', reves: 'Revés', saque: 'Saque', volea: 'Volea',
  smash: 'Smash', globo: 'Globo', slice: 'Slice', drop: 'Drop',
  fisico: 'Físico', tactica: 'Táctica', otro: 'Otro',
}

const ASISTENCIA_LABEL: Record<AsistenciaTipo, string> = {
  presente: 'Presente', ausente: 'Ausente', justificado: 'Justificado',
}

const ASISTENCIA_STYLE: Record<AsistenciaTipo, { bg: string; color: string }> = {
  presente:    { bg: '#e8f5e9', color: '#2e7d32' },
  ausente:     { bg: '#fce4ec', color: '#c62828' },
  justificado: { bg: '#fff8e1', color: '#f57f17' },
}

const ESTADO_LABEL: Record<SesionEstado, string> = {
  pendiente: 'Pendiente', finalizada: 'Finalizada', cancelada: 'Cancelada',
}

interface RegistroHistorial {
  id: string
  asistencia: AsistenciaTipo
  nota: number | null
  sesion: {
    id: string
    fecha: string
    hora: string | null
    estado: SesionEstado
    grupo: { nombre: string }
    clase: { titulo: string; tecnica: TecnicaTipo | null } | null
  }
  comentarios: { id: string; texto: string; created_at: string }[]
}

export default function FichaAlumnoPage() {
  const router = useRouter()
  const params = useParams()
  const [alumno, setAlumno] = useState<Alumno | null>(null)
  const [historial, setHistorial] = useState<RegistroHistorial[]>([])
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [editando, setEditando] = useState(false)
  const [filtroTecnica, setFiltroTecnica] = useState<TecnicaTipo | ''>('')
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set())

  // Campos editables
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [nivel, setNivel] = useState<NivelAlumno>('principiante')
  const [notas, setNotas] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()

      const [{ data: alumnoData }, { data: registrosData }] = await Promise.all([
        supabase.from('alumnos').select('*').eq('id', params.id).single(),
        supabase
          .from('registros_alumno')
          .select(`
            id, asistencia, nota,
            sesion:sesiones(id, fecha, hora, estado, grupo:grupos(nombre), clase:clases(titulo, tecnica)),
            comentarios:comentarios_registro(id, texto, created_at)
          `)
          .eq('alumno_id', params.id)
          .order('created_at', { ascending: false }),
      ])

      if (alumnoData) {
        setAlumno(alumnoData)
        setNombre(alumnoData.nombre)
        setApellido(alumnoData.apellido)
        setNivel(alumnoData.nivel)
        setNotas(alumnoData.notas_generales ?? '')
      }

      if (registrosData) {
        // Ordenar por fecha de sesión descendente
        const ordenados = (registrosData as unknown as RegistroHistorial[]).sort((a, b) => {
          return new Date(b.sesion.fecha).getTime() - new Date(a.sesion.fecha).getTime()
        })
        setHistorial(ordenados)
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

  function toggleExpandido(id: string) {
    setExpandidos(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const historialFiltrado = filtroTecnica
    ? historial.filter(r => r.sesion.clase?.tecnica === filtroTecnica)
    : historial

  const notasConValor = historialFiltrado.filter(r => r.nota !== null && r.asistencia === 'presente')
  const promedio = notasConValor.length > 0
    ? notasConValor.reduce((acc, r) => acc + r.nota!, 0) / notasConValor.length
    : null

  // Técnicas que aparecen en el historial del alumno
  const tecnicasUsadas = Array.from(
    new Set(historial.map(r => r.sesion.clase?.tecnica).filter(Boolean) as TecnicaTipo[])
  )

  // Promedio por técnica (solo cuando no hay filtro activo)
  const promediosPorTecnica: { tecnica: TecnicaTipo; promedio: number; cantidad: number }[] = tecnicasUsadas
    .map(tecnica => {
      const regs = historial.filter(r =>
        r.sesion.clase?.tecnica === tecnica && r.nota !== null && r.asistencia === 'presente'
      )
      if (regs.length === 0) return null
      const prom = regs.reduce((acc, r) => acc + r.nota!, 0) / regs.length
      return { tecnica, promedio: prom, cantidad: regs.length }
    })
    .filter(Boolean) as { tecnica: TecnicaTipo; promedio: number; cantidad: number }[]

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
        <div className="flex flex-col gap-4">
          {/* Datos del alumno */}
          <div className="card flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="label-section">Nivel</span>
              <span className="badge" style={{ backgroundColor: NIVEL_STYLE[alumno.nivel].bg, color: NIVEL_STYLE[alumno.nivel].color }}>
                {NIVEL_LABEL[alumno.nivel]}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="label-section">Estado</span>
              <span className="badge" style={{
                backgroundColor: alumno.activo ? '#e8f5e9' : 'var(--color-bg-surface)',
                color: alumno.activo ? '#2e7d32' : 'var(--color-text-muted)',
              }}>
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

          {/* Historial */}
          <div>
            <p className="label-section mb-3">Historial de sesiones</p>

            {/* Promedio destacado */}
            {promedio !== null && (
              <div className="card mb-3" style={{ textAlign: 'center', padding: '16px' }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1 }}>
                  {promedio.toFixed(1)}
                  <span style={{ fontSize: 18, fontWeight: 400, color: 'var(--color-text-muted)' }}> / 10</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                  promedio de notas
                  {filtroTecnica ? ` en ${TECNICA_LABEL[filtroTecnica].toLowerCase()}` : ''}
                  {' '}· {notasConValor.length} {notasConValor.length === 1 ? 'sesión' : 'sesiones'}
                </div>

                {/* Chips por técnica — solo cuando no hay filtro */}
                {!filtroTecnica && promediosPorTecnica.length > 1 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 12, paddingTop: 10, borderTop: '0.5px solid var(--color-border)' }}>
                    {promediosPorTecnica.map(({ tecnica, promedio: prom }) => (
                      <button
                        key={tecnica}
                        onClick={() => setFiltroTecnica(tecnica)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          backgroundColor: 'var(--color-bg-surface)',
                          border: '0.5px solid var(--color-border)',
                          borderRadius: 20, padding: '4px 10px',
                          fontSize: 12, cursor: 'pointer',
                        }}
                      >
                        <span style={{ color: 'var(--color-text-secondary)' }}>{TECNICA_LABEL[tecnica]}</span>
                        <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{prom.toFixed(1)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Filtro técnica */}
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

            {/* Lista de sesiones */}
            {historialFiltrado.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                {filtroTecnica ? 'No hay sesiones con esa técnica.' : 'Todavía no hay sesiones registradas.'}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {historialFiltrado.map(registro => {
                  const s = registro.sesion
                  const fecha = new Date(s.fecha + 'T12:00:00').toLocaleDateString('es-UY', {
                    weekday: 'short', day: 'numeric', month: 'short',
                  })
                  const expandido = expandidos.has(registro.id)

                  return (
                    <div key={registro.id} className="card" style={{ padding: '12px' }}>
                      <button
                        className="w-full text-left"
                        onClick={() => toggleExpandido(registro.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col gap-1" style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', textTransform: 'capitalize' }}>
                              {fecha}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                              {s.grupo.nombre}
                              {s.clase && ` · ${s.clase.titulo}`}
                            </div>
                            {s.clase?.tecnica && (
                              <span className="badge-tecnica" style={{ alignSelf: 'flex-start', marginTop: 2 }}>
                                {TECNICA_LABEL[s.clase.tecnica]}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="badge" style={{
                              backgroundColor: ASISTENCIA_STYLE[registro.asistencia].bg,
                              color: ASISTENCIA_STYLE[registro.asistencia].color,
                              fontSize: 11,
                            }}>
                              {ASISTENCIA_LABEL[registro.asistencia]}
                            </span>
                            {registro.nota !== null && (
                              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>
                                {registro.nota}/10
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Chevron */}
                        <div style={{ textAlign: 'center', marginTop: 4, color: 'var(--color-text-muted)' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            style={{ display: 'inline', transform: expandido ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </button>

                      {/* Comentarios expandidos */}
                      {expandido && (
                        <div style={{ marginTop: 10, borderTop: '0.5px solid var(--color-border)', paddingTop: 10 }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="label-section">Estado sesión</span>
                            <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                              {ESTADO_LABEL[s.estado]}
                            </span>
                          </div>

                          {registro.comentarios.length > 0 ? (
                            <div className="flex flex-col gap-2">
                              <span className="label-section">Comentarios</span>
                              {registro.comentarios
                                .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                                .map(c => (
                                  <p key={c.id} style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                                    — {c.texto}
                                  </p>
                                ))}
                            </div>
                          ) : (
                            <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Sin comentarios.</p>
                          )}

                          <button
                            onClick={() => router.push(`/sesiones/${s.id}`)}
                            style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 500, marginTop: 8 }}
                          >
                            Ver sesión completa →
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
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
