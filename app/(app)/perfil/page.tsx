'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function PerfilPage() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [username, setUsername] = useState('')
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [loading, setLoading] = useState(true)
  const [guardandoDatos, setGuardandoDatos] = useState(false)
  const [guardandoPassword, setGuardandoPassword] = useState(false)
  const [msgDatos, setMsgDatos] = useState<{ ok: boolean; texto: string } | null>(null)
  const [msgPassword, setMsgPassword] = useState<{ ok: boolean; texto: string } | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/'); return }
      setUserId(user.id)

      const { data } = await supabase
        .from('usuarios')
        .select('nombre, username')
        .eq('id', user.id)
        .single()

      if (data) {
        setNombre(data.nombre ?? '')
        setUsername(data.username ?? '')
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleGuardarDatos(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setMsgDatos(null)
    setGuardandoDatos(true)

    const supabase = createClient()

    // Verificar que el username no esté tomado por otro usuario
    if (username.trim()) {
      const { data: existing } = await supabase
        .from('usuarios')
        .select('id')
        .eq('username', username.trim())
        .neq('id', userId)
        .single()

      if (existing) {
        setMsgDatos({ ok: false, texto: 'Ese username ya está en uso.' })
        setGuardandoDatos(false)
        return
      }
    }

    const { error } = await supabase
      .from('usuarios')
      .update({ nombre: nombre.trim(), username: username.trim() || null })
      .eq('id', userId)

    if (error) {
      setMsgDatos({ ok: false, texto: 'Error al guardar. Intentá de nuevo.' })
    } else {
      setMsgDatos({ ok: true, texto: 'Datos actualizados.' })
    }
    setGuardandoDatos(false)
  }

  async function handleCambiarPassword(e: React.FormEvent) {
    e.preventDefault()
    setMsgPassword(null)

    if (nuevaPassword.length < 6) {
      setMsgPassword({ ok: false, texto: 'La contraseña debe tener al menos 6 caracteres.' })
      return
    }
    if (nuevaPassword !== confirmarPassword) {
      setMsgPassword({ ok: false, texto: 'Las contraseñas no coinciden.' })
      return
    }

    setGuardandoPassword(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: nuevaPassword })

    if (error) {
      setMsgPassword({ ok: false, texto: 'Error al cambiar la contraseña. Intentá de nuevo.' })
    } else {
      setMsgPassword({ ok: true, texto: 'Contraseña actualizada.' })
      setNuevaPassword('')
      setConfirmarPassword('')
    }
    setGuardandoPassword(false)
  }

  async function handleCerrarSesion() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/')
  }

  if (loading) return <div className="px-4 pt-6"><p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Cargando...</p></div>

  return (
    <div className="px-4 pt-6 pb-8 flex flex-col gap-6">
      <h1 style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>Mi perfil</h1>

      {/* Datos personales */}
      <form onSubmit={handleGuardarDatos} className="flex flex-col gap-3">
        <p className="label-section">Datos personales</p>

        <div className="flex flex-col gap-1">
          <label className="label-section">Nombre</label>
          <input
            className="input"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Tu nombre"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-section">Username</label>
          <input
            className="input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="ej: vane"
            autoCapitalize="none"
          />
        </div>

        {msgDatos && (
          <p style={{ fontSize: 13, color: msgDatos.ok ? '#1a4d30' : '#c0392b', textAlign: 'center' }}>
            {msgDatos.texto}
          </p>
        )}

        <button type="submit" className="btn-primary" disabled={guardandoDatos}>
          {guardandoDatos ? 'Guardando...' : 'Guardar datos'}
        </button>
      </form>

      {/* Cambiar contraseña */}
      <form onSubmit={handleCambiarPassword} className="flex flex-col gap-3">
        <p className="label-section">Cambiar contraseña</p>

        <div className="flex flex-col gap-1">
          <label className="label-section">Nueva contraseña</label>
          <input
            className="input"
            type="password"
            value={nuevaPassword}
            onChange={e => setNuevaPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-section">Confirmar contraseña</label>
          <input
            className="input"
            type="password"
            value={confirmarPassword}
            onChange={e => setConfirmarPassword(e.target.value)}
            placeholder="Repetí la contraseña"
          />
        </div>

        {msgPassword && (
          <p style={{ fontSize: 13, color: msgPassword.ok ? '#1a4d30' : '#c0392b', textAlign: 'center' }}>
            {msgPassword.texto}
          </p>
        )}

        <button type="submit" className="btn-primary" disabled={guardandoPassword}>
          {guardandoPassword ? 'Cambiando...' : 'Cambiar contraseña'}
        </button>
      </form>

      {/* Cerrar sesión */}
      <div style={{ borderTop: '0.5px solid var(--color-border)', paddingTop: 16 }}>
        <button
          onClick={handleCerrarSesion}
          className="btn-secondary"
          style={{ color: '#c0392b', borderColor: '#c0392b' }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
