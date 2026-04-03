export default function SesionesPage() {
  return (
    <div className="px-4 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>Sesiones</h1>
        <button className="btn-primary" style={{ width: 'auto', padding: '8px 16px', fontSize: 13 }}>
          + Nueva
        </button>
      </div>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>No hay sesiones todavía.</p>
    </div>
  )
}
