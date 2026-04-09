'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getCurso, type Curso } from '@/lib/cursos'
import { createClient } from '@/lib/supabase'

type ProgresoLocal = {
  capitulosLeidos: number[]
  nota: number | null
  completado: boolean
}

function BarraProgreso({ total, leidos }: { total: number; leidos: number }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: i < leidos ? 'var(--color-primary)' : 'var(--color-border)',
          }}
        />
      ))}
    </div>
  )
}

export default function CursoPage() {
  const router = useRouter()
  const params = useParams()
  const cursoId = params.id as string
  const curso = getCurso(cursoId)

  const [coachId, setCoachId] = useState<string | null>(null)
  const [progreso, setProgreso] = useState<ProgresoLocal>({ capitulosLeidos: [], nota: null, completado: false })
  const [modoQuiz, setModoQuiz] = useState(false)
  const [respuestas, setRespuestas] = useState<(number | null)[]>([])
  const [quizEnviado, setQuizEnviado] = useState(false)
  const [notaObtenida, setNotaObtenida] = useState<number | null>(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const uid = session.user.id
      setCoachId(uid)

      // Cargar capítulos leídos
      const { data: caps } = await supabase
        .from('capitulo_leido')
        .select('capitulo_idx')
        .eq('coach_id', uid)
        .eq('curso_id', cursoId)

      // Cargar progreso del curso
      const { data: prog } = await supabase
        .from('progreso_curso')
        .select('nota, fecha_completado')
        .eq('coach_id', uid)
        .eq('curso_id', cursoId)
        .maybeSingle()

      const leidos = caps?.map(c => c.capitulo_idx) ?? []
      setProgreso({
        capitulosLeidos: leidos,
        nota: prog?.nota ?? null,
        completado: !!prog?.fecha_completado,
      })

      if (prog?.nota !== null && prog?.nota !== undefined) {
        setNotaObtenida(prog.nota)
        setQuizEnviado(true)
      }
    })
  }, [cursoId])

  if (!curso) {
    return (
      <div className="px-4 pt-6">
        <p style={{ color: 'var(--color-text-muted)' }}>Curso no encontrado.</p>
      </div>
    )
  }

  const totalCaps = curso.capitulos.length
  const cantLeidos = progreso.capitulosLeidos.length
  const todosLeidos = cantLeidos === totalCaps

  async function marcarCapitulo(idx: number) {
    if (!coachId) return
    const yaLeido = progreso.capitulosLeidos.includes(idx)
    const supabase = createClient()

    if (yaLeido) {
      await supabase
        .from('capitulo_leido')
        .delete()
        .eq('coach_id', coachId)
        .eq('curso_id', cursoId)
        .eq('capitulo_idx', idx)
      setProgreso(p => ({ ...p, capitulosLeidos: p.capitulosLeidos.filter(i => i !== idx) }))
    } else {
      await supabase
        .from('capitulo_leido')
        .insert({ coach_id: coachId, curso_id: cursoId, capitulo_idx: idx })
      setProgreso(p => ({ ...p, capitulosLeidos: [...p.capitulosLeidos, idx] }))
    }
  }

  async function enviarQuiz() {
    if (!coachId) return
    const correctas = respuestas.filter((r, i) => r === curso!.quiz[i].correcta).length
    const nota = Math.round((correctas / curso!.quiz.length) * 10)
    setGuardando(true)

    const supabase = createClient()
    await supabase
      .from('progreso_curso')
      .upsert({
        coach_id: coachId,
        curso_id: cursoId,
        nota,
        fecha_completado: new Date().toISOString(),
      }, { onConflict: 'coach_id,curso_id' })

    setNotaObtenida(nota)
    setQuizEnviado(true)
    setProgreso(p => ({ ...p, nota, completado: true }))
    setGuardando(false)
  }

  if (modoQuiz) {
    return (
      <QuizView
        curso={curso}
        respuestas={respuestas}
        setRespuestas={setRespuestas}
        quizEnviado={quizEnviado}
        notaObtenida={notaObtenida}
        guardando={guardando}
        onEnviar={enviarQuiz}
        onVolver={() => {
          setModoQuiz(false)
          if (quizEnviado) router.push('/home')
        }}
      />
    )
  }

  return (
    <div className="px-4 pt-6 pb-6 flex flex-col gap-6">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <button
          onClick={() => router.push('/home')}
          style={{ color: 'var(--color-text-muted)', marginTop: 2, flexShrink: 0 }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <span style={{
            display: 'inline-block',
            backgroundColor: '#e8e0f0',
            color: '#4a2a80',
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 20,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            {curso.categoria}
          </span>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.3, margin: 0 }}>
            {curso.titulo}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
            {curso.duracion_estimada} · {totalCaps} capítulos
          </p>
        </div>
      </div>

      {/* Progreso */}
      <div className="card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>
            {progreso.completado ? '✓ Completado' : cantLeidos === 0 ? 'No iniciado' : `${cantLeidos}/${totalCaps} capítulos`}
          </span>
          {progreso.nota !== null && (
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>
              Nota: {progreso.nota}/10
            </span>
          )}
        </div>
        <BarraProgreso total={totalCaps} leidos={cantLeidos} />
      </div>

      {/* Capítulos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
          Capítulos
        </h2>
        {curso.capitulos.map((cap, idx) => {
          const leido = progreso.capitulosLeidos.includes(idx)
          return (
            <CapituloCard
              key={idx}
              idx={idx}
              capitulo={cap}
              leido={leido}
              onMarcar={() => marcarCapitulo(idx)}
            />
          )
        })}
      </div>

      {/* Quiz */}
      {todosLeidos && (
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
              Quiz final
            </h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
              {curso.quiz.length} preguntas · {progreso.nota !== null ? `Última nota: ${progreso.nota}/10` : 'No realizado aún'}
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              setRespuestas(Array(curso.quiz.length).fill(null))
              setQuizEnviado(false)
              setNotaObtenida(null)
              setModoQuiz(true)
            }}
          >
            {progreso.nota !== null ? 'Repetir quiz' : 'Hacer quiz'}
          </button>
        </div>
      )}

      {!todosLeidos && (
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center' }}>
          Leé todos los capítulos para desbloquear el quiz
        </p>
      )}
    </div>
  )
}

function CapituloCard({
  idx,
  capitulo,
  leido,
  onMarcar,
}: {
  idx: number
  capitulo: { titulo: string; contenido: string }
  leido: boolean
  onMarcar: () => void
}) {
  const [abierto, setAbierto] = useState(false)

  // Renderizar contenido con negritas y bullets
  const renderContenido = (texto: string) => {
    return texto.split('\n').map((linea, i) => {
      if (linea.trim() === '') return <br key={i} />

      // Detectar bullet
      if (linea.trim().startsWith('•')) {
        return (
          <p key={i} style={{ margin: '4px 0', paddingLeft: 12 }}>
            {renderNegritas(linea)}
          </p>
        )
      }

      // Detectar línea de título (termina con ":")
      const esTitulo = /^\*\*[^*]+\*\*$/.test(linea.trim())
      if (esTitulo) {
        return (
          <p key={i} style={{ margin: '12px 0 4px 0', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {linea.replace(/\*\*/g, '')}
          </p>
        )
      }

      return (
        <p key={i} style={{ margin: '4px 0' }}>
          {renderNegritas(linea)}
        </p>
      )
    })
  }

  const renderNegritas = (texto: string) => {
    const partes = texto.split(/\*\*(.*?)\*\*/)
    return partes.map((parte, i) =>
      i % 2 === 1
        ? <strong key={i}>{parte}</strong>
        : parte
    )
  }

  return (
    <div
      className="card"
      style={{
        padding: '14px 16px',
        borderLeft: leido ? '3px solid var(--color-primary)' : '3px solid var(--color-border)',
      }}
    >
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}
        onClick={() => setAbierto(v => !v)}
      >
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500 }}>
            Capítulo {idx + 1}
          </span>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', margin: '2px 0 0 0', lineHeight: 1.3 }}>
            {capitulo.titulo}
          </p>
        </div>
        <span style={{ color: 'var(--color-text-muted)', fontSize: 16, flexShrink: 0, marginTop: 2 }}>
          {abierto ? '▲' : '▼'}
        </span>
      </div>

      {abierto && (
        <div style={{ marginTop: 14, borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
            {renderContenido(capitulo.contenido)}
          </div>
          <button
            onClick={onMarcar}
            style={{
              marginTop: 16,
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              border: leido ? '1.5px solid var(--color-border)' : 'none',
              backgroundColor: leido ? 'transparent' : 'var(--color-primary)',
              color: leido ? 'var(--color-text-muted)' : '#000',
              cursor: 'pointer',
            }}
          >
            {leido ? '✓ Marcar como no leído' : 'Marcar como leído'}
          </button>
        </div>
      )}
    </div>
  )
}

function QuizView({
  curso,
  respuestas,
  setRespuestas,
  quizEnviado,
  notaObtenida,
  guardando,
  onEnviar,
  onVolver,
}: {
  curso: Curso
  respuestas: (number | null)[]
  setRespuestas: (r: (number | null)[]) => void
  quizEnviado: boolean
  notaObtenida: number | null
  guardando: boolean
  onEnviar: () => void
  onVolver: () => void
}) {
  const todasRespondidas = respuestas.length === curso.quiz.length && respuestas.every(r => r !== null)

  return (
    <div className="px-4 pt-6 pb-6 flex flex-col gap-6">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onVolver} style={{ color: 'var(--color-text-muted)' }}>←</button>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
          Quiz — {curso.titulo}
        </h1>
      </div>

      {quizEnviado && notaObtenida !== null ? (
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: 48, fontWeight: 800, color: notaObtenida >= 6 ? 'var(--color-primary)' : '#e55' }}>
            {notaObtenida}/10
          </span>
          <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', margin: 0 }}>
            {notaObtenida === 10
              ? '¡Perfecto! Dominás el tema.'
              : notaObtenida >= 7
              ? '¡Muy bien! Tenés una base sólida.'
              : notaObtenida >= 5
              ? 'Bien, repasá los capítulos donde dudaste.'
              : 'Repasá el curso y volvé a intentarlo.'}
          </p>
          <button className="btn-primary" style={{ marginTop: 8 }} onClick={onVolver}>
            Volver al curso
          </button>
        </div>
      ) : (
        <>
          {curso.quiz.map((q, qi) => (
            <div key={qi} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.4 }}>
                {qi + 1}. {q.pregunta}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {q.opciones.map((op, oi) => {
                  const seleccionada = respuestas[qi] === oi
                  return (
                    <button
                      key={oi}
                      onClick={() => {
                        const nuevas = [...respuestas]
                        nuevas[qi] = oi
                        setRespuestas(nuevas)
                      }}
                      style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        borderRadius: 10,
                        fontSize: 14,
                        lineHeight: 1.4,
                        border: seleccionada ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                        backgroundColor: seleccionada ? 'rgba(204,255,0,0.12)' : 'transparent',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                        fontWeight: seleccionada ? 600 : 400,
                      }}
                    >
                      {op}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          <button
            className="btn-primary"
            disabled={!todasRespondidas || guardando}
            onClick={onEnviar}
            style={{ opacity: todasRespondidas ? 1 : 0.4 }}
          >
            {guardando ? 'Guardando...' : 'Enviar respuestas'}
          </button>
        </>
      )}
    </div>
  )
}
