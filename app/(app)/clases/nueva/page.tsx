'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { TipoEtapa, TecnicaTipo } from '@/lib/types'

type EtapaForm = {
  id: string // local, para el key
  tipo: TipoEtapa
  descripcion: string
  duracion_minutos: string
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

const TIPOS: { value: TipoEtapa; label: string }[] = [
  { value: 'calentamiento', label: 'Calentamiento' },
  { value: 'drill', label: 'Drill' },
  { value: 'juego', label: 'Juego' },
  { value: 'fisico', label: 'Físico' },
]

const TIPO_STYLE: Record<TipoEtapa, string> = {
  calentamiento: 'badge-calentamiento',
  drill: 'badge-drill',
  juego: 'badge-juego',
  fisico: 'badge-fisico',
}

function nuevaEtapa(): EtapaForm {
  return { id: crypto.randomUUID(), tipo: 'drill', descripcion: '', duracion_minutos: '' }
}

interface Colega {
  id: string
  nombre: string
  username: string
}

export default function NuevaClasePage() {
  const router = useRouter()
  const [titulo, setTitulo] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [tecnica, setTecnica] = useState<TecnicaTipo | null>(null)
  const [etapas, setEtapas] = useState<EtapaForm[]>([nuevaEtapa()])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [colegas, setColegas] = useState<Colega[]>([])
  const [compartidaCon, setCompartidaCon] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function loadColegas() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: colegasData } = await supabase
        .from('coach_colega')
        .select('coach_id, colega_id')
        .or(`coach_id.eq.${user.id},colega_id.eq.${user.id}`)
      if (!colegasData || colegasData.length === 0) return
      const colegaIds = colegasData.map((r: { coach_id: string; colega_id: string }) =>
        r.coach_id === user.id ? r.colega_id : r.coach_id
      )
      const { data: usuarios } = await supabase
        .from('usuarios')
        .select('id, nombre, username')
        .in('id', colegaIds)
      setColegas(usuarios ?? [])
    }
    loadColegas()
  }, [])

  function agregarEtapa() {
    setEtapas(prev => [...prev, nuevaEtapa()])
  }

  function eliminarEtapa(id: string) {
    setEtapas(prev => prev.filter(e => e.id !== id))
  }

  function updateEtapa(id: string, field: keyof EtapaForm, value: string) {
    setEtapas(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  function moverEtapa(id: string, direccion: 'arriba' | 'abajo') {
    setEtapas(prev => {
      const idx = prev.findIndex(e => e.id === id)
      if (idx === -1) return prev
      const next = [...prev]
      const swap = direccion === 'arriba' ? idx - 1 : idx + 1
      if (swap < 0 || swap >= next.length) return prev
      ;[next[idx], next[swap]] = [next[swap], next[idx]]
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

    const { data: clase, error: errClase } = await supabase
      .from('clases')
      .insert({ coach_id: user.id, titulo: titulo.trim(), objetivo: objetivo.trim() || null, tecnica: tecnica || null })
      .select()
      .single()

    if (errClase || !clase) {
      setError('Error al guardar la clase. Intentá de nuevo.')
      setLoading(false)
      return
    }

    const etapasValidas = etapas.filter(e => e.descripcion.trim())
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

    if (compartidaCon.size > 0) {
      await supabase.from('clase_compartida').insert(
        [...compartidaCon].map(coach_id => ({ clase_id: clase.id, coach_id }))
      )
    }

    router.push(`/clases/${clase.id}`)
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-primary)' }}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>Nueva clase</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="label-section">Título</label>
          <input
            className="input"
            placeholder="ej: Drive – Consistencia cruzada"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-section">Objetivo <span style={{ color: 'var(--color-text-muted)', textTransform: 'none', fontSize: 11 }}>(opcional)</span></label>
          <textarea
            className="input"
            placeholder="¿Qué querés lograr con esta clase?"
            value={objetivo}
            onChange={e => setObjetivo(e.target.value)}
            rows={2}
            style={{ resize: 'none' }}
          />
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

        {/* Etapas */}
        <div className="flex flex-col gap-2">
          <label className="label-section">Estructura de la clase</label>

          {etapas.map((etapa, idx) => (
            <div
              key={etapa.id}
              className="card flex flex-col gap-3"
              style={{ borderColor: 'var(--color-border)' }}
            >
              {/* Tipo + duración + eliminar */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1 flex-1 flex-wrap">
                  {TIPOS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => updateEtapa(etapa.id, 'tipo', value)}
                      className={`badge ${etapa.tipo === value ? TIPO_STYLE[value] : ''}`}
                      style={etapa.tipo !== value ? {
                        backgroundColor: 'var(--color-bg-surface)',
                        color: 'var(--color-text-muted)',
                      } : {}}
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
                    disabled={idx === etapas.length - 1}
                    style={{ color: idx === etapas.length - 1 ? 'var(--color-border)' : 'var(--color-text-muted)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => eliminarEtapa(etapa.id)}
                  style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Descripción */}
              <textarea
                className="input"
                placeholder="Describí el ejercicio o actividad..."
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
            style={{
              fontSize: 13,
              color: 'var(--color-accent)',
              fontWeight: 500,
              textAlign: 'center',
              padding: '10px',
              border: '0.5px dashed var(--color-border)',
              borderRadius: 8,
            }}
          >
            + Agregar etapa
          </button>
        </div>

        {/* Compartir con colegas */}
        {colegas.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="label-section">Compartir con <span style={{ color: 'var(--color-text-muted)', textTransform: 'none', fontSize: 11 }}>(opcional)</span></label>
            <div className="flex flex-wrap gap-2">
              {colegas.map(colega => {
                const seleccionada = compartidaCon.has(colega.id)
                return (
                  <button
                    key={colega.id}
                    type="button"
                    onClick={() => {
                      setCompartidaCon(prev => {
                        const next = new Set(prev)
                        if (next.has(colega.id)) next.delete(colega.id)
                        else next.add(colega.id)
                        return next
                      })
                    }}
                    className="badge"
                    style={{
                      backgroundColor: seleccionada ? '#ede7f6' : 'var(--color-bg-surface)',
                      color: seleccionada ? '#6a1b9a' : 'var(--color-text-muted)',
                      border: '0.5px solid',
                      borderColor: seleccionada ? '#6a1b9a' : 'var(--color-border)',
                      padding: '6px 12px',
                    }}
                  >
                    {colega.nombre}
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
          {loading ? 'Guardando...' : 'Crear clase'}
        </button>
      </form>
    </div>
  )
}
