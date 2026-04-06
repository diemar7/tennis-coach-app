'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Sesion, RegistroAlumno, ComentarioRegistro, AsistenciaTipo, SesionEstado, Clase } from '@/lib/types'

type RegistroConAlumno = RegistroAlumno & {
  alumno: { id: string; nombre: string; apellido: string }
  comentarios: ComentarioRegistro[]
}

const ASISTENCIA_OPTS: { value: AsistenciaTipo; label: string }[] = [
  { value: 'presente', label: 'Presente' },
  { value: 'ausente', label: 'Ausente' },
  { value: 'justificado', label: 'Justificado' },
]

const ASISTENCIA_STYLE: Record<AsistenciaTipo, { bg: string; color: string }> = {
  presente:    { bg: '#c8e6d4', color: '#1a4d30' },
  ausente:     { bg: '#f5d9c0', color: '#7a3a10' },
  justificado: { bg: '#e8c9a0', color: '#6b3a10' },
}

const ESTADO_STYLE: Record<SesionEstado, { bg: string; color: string; label: string }> = {
  pendiente:  { bg: '#e8e0f0', color: '#4a2a80', label: 'Pendiente' },
  finalizada: { bg: '#c8e6d4', color: '#1a4d30', label: 'Finalizada' },
  cancelada:  { bg: '#f5d9c0', color: '#7a3a10', label: 'Cancelada' },
}

export default function DetalleSesionPage() {
  const router = useRouter()
  const params = useParams()
  const [sesion, setSesion] = useState<Sesion | null>(null)
  const [registros, setRegistros] = useState<RegistroConAlumno[]>([])
  const [clases, setClases] = useState<Clase[]>([])
  const [loading, setLoading] = useState(true)
  const [expandido, setExpandido] = useState<string | null>(null)
  const [comentarioTexto, setComentarioTexto] = useState<Record<string, string>>({})
  const [guardandoComentario, setGuardandoComentario] = useState<string | null>(null)
  const [mostrarCambioEstado, setMostrarCambioEstado] = useState(false)
  const [mostrarCambioClase, setMostrarCambioClase] = useState(false)

  useEffect(() => {
    load()
  }, [params.id])

  async function load() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.replace('/'); return }

    const [{ data: s }, { data: cs }] = await Promise.all([
      supabase
        .from('sesiones')
        .select('*, grupo:grupos(*), clase:clases(*)')
        .eq('id', params.id)
        .single(),
      supabase.from('clases').select('*').eq('coach_id', user.id).order('titulo'),
    ])

    if (!s) { setLoading(false); return }
    setSesion(s)
    setClases(cs ?? [])

    // Si la sesión es pendiente, sincronizar alumnos del grupo
    if (s.estado === 'pendiente') {
      const { data: alumnosGrupo } = await supabase
        .from('alumno_grupo')
        .select('alumno_id')
        .eq('grupo_id', s.grupo_id)

      const { data: registrosActuales } = await supabase
        .from('registros_alumno')
        .select('id, alumno_id, nota, comentarios:comentarios_registro(id)')
        .eq('sesion_id', params.id)

      const idsGrupo = new Set((alumnosGrupo ?? []).map((a: { alumno_id: string }) => a.alumno_id))
      const regsActuales = registrosActuales ?? []

      // Agregar los que faltan
      const idsConRegistro = new Set(regsActuales.map((r: { alumno_id: string }) => r.alumno_id))
      const faltantes = [...idsGrupo].filter(id => !idsConRegistro.has(id))
      if (faltantes.length > 0) {
        await supabase.from('registros_alumno').insert(
          faltantes.map(alumno_id => ({ sesion_id: params.id, alumno_id, asistencia: 'presente' }))
        )
      }

      // Eliminar los que ya no están en el grupo, solo si no tienen nota ni comentarios
      const sobran = regsActuales.filter((r: { alumno_id: string; nota: number | null; comentarios: { id: string }[] }) =>
        !idsGrupo.has(r.alumno_id) && r.nota === null && r.comentarios.length === 0
      )
      if (sobran.length > 0) {
        await supabase.from('registros_alumno').delete().in('id', sobran.map((r: { id: string }) => r.id))
      }
    }

    const { data: regs } = await supabase
      .from('registros_alumno')
      .select('*, alumno:alumnos(id, nombre, apellido), comentarios:comentarios_registro(*)')
      .eq('sesion_id', params.id)
      .order('created_at', { referencedTable: 'comentarios_registro', ascending: true })

    setRegistros(regs ?? [])
    setLoading(false)
  }

  async function updateAsistencia(registroId: string, asistencia: AsistenciaTipo) {
    const supabase = createClient()
    await supabase.from('registros_alumno').update({ asistencia }).eq('id', registroId)
    setRegistros(prev => prev.map(r => r.id === registroId ? { ...r, asistencia } : r))
  }

  async function updateNota(registroId: string, nota: string) {
    const supabase = createClient()
    const val = nota === '' ? null : Math.min(10, Math.max(1, parseInt(nota)))
    await supabase.from('registros_alumno').update({ nota: val }).eq('id', registroId)
    setRegistros(prev => prev.map(r => r.id === registroId ? { ...r, nota: val } : r))
  }

  async function agregarComentario(registroId: string) {
    const texto = comentarioTexto[registroId]?.trim()
    if (!texto) return
    setGuardandoComentario(registroId)
    const supabase = createClient()
    const { data: c } = await supabase
      .from('comentarios_registro')
      .insert({ registro_id: registroId, texto })
      .select()
      .single()
    if (c) {
      setRegistros(prev => prev.map(r =>
        r.id === registroId ? { ...r, comentarios: [...r.comentarios, c] } : r
      ))
      setComentarioTexto(prev => ({ ...prev, [registroId]: '' }))
    }
    setGuardandoComentario(null)
  }

  async function cambiarEstado(estado: SesionEstado) {
    if (!sesion) return
    const supabase = createClient()
    await supabase.from('sesiones').update({ estado }).eq('id', sesion.id)
    setSesion(prev => prev ? { ...prev, estado } : prev)
    setMostrarCambioEstado(false)
  }

  async function cambiarClase(claseId: string | null) {
    if (!sesion) return
    const supabase = createClient()
    await supabase.from('sesiones').update({ clase_id: claseId }).eq('id', sesion.id)
    // Recargar para traer la clase completa
    const { data: s } = await supabase
      .from('sesiones')
      .select('*, grupo:grupos(*), clase:clases(*)')
      .eq('id', sesion.id)
      .single()
    if (s) setSesion(s)
    setMostrarCambioClase(false)
  }

  if (loading) return <div className="px-4 pt-6"><p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Cargando...</p></div>
  if (!sesion) return <div className="px-4 pt-6"><p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Sesión no encontrada.</p></div>

  const estadoStyle = ESTADO_STYLE[sesion.estado]
  const fechaFormateada = new Date(sesion.fecha + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="px-4 pt-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-primary)' }}>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)', textTransform: 'capitalize' }}>
            {fechaFormateada}
          </h1>
        </div>
        <button
          onClick={() => setMostrarCambioEstado(v => !v)}
          className="badge"
          style={{ backgroundColor: estadoStyle.bg, color: estadoStyle.color, fontWeight: 600 }}
        >
          {estadoStyle.label}
        </button>
      </div>

      {/* Cambio de estado */}
      {mostrarCambioEstado && (
        <div className="card flex gap-2 mb-4 flex-wrap">
          {(['pendiente', 'finalizada', 'cancelada'] as SesionEstado[]).map(e => (
            <button
              key={e}
              onClick={() => cambiarEstado(e)}
              className="badge"
              style={{
                backgroundColor: sesion.estado === e ? ESTADO_STYLE[e].bg : 'var(--color-bg-surface)',
                color: sesion.estado === e ? ESTADO_STYLE[e].color : 'var(--color-text-muted)',
                fontWeight: sesion.estado === e ? 600 : 400,
              }}
            >
              {ESTADO_STYLE[e].label}
            </button>
          ))}
        </div>
      )}

      {/* Info sesión */}
      <div className="card flex flex-col gap-2 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="label-section">Grupo</p>
            <p style={{ fontSize: 14, color: 'var(--color-text-primary)', fontWeight: 500, marginTop: 2 }}>
              {(sesion.grupo as any)?.nombre}
            </p>
          </div>
          {sesion.hora && (
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>{sesion.hora.slice(0, 5)}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="label-section">Clase</p>
            <button
              onClick={() => setMostrarCambioClase(v => !v)}
              style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 500 }}
            >
              {sesion.clase_id ? 'Cambiar' : 'Asignar'}
            </button>
          </div>
          {sesion.clase_id ? (
            <p style={{ fontSize: 14, color: 'var(--color-text-primary)', marginTop: 2 }}>
              {(sesion.clase as any)?.titulo}
            </p>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 }}>Sin clase asignada</p>
          )}
        </div>

        {mostrarCambioClase && (
          <div className="flex flex-col gap-1.5 mt-1">
            {sesion.clase_id && (
              <button
                onClick={() => cambiarClase(null)}
                className="card text-left"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Sin clase</span>
              </button>
            )}
            {clases.map(c => (
              <button
                key={c.id}
                onClick={() => cambiarClase(c.id)}
                className="card text-left"
                style={{ borderColor: sesion.clase_id === c.id ? 'var(--color-accent)' : 'var(--color-border)' }}
              >
                <span style={{ fontSize: 13, fontWeight: sesion.clase_id === c.id ? 600 : 400, color: 'var(--color-text-primary)' }}>
                  {c.titulo}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Alumnos */}
      <p className="label-section mb-2">Alumnos ({registros.length})</p>
      <div className="flex flex-col gap-2">
        {registros.map(reg => {
          const abierto = expandido === reg.id
          const estilo = ASISTENCIA_STYLE[reg.asistencia]
          return (
            <div key={reg.id} className="card flex flex-col gap-0" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Fila principal — tap para expandir */}
              <button
                type="button"
                onClick={() => setExpandido(abierto ? null : reg.id)}
                className="flex items-center justify-between"
                style={{ padding: '12px', width: '100%', textAlign: 'left' }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    {reg.alumno.nombre} {reg.alumno.apellido}
                  </span>
                  {reg.comentarios.length > 0 && (
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                      💬 {reg.comentarios.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {reg.nota !== null && (
                    <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{reg.nota}/10</span>
                  )}
                  <span
                    className="badge"
                    style={{ backgroundColor: estilo.bg, color: estilo.color, fontWeight: 500 }}
                  >
                    {ASISTENCIA_OPTS.find(a => a.value === reg.asistencia)?.label}
                  </span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ color: 'var(--color-text-muted)', transform: abierto ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </button>

              {/* Panel expandido */}
              {abierto && (
                <div className="flex flex-col gap-3" style={{ padding: '0 12px 12px', borderTop: '0.5px solid var(--color-border)' }}>
                  {/* Asistencia */}
                  <div className="flex flex-col gap-1.5 pt-3">
                    <p className="label-section">Asistencia</p>
                    <div className="flex gap-2">
                      {ASISTENCIA_OPTS.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateAsistencia(reg.id, opt.value)}
                          className="badge"
                          style={{
                            backgroundColor: reg.asistencia === opt.value ? ASISTENCIA_STYLE[opt.value].bg : 'var(--color-bg-surface)',
                            color: reg.asistencia === opt.value ? ASISTENCIA_STYLE[opt.value].color : 'var(--color-text-muted)',
                            fontWeight: reg.asistencia === opt.value ? 600 : 400,
                            padding: '6px 12px',
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nota */}
                  <div className="flex flex-col gap-1.5">
                    <p className="label-section">Nota <span style={{ textTransform: 'none', fontSize: 11, color: 'var(--color-text-muted)' }}>(1–10, opcional)</span></p>
                    <input
                      className="input"
                      type="number"
                      min={1}
                      max={10}
                      placeholder="—"
                      value={reg.nota ?? ''}
                      onChange={e => updateNota(reg.id, e.target.value)}
                      style={{ width: 80, textAlign: 'center' }}
                    />
                  </div>

                  {/* Comentarios */}
                  <div className="flex flex-col gap-1.5">
                    <p className="label-section">Comentarios</p>
                    {reg.comentarios.length > 0 && (
                      <div className="flex flex-col gap-1">
                        {reg.comentarios.map(c => (
                          <div key={c.id} style={{ backgroundColor: 'var(--color-bg-surface)', borderRadius: 6, padding: '6px 10px' }}>
                            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{c.texto}</p>
                            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                              {new Date(c.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        className="input"
                        placeholder="Agregar comentario..."
                        value={comentarioTexto[reg.id] ?? ''}
                        onChange={e => setComentarioTexto(prev => ({ ...prev, [reg.id]: e.target.value }))}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); agregarComentario(reg.id) } }}
                        style={{ fontSize: 13 }}
                      />
                      <button
                        type="button"
                        onClick={() => agregarComentario(reg.id)}
                        disabled={guardandoComentario === reg.id || !comentarioTexto[reg.id]?.trim()}
                        style={{
                          backgroundColor: 'var(--color-action)',
                          color: 'var(--color-action-text)',
                          borderRadius: 7,
                          padding: '0 14px',
                          fontSize: 13,
                          fontWeight: 600,
                          flexShrink: 0,
                          opacity: !comentarioTexto[reg.id]?.trim() ? 0.4 : 1,
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
