export type PreguntaQuiz = {
  pregunta: string
  opciones: string[]
  correcta: number // índice de la opción correcta
}

export type Capitulo = {
  titulo: string
  contenido: string // texto completo del capítulo
}

export type Curso = {
  id: string
  titulo: string
  descripcion: string
  categoria: string
  duracion_estimada: string
  capitulos: Capitulo[]
  quiz: PreguntaQuiz[]
}

export const CURSOS: Curso[] = [
  {
    id: 'mas-herramientas-mejores-clases',
    titulo: 'Más herramientas, mejores clases',
    descripcion: 'Para coaches que ya estructuran bien y quieren ir un paso más allá.',
    categoria: 'Metodología',
    duracion_estimada: '20-25 min',
    capitulos: [
      {
        titulo: 'Tu clase ya tiene forma — ahora dale más capas',
        contenido: `Si llegaste hasta acá, seguramente ya sabés lo que es una clase bien estructurada. Calentamiento, técnica, juego, cierre. Quizás incluso integrás físico en el drill. Eso ya te pone en otro nivel.

Entonces la pregunta no es "¿cómo estructuro mejor?" sino: ¿cómo hago que cada minuto valga más?

**El concepto de densidad de aprendizaje**

Dos coaches. Ambos dan 60 minutos de drive. Uno hace: canasto → peloteo → punto. El otro hace: canasto con señal del jugador → peloteo cruzado alternando corta/larga → punto con drive vale 3.

El segundo no trabajó más tiempo. Trabajó más cosas al mismo tiempo — técnica, decisión y presión competitiva en la misma sesión.

Eso es densidad de aprendizaje: la cantidad de estímulos útiles que el alumno procesa por minuto, sin abrumarlo.

**¿Cómo se sube la densidad?**

No agregando más ejercicios. Sino diseñando cada ejercicio para que trabaje más de una dimensión a la vez:

• Técnica + físico: el movimiento de pies ES parte del drill
• Técnica + decisión: el alumno elige a dónde, no solo ejecuta
• Técnica + presión: hay una consecuencia — un punto, una regla, un desafío

En los próximos capítulos vamos a ver cómo hacer eso en concreto.`,
      },
      {
        titulo: 'Físico integrado — más allá del step y la escalera',
        contenido: `El step para el split. La escalera de coordinación. El lanzamiento de medicinball para el core. Son herramientas excelentes. El siguiente paso es entender por qué funcionan y, a partir de ahí, diseñar ejercicios propios o agregar nuevas herramientas.

**Por qué funciona el físico integrado**

El sistema nervioso no distingue "ahora hago físico, ahora hago tenis". Si el movimiento es específico del tenis — mismo patrón, mismo timing, misma dirección — la transferencia al juego real es directa.

Un jugador que hace split step con step durante 10 minutos al final de la clase transfiere menos que uno que hace split step como parte de un drill donde tiene que reaccionar a una pelota real.

La clave: el movimiento físico tiene que tener consecuencia técnica.

**Implementos que podés sumar**

Banda elástica (resistencia lateral): atada a la cintura con ancla en el cono, el jugador hace el desplazamiento hacia la pelota contra resistencia. Trabaja glúteo medio y estabilidad de cadera — exactamente lo que necesita el drive desde la esquina. Variante: banda en las rodillas durante el peloteo, que obliga a separar rodillas en el split y en el impacto.

Mini vallas (hurdles bajos): en línea para trabajar elevación de rodillas en el desplazamiento lateral. En zig-zag para simular cambios de dirección previos al golpe. El alumno pasa las vallas y termina en posición de golpe — sin pausa entre el físico y la pelota.

Foam roller (pre-clase): 5 minutos en cuádriceps, isquiotibiales y zona torácica antes de arrancar mejora el rango de movimiento y reduce el riesgo de lesión. Para adultos mayores de 35 es especialmente valioso.

**El ejercicio que lo explica todo**

Sprint con banda + split + drive cruzado: el alumno parte desde el centro con banda elástica atada a la cintura (ancla en el cono del lado contrario). Da 3 pasos laterales contra la resistencia, llega al cono de llegada, hace split step, el profe tira la pelota — el alumno ya está en posición porque el físico LO puso ahí.

Por qué funciona: no hay separación entre moverse y jugar. El desplazamiento físico es el movimiento táctico. El alumno no "hace físico y después tenis" — hace tenis desde el primer paso.

Este principio se puede aplicar a cualquier técnica: reves, volea, saque con salto. Diseñá el ejercicio físico que lleve al alumno exactamente a la posición de golpe.`,
      },
      {
        titulo: 'La progresión dentro de la clase — del control al caos',
        contenido: `Hay una secuencia que funciona en casi cualquier clase, para cualquier técnica. No es mágica — es que respeta cómo aprende el cerebro motor.

Control total → Decisión simple → Restricción táctica → Juego libre

**Por qué esta secuencia**

El cerebro motor necesita repetición limpia primero para instalar el patrón. Después necesita contexto (¿cuándo uso esto?) para que el patrón sea útil. Después necesita presión para que el patrón sea automático.

Si arrancás directo al juego, el alumno no consolida. Si te quedás en el canasto todo el tiempo, no transfiere.

**Los 4 niveles en concreto**

Nivel 1 — Control total (canasto, carga y descarga): el alumno controla el tempo. El profe tira cuando el jugador da la señal — hombros rotados hacia atrás, peso atrás. Foco 100% en técnica. Sin presión, sin decisión.

Nivel 2 — Decisión simple (peloteo con variable): peloteo cruzado alternando una pelota corta y una larga. El alumno tiene que leer la pelota y ajustar. Agrega una variable pero sigue siendo predecible.

Nivel 3 — Restricción táctica (juego con regla): solo se juega cruzado. O: la tercera pelota tiene que ser profunda. O: un punto vale 3 si lo ganás con drive cruzado. La restricción es más poderosa que la corrección verbal porque obliga al alumno a resolver el problema solo. "Tirá cruzado" es una instrucción. "Solo podés ganar puntos cruzado" es un desafío.

Nivel 4 — Juego libre: sin reglas extra. El alumno aplica todo lo que trabajó en presión real.

**Ejemplo completo: clase de drive con aceleración**

1. Canasto: carga y descarga con señal del jugador — foco en rotación de cadera y transferencia de peso (15 min)
2. Peloteo: cruzado alternando corta/larga — el alumno ajusta profundidad y timing (10 min)
3. Juego con restricción: punto de drive vale 3, primer golpe obligatorio cruzado (20 min)
4. Juego libre: partido normal (15 min)`,
      },
      {
        titulo: 'Adaptar sin improvisar — niños, principiantes y avanzados',
        contenido: `La progresión del capítulo anterior funciona para todos. Lo que cambia son los ingredientes.

**Niños (Presco / Escuela)**

El físico tiene que parecer un juego. Si parece ejercicio, pierden motivación rápido.

• En lugar de "hacé 3 pasos laterales y split": "¿quién llega al cono antes de que yo tire la pelota?"
• La escalera de coordinación se convierte en un desafío con nombre ("el camino del campeón")
• Las restricciones tácticas funcionan muy bien con niños si tienen forma de competencia

Para niños de Entrenamiento ya podés hablar de técnica con más detalle — tienen el vocabulario y la concentración para procesarlo.

**Adultos principiantes**

Necesitan entender el "por qué" del ejercicio antes de hacerlo. Si no entienden para qué sirve, lo hacen mecánicamente y no transfieren.

• Explicá brevemente antes de arrancar: "vamos a trabajar el split step dentro del ejercicio, no aparte, porque así es como pasa en el juego real"
• Toleran menos volumen — preferí menos repeticiones con más calidad
• La verbalización táctica ("digo a dónde voy antes de pegar") les ayuda a conectar técnica con decisión

**Adultos avanzados / intermedios**

Toleran más volumen y responden mejor a desafíos con presión de tiempo o marcador.

• "6 bolas por turno, contamos cuántas cruzadas profundas lográs"
• El hilo para trabajar altura de red los desafía sin que el profe tenga que corregir — la red habla sola
• Podés saltarte el nivel 1 (canasto) si ya tienen el patrón instalado e ir directo al peloteo con variable

**Mismo objetivo, tres versiones — split step**

Presco: "El que hace split antes de que la pelota bote gana un punto" — carrera lúdica con conos

Adulto principiante: step para split con explicación previa, después canasto reaccionando a la dirección del profe

Adulto avanzado: sprint lateral con banda + split + drive cruzado en secuencia sin pausa`,
      },
      {
        titulo: 'El cierre que el alumno se lleva a casa',
        contenido: `Los últimos 5 minutos son los que más se recuerdan. Y son los que la mayoría de los coaches descarta porque "terminamos con un punto y listo".

El cierre no es el partido final. Es el momento donde el alumno consolida lo que aprendió.

**Dos herramientas simples**

La pregunta reflexiva: no "¿cómo te fue?" sino algo específico:
• "¿Qué sentiste diferente hoy en el drive cuando transferiste el peso?"
• "¿En qué momento del juego usaste lo que trabajamos?"

Esta pregunta obliga al alumno a procesar lo que vivió. Eso fija el aprendizaje.

La tarea micro: una cosa concreta, observable, que puede hacer fuera de la cancha:
• "Esta semana mirá un punto de Alcaraz y fijate cuándo hace el split step — antes o después del bote"
• "Cuando caminés, probá activar el glúteo en cada paso — es el mismo músculo que usás en el desplazamiento lateral"

No tiene que ser difícil. Tiene que ser específica y conectada con lo que trabajaron ese día.

**Por qué importa**

El aprendizaje motor no termina cuando el alumno sale de la cancha. El cerebro consolida mientras descansa — especialmente en las primeras horas después de la práctica.

Si el alumno sale con una imagen mental clara de lo que trabajó, ese proceso de consolidación es más efectivo. 5 minutos de cierre bien usado pueden valer más que 10 minutos extra de peloteo.`,
      },
    ],
    quiz: [
      {
        pregunta: '¿Qué es la "densidad de aprendizaje" en el contexto de una clase de tenis?',
        opciones: [
          'La cantidad de alumnos por cancha',
          'La cantidad de estímulos útiles que el alumno procesa por minuto, sin abrumarlo',
          'El número de ejercicios distintos en una clase',
          'La intensidad física de los drills',
        ],
        correcta: 1,
      },
      {
        pregunta: '¿Cuál es la diferencia clave entre físico separado y físico integrado?',
        opciones: [
          'El físico integrado dura más tiempo',
          'El físico separado usa más implementos',
          'En el físico integrado el movimiento físico tiene consecuencia técnica directa — el alumno llega a la posición de golpe como resultado del ejercicio',
          'No hay diferencia real, son lo mismo con distinto nombre',
        ],
        correcta: 2,
      },
      {
        pregunta: '¿Cuál es el orden correcto de la progresión dentro de la clase, de menor a mayor presión?',
        opciones: [
          'Juego libre → Restricción táctica → Peloteo con variable → Canasto',
          'Canasto → Peloteo con variable → Restricción táctica → Juego libre',
          'Restricción táctica → Canasto → Juego libre → Peloteo con variable',
          'Peloteo con variable → Canasto → Restricción táctica → Juego libre',
        ],
        correcta: 1,
      },
      {
        pregunta: 'Tenés un grupo de niños de Escuela y el objetivo es mejorar el split step. ¿Cuál ejercicio es más adecuado?',
        opciones: [
          'Explicación técnica del split step con demostración, luego repetición en canasto',
          'Escalera de coordinación seguida de canasto con señal',
          '"El que hace split antes de que la pelota bote gana un punto" — con conos y pelota real',
          'Sprint lateral con banda elástica + split + drive cruzado',
        ],
        correcta: 2,
      },
      {
        pregunta: '¿Por qué una restricción táctica ("solo podés jugar cruzado") enseña más que una corrección verbal ("tirá cruzado")?',
        opciones: [
          'Porque el alumno la recuerda más fácil',
          'Porque obliga al alumno a resolver el problema solo, sin depender de la instrucción del coach',
          'Porque es menos tiempo explicando',
          'Porque funciona mejor con adultos que con niños',
        ],
        correcta: 1,
      },
    ],
  },
]

export function getCurso(id: string): Curso | undefined {
  return CURSOS.find(c => c.id === id)
}
