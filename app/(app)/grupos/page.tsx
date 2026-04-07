'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Grupo } from '@/lib/types'

interface GrupoConNinos extends Grupo {
  esDeNinos: boolean
}

export default function GruposPage() {
  const router = useRouter()
  const [grupos, setGrupos] = useState<GrupoConNinos[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('grupos')
        .select(`
          *,
          alumno_grupo(
            alumno:alumnos(es_nino)
          )
        `)
        .order('nombre', { ascending: true })

      if (data) {
        const grupосConNinos = data.map((g: any) => {
          const alumnos: { es_nino: boolean }[] = (g.alumno_grupo ?? []).map((ag: any) => ag.alumno)
          const tieneAlumnos = alumnos.length > 0
          const todosNinos = tieneAlumnos && alumnos.every(a => a.es_nino)
          return { ...g, esDeNinos: todosNinos }
        })
        setGrupos(grupосConNinos)
      }

      setLoading(false)
    }
    load()
  }, [])

  const activos = grupos.filter(g => g.activo)
  const archivados = grupos.filter(g => !g.activo)

  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>Grupos</h1>
        <button
          onClick={() => router.push('/grupos/nuevo')}
          className="btn-primary"
          style={{ width: 'auto', padding: '8px 16px', fontSize: 13 }}
        >
          + Nuevo
        </button>
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Cargando...</p>
      ) : grupos.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>No hay grupos todavía.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {activos.length > 0 && (
            <div className="flex flex-col gap-2">
              {activos.map(grupo => (
                <GrupoCard key={grupo.id} grupo={grupo} onClick={() => router.push(`/grupos/${grupo.id}`)} />
              ))}
            </div>
          )}

          {archivados.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="label-section">Archivados</p>
              {archivados.map(grupo => (
                <GrupoCard key={grupo.id} grupo={grupo} onClick={() => router.push(`/grupos/${grupo.id}`)} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function GrupoCard({ grupo, onClick }: { grupo: GrupoConNinos; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="card text-left flex items-center justify-between"
      style={{ opacity: grupo.activo ? 1 : 0.5 }}
    >
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {grupo.nombre}
          </span>
          {grupo.esDeNinos && (
            <span className="badge" style={{ backgroundColor: '#e3f2fd', color: '#1565c0', fontSize: 11 }}>
              Niños
            </span>
          )}
        </div>
        {grupo.descripcion && (
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }} className="line-clamp-1">
            {grupo.descripcion}
          </span>
        )}
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)', flexShrink: 0, marginLeft: 12 }}>
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  )
}
