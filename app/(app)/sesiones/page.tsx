'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Sesion, SesionEstado } from '@/lib/types'

type SesionConRels = Sesion & {
  grupo: { nombre: string }
  clase: { titulo: string; tecnica: string | null } | null
}

const ESTADO_STYLE: Record<SesionEstado, { bg: string; color: string; label: string }> = {
  pendiente:  { bg: '#e8e0f0', color: '#4a2a80', label: 'Pendiente' },
  finalizada: { bg: '#c8e6d4', color: '#1a4d30', label: 'Finalizada' },
  cancelada:  { bg: '#f5d9c0', color: '#7a3a10', label: 'Cancelada' },
}

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function startOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function toLocalDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function SesionesPage() {
  const router = useRouter()
  const [sesiones, setSesiones] = useState<SesionConRels[]>([])
  const [loading, setLoading] = useState(true)
  const [semanaBase, setSemanaBase] = useState<Date>(() => startOfWeek(new Date()))

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('sesiones')
        .select('*, grupo:grupos(nombre), clase:clases(titulo, tecnica)')
        .order('fecha', { ascending: true })
        .order('hora', { ascending: true, nullsFirst: false })
      setSesiones(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const diasSemana = Array.from({ length: 7 }, (_, i) => addDays(semanaBase, i))
  const inicioStr = toLocalDateStr(diasSemana[0])
  const finStr = toLocalDateStr(diasSemana[6])

  const sesionesEnSemana = sesiones.filter(s => s.fecha >= inicioStr && s.fecha <= finStr)

  // Agrupar por fecha
  const porFecha: Record<string, SesionConRels[]> = {}
  for (const s of sesionesEnSemana) {
    if (!porFecha[s.fecha]) porFecha[s.fecha] = []
    porFecha[s.fecha].push(s)
  }

  const hoyStr = toLocalDateStr(new Date())

  const labelSemana = () => {
    const ini = diasSemana[0]
    const fin = diasSemana[6]
    if (ini.getMonth() === fin.getMonth()) {
      return `${ini.getDate()}–${fin.getDate()} ${MESES[ini.getMonth()]} ${ini.getFullYear()}`
    }
    return `${ini.getDate()} ${MESES[ini.getMonth()]} – ${fin.getDate()} ${MESES[fin.getMonth()]}`
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>Sesiones</h1>
        <button
          onClick={() => router.push('/sesiones/nueva')}
          className="btn-primary"
          style={{ width: 'auto', padding: '8px 16px', fontSize: 13 }}
        >
          + Nueva
        </button>
      </div>

      {/* Navegador semanal */}
      <div className="flex items-center justify-between mb-4" style={{ backgroundColor: 'var(--color-bg-surface)', borderRadius: 8, padding: '8px 12px' }}>
        <button
          onClick={() => setSemanaBase(prev => addDays(prev, -7))}
          style={{ color: 'var(--color-text-muted)', padding: 4 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={() => setSemanaBase(startOfWeek(new Date()))}
          style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}
        >
          {labelSemana()}
        </button>
        <button
          onClick={() => setSemanaBase(prev => addDays(prev, 7))}
          style={{ color: 'var(--color-text-muted)', padding: 4 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Cargando...</p>
      ) : sesionesEnSemana.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, textAlign: 'center', paddingTop: 24 }}>
          No hay sesiones esta semana.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {diasSemana.map(dia => {
            const fechaStr = toLocalDateStr(dia)
            const sessDia = porFecha[fechaStr]
            if (!sessDia) return null
            const esHoy = fechaStr === hoyStr
            return (
              <div key={fechaStr}>
                <p style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: esHoy ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  textTransform: 'capitalize',
                  marginBottom: 6,
                  letterSpacing: '0.03em',
                }}>
                  {esHoy ? 'Hoy, ' : ''}{DIAS[dia.getDay()]} {dia.getDate()} de {MESES[dia.getMonth()]}
                </p>
                <div className="flex flex-col gap-2">
                  {sessDia.map(s => {
                    const estado = ESTADO_STYLE[s.estado]
                    return (
                      <button
                        key={s.id}
                        onClick={() => router.push(`/sesiones/${s.id}`)}
                        className="card text-left flex items-center justify-between gap-2"
                      >
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                              {s.grupo.nombre}
                            </span>
                            {s.hora && (
                              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.hora.slice(0, 5)}</span>
                            )}
                          </div>
                          {s.clase && (
                            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }} className="truncate">
                              {s.clase.titulo}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="badge" style={{ backgroundColor: estado.bg, color: estado.color, fontWeight: 500 }}>
                            {estado.label}
                          </span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)' }}>
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
