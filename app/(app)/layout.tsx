'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'

function IconPerfil() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

const NAV_ITEMS = [
  { href: '/home', label: 'Inicio', icon: IconHome },
  { href: '/sesiones', label: 'Sesiones', icon: IconSesiones },
  { href: '/clases', label: 'Clases', icon: IconClases },
  { href: '/alumnos', label: 'Alumnos', icon: IconAlumnos },
  { href: '/grupos', label: 'Grupos', icon: IconGrupos },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/')
      } else {
        setChecking(false)
      }
    })
  }, [router])

  if (checking) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-app)' }}>
        <div style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Cargando...</div>
      </div>
    )
  }

  const perfilActive = pathname === '/perfil'

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: 'var(--color-bg-app)' }}>
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 flex items-center justify-end"
        style={{
          backgroundColor: 'var(--color-bg-app)',
          borderBottom: '0.5px solid var(--color-border)',
          height: 48,
          paddingRight: 16,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => router.push('/perfil')}
          style={{ color: perfilActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
        >
          <IconPerfil />
        </button>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto pb-20 pt-12">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderTop: '0.5px solid var(--color-border)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          height: 60,
        }}
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className="flex flex-col items-center gap-0.5 flex-1 py-2"
              style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
            >
              <Icon active={active} />
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

function IconHome({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconSesiones({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function IconClases({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

function IconAlumnos({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconGrupos({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="4" r="2" />
      <circle cx="20" cy="16" r="2" />
      <circle cx="4" cy="16" r="2" />
      <line x1="12" y1="6" x2="12" y2="9" />
      <line x1="18.5" y1="15" x2="15" y2="13" />
      <line x1="5.5" y1="15" x2="9" y2="13" />
    </svg>
  )
}
