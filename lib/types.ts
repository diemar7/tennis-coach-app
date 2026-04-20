export type UserRole = 'coach' | 'admin'
export type NivelAlumno = 'principiante' | 'intermedio' | 'avanzado' | 'presco' | 'escuela' | 'entrenamiento'
export type TipoEtapa = 'calentamiento' | 'drill' | 'juego' | 'fisico'
export type AsistenciaTipo = 'presente' | 'ausente' | 'justificado'
export type SesionEstado = 'pendiente' | 'finalizada' | 'cancelada'
export type TecnicaTipo = 'drive' | 'reves' | 'saque' | 'volea' | 'smash' | 'globo' | 'slice' | 'drop' | 'fisico' | 'tactica' | 'otro'

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: UserRole
  created_at: string
}

export interface Alumno {
  id: string
  coach_id: string
  nombre: string
  apellido: string
  fecha_ingreso: string
  nivel: NivelAlumno
  es_nino: boolean
  notas_generales: string | null
  activo: boolean
  created_at: string
}

export interface Grupo {
  id: string
  coach_id: string
  nombre: string
  descripcion: string | null
  activo: boolean
  created_at: string
}

export interface AlumnoGrupo {
  alumno_id: string
  grupo_id: string
  fecha_ingreso: string
}

export interface Clase {
  id: string
  coach_id: string
  titulo: string
  objetivo: string | null
  tecnica: TecnicaTipo | null
  created_at: string
  etapas?: Etapa[]
}

export interface Etapa {
  id: string
  clase_id: string
  tipo: TipoEtapa
  descripcion: string
  duracion_minutos: number | null
  orden: number
}

export interface Sesion {
  id: string
  coach_id: string
  grupo_id: string
  clase_id: string | null
  fecha: string
  hora: string | null
  estado: SesionEstado
  tecnica: TecnicaTipo | null
  notas: string | null
  created_at: string
  grupo?: Grupo
  clase?: Clase
  registros?: RegistroAlumno[]
}

export interface RegistroAlumno {
  id: string
  sesion_id: string
  alumno_id: string
  asistencia: AsistenciaTipo
  nota: number | null
  created_at: string
  alumno?: Alumno
  comentarios?: ComentarioRegistro[]
}

export interface ComentarioRegistro {
  id: string
  registro_id: string
  texto: string
  created_at: string
}
