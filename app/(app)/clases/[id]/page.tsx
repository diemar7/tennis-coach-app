'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Clase, Etapa, TipoEtapa, TecnicaTipo } from '@/lib/types'

type EtapaForm = {
  id: string
  tipo: TipoEtapa
  descripcion: string
  duracion_minutos: string
  esNueva?: boolean
}

const TECNICAS: { value: TecnicaTipo; label: string }[] = [
  { value: 'drive', label: 'Drive' },
  { value: 'reves', label: 'Revés' },
  { value: 'saque', label: 'Saque' },
  { value: 'volea', label: 'Volea' },
  { value: 'smash', label: 'Smash' },
  { value: 'globo', label: 'Globo' },
  { value: 'slice', label: 'Slice' },
  { value: 'drop', label: 'Drop' },
  { value: 'fisico', label: 'Físico' },
  { value: 'tactica', label: 'Táctica' },
  { value: 'otro', label: 'Otro' },
]

const TECNICA_LABEL: Record<TecnicaTipo, string> = {
  drive: 'Drive', reves: 'Revés', saque: 'Saque', volea: 'Volea', smash: 'Smash',
  globo: 'Globo', slice: 'Slice', drop: 'Drop', fisico: 'Físico', tactica: 'Táctica', otro: 'Otro',
}

const TIPOS: { value: TipoEtapa; label: string }[] = [
  { value: 'calentamiento', label: 'Calentamiento' },
  { value: 'drill', label: 'Drill' },
  { value: 'juego', label: 'Juego' },
  { value: 'fisico', label: 'Físico' },
]

const TIPO_LABEL: Record<TipoEtapa, string> = {
  calentamiento: 'Calentamiento',
  drill: 'Drill',
  juego: 'Juego',
  fisico: 'Físico',
}

const TIPO_STYLE: Record<TipoEtapa, string> = {
  calentamiento: 'badge-calentamiento',
  drill: 'badge-drill',
  juego: 'badge-juego',
  fisico: 'badge-fisico',
}

export default function DetalleClasePage() {
  const router = useRouter()
  const params = useParams()
  const [clase, setClase] = useState<Clase | null>(null)
  const [etapas, setEtapas] = useState<Etapa[]>([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)

  // Campos editables
  const [titulo, setTitulo] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [tecnica, setTecnica] = useState<TecnicaTipo | null>(null)
  const [etapasForm, setEtapasForm] = useState<EtapaForm[]>([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('clases')
        .select('*, etapas(*)')
        .eq('id', params.id)
        .single()

      if (data) {
        setClase(data)
        setTitulo(data.titulo)
        setObjetivo(data.objetivo ?? '')
        setTecnica(data.tecnica ?? null)
        const sorted = (data.etapas ?? []).sort((a: Etapa, b: Etapa) => a.orden - b.orden)
        setEtapas(sorted)
        setEtapasForm(sorted.map((e: Etapa) => ({
          id: e.id,
          tipo: e.tipo,
          descripcion: e.descripcion,
          duracion_minutos: e.duracion_minutos?.toString() ?? '',
        })))
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  function agregarEtapa() {
    setEtapasForm(prev => [...prev, { id: crypto.randomUUID(), tipo: 'drill', descripcion: '', duracion_minutos: '', esNueva: true }])
  }

  function eliminarEtapa(id: string) {
    setEtapasForm(prev => prev.filter(e => e.id !== id))
  }

  function updateEtapa(id: string, field: keyof EtapaForm, value: string) {
    setEtapasForm(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  function moverEtapa(id: string, direccion: 'arriba' | 'abajo') {
    setEtapasForm(prev => {
      const idx = prev.findIndex(e => e.id === id)
      if (idx === -1) return prev
      const next = [...prev]
      const swap = direccion === 'arriba' ? idx - 1 : idx + 1
      if (swap < 0 || swap >= next.length) return prev
      ;[next[idx], next[swap]] = [next[swap], next[idx]]
      return next
    })
  }

  async function handleGuardar() {
    if (!clase) return
    setGuardando(true)
    const supabase = createClient()

    await supabase
      .from('clases')
      .update({ titulo: titulo.trim(), objetivo: objetivo.trim() || null, tecnica: tecnica || null })
      .eq('id', clase.id)

    // Borrar todas las etapas y reinsertar
    await supabase.from('etapas').delete().eq('clase_id', clase.id)

    const etapasValidas = etapasForm.filter(e => e.descripcion.trim())
    if (etapasValidas.length > 0) {
      await supabase.from('etapas').insert(
        etapasValidas.map((e, i) => ({
          clase_id: clase.id,
          tipo: e.tipo,
          descripcion: e.descripcion.trim(),
          duracion_minutos: e.duracion_minutos ? parseInt(e.duracion_minutos) : null,
          orden: i,
        }))
      )
    }

    // Recargar
    const { data } = await supabase
      .from('clases')
      .select('*, etapas(*)')
      .eq('id', clase.id)
      .single()

    if (data) {
      setClase(data)
      setTecnica(data.tecnica ?? null)
      const sorted = (data.etapas ?? []).sort((a: Etapa, b: Etapa) => a.orden - b.orden)
      setEtapas(sorted)
      setEtapasForm(sorted.map((e: Etapa) => ({
        id: e.id,
        tipo: e.tipo,
        descripcion: e.descripcion,
        duracion_minutos: e.duracion_minutos?.toString() ?? '',
      })))
    }

    setGuardando(false)
    setEditando(false)
  }

  if (loading) return <div className="px-4 pt-6"><p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Cargando...</p></div>
  if (!clase) return <div className="px-4 pt-6"><p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Clase no encontrada.</p></div>

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
            {editando ? 'Editar clase' : clase.titulo}
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
          {(clase.objetivo || clase.tecnica) && (
            <div className="flex flex-col gap-3">
              {clase.tecnica && (
                <div className="flex flex-col gap-1">
                  <p className="label-section">Técnica</p>
                  <span className="badge badge-tecnica" style={{ alignSelf: 'flex-start' }}>
                    {TECNICA_LABEL[clase.tecnica]}
                  </span>
                </div>
              )}
              {clase.objetivo && (
                <div className="flex flex-col gap-1">
                  <p className="label-section">Objetivo</p>
                  <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{clase.objetivo}</p>
                </div>
              )}
            </div>
          )}

          {etapas.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="label-section">Estructura</p>
              {etapas.map(etapa => (
                <div key={etapa.id} className="card flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`badge ${TIPO_STYLE[etapa.tipo]}`}>{TIPO_LABEL[etapa.tipo]}</span>
                    {etapa.duracion_minutos && (
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{etapa.duracion_minutos} min</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                    {etapa.descripcion}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="label-section">Título</label>
            <input className="input" value={titulo} onChange={e => setTitulo(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-section">Objetivo <span style={{ color: 'var(--color-text-muted)', textTransform: 'none', fontSize: 11 }}>(opcional)</span></label>
            <textarea className="input" value={objetivo} onChange={e => setObjetivo(e.target.value)} rows={2} style={{ resize: 'none' }} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="label-section">Técnica <span style={{ color: 'var(--color-text-muted)', textTransform: 'none', fontSize: 11 }}>(opcional)</span></label>
            <div className="flex flex-wrap gap-1.5">
              {TECNICAS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTecnica(tecnica === value ? null : value)}
                  className={`badge ${tecnica === value ? 'badge-tecnica' : ''}`}
                  style={tecnica !== value ? {
                    backgroundColor: 'var(--color-bg-surface)',
                    color: 'var(--color-text-muted)',
                  } : {}}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="label-section">Estructura</label>
            {etapasForm.map((etapa, idx) => (
              <div key={etapa.id} className="card flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 flex-1 flex-wrap">
                    {TIPOS.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => updateEtapa(etapa.id, 'tipo', value)}
                        className={`badge ${etapa.tipo === value ? TIPO_STYLE[value] : ''}`}
                        style={etapa.tipo !== value ? { backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-text-muted)' } : {}}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <input
                    className="input"
                    type="number"
                    placeholder="min"
                    value={etapa.duracion_minutos}
                    onChange={e => updateEtapa(etapa.id, 'duracion_minutos', e.target.value)}
                    style={{ width: 60, textAlign: 'center', padding: '6px 8px' }}
                    min={1}
                  />
                  {/* Botones reordenar */}
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => moverEtapa(etapa.id, 'arriba')}
                      disabled={idx === 0}
                      style={{ color: idx === 0 ? 'var(--color-border)' : 'var(--color-text-muted)' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 15l-6-6-6 6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moverEtapa(etapa.id, 'abajo')}
                      disabled={idx === etapasForm.length - 1}
                      style={{ color: idx === etapasForm.length - 1 ? 'var(--color-border)' : 'var(--color-text-muted)' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                  <button type="button" onClick={() => eliminarEtapa(etapa.id)} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                <textarea
                  className="input"
                  placeholder="Describí el ejercicio..."
                  value={etapa.descripcion}
                  onChange={e => updateEtapa(etapa.id, 'descripcion', e.target.value)}
                  rows={2}
                  style={{ resize: 'none', fontSize: 13 }}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={agregarEtapa}
              style={{ fontSize: 13, color: 'var(--color-accent)', fontWeight: 500, textAlign: 'center', padding: '10px', border: '0.5px dashed var(--color-border)', borderRadius: 8 }}
            >
              + Agregar etapa
            </button>
          </div>

          <button onClick={handleGuardar} className="btn-primary mt-2" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      )}
    </div>
  )
}
