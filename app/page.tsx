'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()

    // Si no tiene @ asumimos que es un username — buscamos el email
    let loginEmail = email
    if (!email.includes('@')) {
      const { data } = await supabase
        .from('usuarios')
        .select('email')
        .eq('username', email.toLowerCase())
        .single()

      if (!data) {
        setError('Usuario o contraseña incorrectos')
        setLoading(false)
        return
      }
      loginEmail = data.email
    }

    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password })

    if (error) {
      setError('Usuario o contraseña incorrectos')
      setLoading(false)
      return
    }

    router.push('/home')
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5" style={{ backgroundColor: 'var(--color-bg-app)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Image src="/logo.png" alt="Tennis Coach" width={80} height={80} style={{ borderRadius: 18 }} />
          </div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Tennis Coach
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Tu herramienta de cancha
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="label-section">Usuario o email</label>
            <input
              className="input"
              type="text"
              placeholder="tu username o email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="username"
              autoCapitalize="none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-section">Contraseña</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-center" style={{ color: '#c0392b' }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary mt-2" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
