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
  {
    id: 'ensenar-jugando',
    titulo: 'Enseñar jugando',
    descripcion: 'El juego como método, no como premio. Game-Based Learning aplicado al tenis.',
    categoria: 'Metodología',
    duracion_estimada: '25-30 min',
    capitulos: [
      {
        titulo: 'Por qué el juego enseña mejor que la repetición',
        contenido: `Hay una escena que se repite en canchas de todo el mundo: el alumno hace 40 minutos de canasto impecable, y cuando empieza el punto libre todo desaparece. El drive cambia, los pies se detienen, la cabeza se va.

No es falta de práctica. Es que practicó una cosa y le pedís otra.

**El problema del canasto puro**

La repetición bloqueada — misma pelota, mismo lugar, mismo ritmo — le dice al cerebro motor: "esto pasa siempre igual". El cerebro se adapta a esa condición y aprende a ejecutar en ese contexto específico. El problema es que el partido no se parece a eso en nada.

En el partido cada pelota es diferente. La posición cambia. Hay presión. Hay que decidir. Y el cerebro que aprendió solo a ejecutar, sin decidir ni adaptarse, no tiene recursos para manejarlo.

**Por qué el juego funciona diferente**

El juego — cualquier juego con reglas, puntaje y consecuencias — activa simultáneamente los sistemas que el tenis real requiere:

• Percepción: el alumno lee la pelota, la posición del rival, el espacio disponible
• Decisión: elige qué hacer, a dónde ir, cuándo atacar
• Ejecución: ejecuta bajo presión de tiempo real
• Adaptación: si algo no funcionó, ajusta en la próxima pelota

El canasto entrena solo la ejecución. El juego entrena las cuatro. Eso no significa que el canasto sea inútil — significa que el canasto solo no alcanza.

**Lo que dice la ciencia**

La investigación en adquisición de habilidades motoras es consistente desde hace 30 años: el aprendizaje en contexto variable y con significado (juego) produce mayor retención a largo plazo que la práctica bloqueada, aunque en el corto plazo parezca que el alumno aprende más lento.

El efecto tiene nombre: interferencia contextual. Mezclar situaciones distintas dentro de la sesión genera más errores al principio — y una memoria motora mucho más sólida después.

En otras palabras: si el alumno falla más durante el juego que durante el canasto, eso no es un problema. Es la señal de que está aprendiendo de verdad.`,
      },
      {
        titulo: 'Qué es el Game-Based Learning y en qué cambia todo',
        contenido: `El Game-Based Learning (GBL) no es "terminar la clase con un partido". Es una filosofía de enseñanza donde el juego es el vehículo principal del aprendizaje desde el primer minuto.

No es nuevo. Lo formaliza el enfoque Teaching Games for Understanding (TGfU), desarrollado en los años 80 por Bunker y Thorpe, y adoptado luego por la ITF, Tennis Australia y la mayoría de las academias de elite modernas.

**La diferencia central**

Enfoque tradicional: Técnica primero → Práctica de la técnica → Juego como recompensa

Game-Based Learning: Situación de juego → El alumno descubre qué necesita → Práctica con contexto → Situación de juego mejorada

En el enfoque tradicional, el alumno aprende cómo ejecutar. En el GBL, aprende cuándo, por qué y cómo — al mismo tiempo.

**Los tres principios del GBL aplicados al tenis**

1. El problema antes que la solución: no le enseñés el drive y después ponelo a jugar. Ponelo a jugar, dejá que el problema aparezca, y entonces enseñá el drive como respuesta a ese problema. El alumno que entiende por qué necesita ese golpe lo retiene y lo aplica mucho mejor.

2. La comprensión táctica antes que la perfección técnica: ¿a dónde tengo que ir? ¿Cuándo tengo que atacar? ¿Por qué ese golpe en esa situación? Si el alumno entiende el juego, la técnica tiene donde aterrizar. Sin comprensión táctica, la técnica es un gesto vacío.

3. El alumno como solucionador de problemas: el rol del coach en el GBL no es corregir constantemente — es diseñar situaciones donde el alumno tenga que resolver. Cada drill con reglas, cada juego modificado, cada restricción táctica es un problema diseñado. El alumno que aprende a resolver problemas en la cancha se vuelve más autónomo y progresa más rápido.

**¿Esto significa que nunca más hago canasto?**

No. El canasto sigue siendo valioso para instalar patrones motores nuevos, especialmente con principiantes o cuando hay un error técnico específico que corregir. La diferencia es que el canasto es una herramienta dentro del proceso — no el proceso en sí.

La proporción ideal varía según el nivel: con principiantes podés usar más canasto. Con intermedios y avanzados, el juego debería dominar la sesión.`,
      },
      {
        titulo: 'Cómo convertir cualquier drill en un juego con sentido',
        contenido: `Esta es la habilidad práctica central del GBL: tomar cualquier ejercicio técnico y transformarlo en una situación que tenga contexto, consecuencia y significado para el alumno.

No hace falta inventar nada nuevo. Hace falta modificar lo que ya hacés con tres variables.

**Las tres variables que transforman un drill**

Variable 1 — El puntaje: agregar un marcador cambia todo. No porque el resultado importe — sino porque cambia la forma en que el alumno procesa cada pelota. Con puntaje, cada golpe tiene consecuencia. Sin puntaje, el alumno puede ejecutar en piloto automático.

Ejemplos:
• Peloteo cruzado: el que hace 10 seguidas sin error gana
• Drive con dirección: cada drive profundo cruzado suma 2 puntos, el paralelo suma 1
• Saque: 3 puntos si entrás el primer saque al cuerpo del rival, 1 si entrás cualquier otro

Variable 2 — La restricción: una regla que obliga al alumno a tomar una decisión específica — sin que el coach tenga que decirle qué hacer.

Ejemplos:
• Solo podés ganar puntos con golpes cruzados
• Tenés que volver al centro antes de cada pelota
• El primer golpe del rally siempre tiene que ser profundo
• Si ganás el punto con volea, vale el doble

La restricción bien diseñada hace que el alumno practique lo que el coach quiere que practique, sin que parezca un ejercicio obligado.

Variable 3 — El espacio: modificar las dimensiones de la cancha dirige el aprendizaje sin una sola corrección verbal.

Ejemplos:
• Cancha angosta (solo los pasillos): forzás el paralelo y el desplazamiento lateral
• Zona de ataque marcada con cono: el alumno aprende a subir a la red solo porque hay un espacio definido donde sumar puntos
• Solo la mitad de la cancha: para trabajar el reves sin mezclar golpes

**El antes y el después**

Drill original: peloteo cruzado, el alumno tira 20 drives cruzados mientras el profe lo corrige.

Versión GBL: peloteo cruzado 1 vs 1. El que manda la pelota fuera de los límites cruzados pierde el punto. El que hace 3 drives profundos seguidos (más allá de la línea del servicio) suma un punto extra. Juegan a 11.

Mismo objetivo técnico. Completamente distinta experiencia de aprendizaje. El alumno está enfocado, decide, compite — y el coach puede observar sin interrumpir.`,
      },
      {
        titulo: 'Diseñar situaciones por nivel — de niños a avanzados',
        contenido: `El GBL no tiene un formato fijo. Se adapta a cada grupo. La clave es que la situación de juego tenga el nivel de complejidad justo: suficiente para que el alumno tenga que pensar, no tanto como para que se bloquee.

**Niños (Presco y Escuela)**

Los niños aprenden jugando de forma natural — el GBL es su idioma. Pero el diseño importa.

Lo que funciona:
• Juegos con nombres y personajes ("el rey de la cancha", "el cazador y la presa")
• Marcadores simples y visibles — conos de colores, puntos con piedras, pizarrón
• Reglas que se pueden explicar en 10 segundos
• Rotación frecuente — no más de 5-7 minutos en el mismo juego

Ejemplo para Presco — introducción al rally: "Juego del espejo": los dos jugadores se paran frente a frente en el cuadro de servicio. El profe tira la pelota. Quien la devuelve dentro de la cancha suma un punto. Primer jugador en llegar a 5 gana. No importa el drive — importa que la pelota entre.

Ejemplo para Escuela — dirección: "Zonas de colores": cada mitad de la cancha tiene una zona marcada con cono de color. El alumno suma puntos solo si la pelota cae en la zona del color que el profe grita antes del punto. Trabaja dirección sin mencionar técnica.

**Adultos principiantes**

Necesitan entender el juego antes de jugarlo — pero no necesitan una clase magistral. Una explicación de 30 segundos y arrancamos.

Lo que funciona:
• Juegos cortos con marcador claro
• Restricciones simples de una sola variable
• Rondas de reflexión breve después de cada juego: "¿qué le dificultó al rival?"
• Situaciones donde el éxito es posible — el desafío tiene que ser alcanzable

Ejemplo — drive con profundidad: peloteo 1 vs 1. Solo cuenta el punto si la pelota cae más allá de la línea del servicio. Las que caen cortas no suman para nadie. Juegan a 7. El objetivo técnico (profundidad) está en la regla, no en la corrección.

Ejemplo — saque: "El cuadrado de oro": marcá con conos un cuadrado pequeño en el cuadro de saque. El alumno tiene 5 saques. Cuenta cuántos entran en el cuadrado. Se anota y se compara en la próxima ronda. La competencia es consigo mismo.

**Adultos intermedios y avanzados**

Pueden manejar situaciones más complejas, múltiples variables y presión real.

Lo que funciona:
• Juegos con dos restricciones simultáneas
• Situaciones de partido real con condiciones específicas ("estás 5-4 abajo en el tercer set")
• Desafíos de consistencia bajo presión ("20 drives cruzados seguidos — si errás, empezás de cero")
• Competencia interna entre compañeros del grupo

Ejemplo — táctica de punto: "Patrón 2-1": el alumno tiene que terminar el punto en 3 golpes o menos usando el patrón drive cruzado → apertura → paralelo o winner. Si lo logra suma 3 puntos. Si gana el punto de otra manera suma 1. Juegan a 15. Entrena el patrón táctico más efectivo desde el fondo de cancha sin una sola explicación sobre táctica.

Ejemplo — situación de partido: "El quinto set": el alumno arranca 0-5 abajo. El objetivo es ganar los siguientes 3 juegos. Con restricción: el primer golpe de cada punto tiene que ser profundo. Trabaja mentalidad, táctica y técnica en simultáneo.`,
      },
      {
        titulo: 'El rol del coach en una clase de juego — menos hablar, más diseñar',
        contenido: `El GBL cambia la dinámica de la clase. Y cambia tu rol como coach.

En el modelo tradicional, el coach habla mucho: corrige, explica, demuestra, vuelve a corregir. El alumno ejecuta y espera el feedback.

En el GBL, el coach diseña la situación antes de la clase y, durante la clase, observa, ajusta variables y hace preguntas. Habla menos. Piensa más.

**Lo que hacés antes de la clase**

El trabajo del GBL empieza antes de entrar a la cancha. Las preguntas que guían el diseño:

1. ¿Qué quiero que el alumno aprenda? (técnica específica, concepto táctico, habilidad mental)
2. ¿Qué situación de juego lo obliga a practicar eso?
3. ¿Qué variables puedo modificar? (puntaje, restricción, espacio)
4. ¿Cómo mido si funcionó? (¿el alumno lo aplicó en el juego libre?)

Con esas cuatro respuestas, tenés una clase.

**Lo que hacés durante la clase**

Observás antes de intervenir: dejá que el juego se desarrolle 3-4 puntos antes de decir cualquier cosa. El alumno necesita tiempo para procesar.

Ajustás la dificultad en vivo: si el juego es demasiado fácil, agregás una restricción. Si es demasiado difícil, achicás el espacio o simplificás la regla. El nivel óptimo es el que genera errores interesantes — ni demasiados ni ninguno.

Preguntás en lugar de corregir: después de un punto, "¿qué viste que estaba abierto?" Después de un error, "¿qué harías diferente?" Estas preguntas activan la reflexión del alumno y construyen su capacidad de autocorregirse — la habilidad más valiosa que un coach puede desarrollar en un jugador.

Intervenís con corrección técnica solo cuando es necesario: cuando hay un error técnico que limita al alumno y no va a resolverse con el juego solo, ahí es el momento del canasto puntual, la demostración o la corrección verbal. Una sola corrección, clara y específica, y volvemos al juego.

**El indicador de que funcionó**

Al final de la sesión, el alumno aplica en el juego libre lo que trabajaste en el juego con restricciones. No necesitás preguntarle si aprendió — lo ves.

Ese momento — cuando el alumno usa el patrón táctico en el partido real, sin que nadie se lo diga — es el objetivo de toda la clase.`,
      },
      {
        titulo: 'Tres clases listas para usar — GBL en práctica',
        contenido: `Todo lo anterior en tres modelos de clase completos, listos para aplicar.

**Clase 1 — Drive cruzado con dirección (adultos intermedios, 60 min)**

Objetivo: mejorar la dirección y profundidad del drive cruzado bajo presión.

Calentamiento con juego (10 min): peloteo cooperativo cruzado. Objetivo: llegar a 20 seguidas entre los dos. Si erran, vuelven a 0. No hay corrección — solo el marcador los guía.

Drill con restricción 1 (15 min): peloteo competitivo cruzado. Solo suman los drives que caen más allá de la línea del servicio. El que cae corto no da punto a nadie. Juegan a 11. Dos rondas.

Drill con restricción 2 (15 min): mismo juego. Agregamos: si lográs 3 drives profundos seguidos sin error, sumás un punto bonus. Trabaja consistencia bajo presión.

Juego libre con reflexión (15 min): partido normal. El coach observa cuántas veces el alumno busca el cruzado profundo sin que nadie se lo pida.

Cierre (5 min): "¿En qué momento del partido sentiste que el cruzado te dio ventaja real?"

---

**Clase 2 — Introducción al juego en red (adultos principiantes, 60 min)**

Objetivo: entender cuándo subir a la red y ejecutar una volea básica.

Juego inicial (10 min): "mini-tenis en el cuadro de servicio": rally desde el cuadro de servicio. Solo pelotas que boten dentro del cuadro dan punto. Sin canasto, sin corrección. El alumno aprende el control del espacio jugando.

Situación de juego (20 min): rally normal desde el fondo. Regla: si lográs que tu pelota caiga corta y subís a la red en ese punto, el punto vale doble. El alumno descubre solo cuándo es el momento de subir.

Drill puntual de volea (15 min): canasto breve de voleas. El coach muestra la posición de la raqueta y el movimiento corto. 10-15 bolas por alumno. Feedback específico.

Juego integrado (10 min): vuelven al juego anterior. El alumno aplica la volea con lo que acaba de practicar.

Cierre (5 min): "¿Cuántas veces subiste a la red? ¿En cuáles te sentiste cómodo?"

---

**Clase 3 — Saque con dirección (niños Escuela, 45 min)**

Objetivo: mejorar la dirección del saque (T o cuerpo).

Calentamiento lúdico (10 min): "El semáforo": el profe dice un color antes de cada saque. Rojo = T, verde = cuerpo. El alumno tiene que sacar en esa dirección. Sin consecuencia por errar — el juego es seguir el semáforo.

Juego de precisión (15 min): "El cuadrado del campeón": con conos marcamos dos zonas en el cuadro de saque. El alumno elige la zona antes de sacar. Si entra en la zona elegida suma 2, si entra en la otra suma 1, si doble falta no suma. Juegan a 10 puntos. La competencia es consigo mismo.

Competencia grupal (15 min): en equipos de 2, turnan saques. Gana el equipo que primero llegue a 15 puntos. Ahora hay presión grupal — cada saque importa para el equipo.

Cierre (5 min): "¿Cuál zona les salió mejor? ¿Por qué creen que es más fácil esa?"`,
      },
    ],
    quiz: [
      {
        pregunta: '¿Por qué la práctica bloqueada (mismo golpe repetido en las mismas condiciones) tiene menor transferencia al partido que el juego?',
        opciones: [
          'Porque el alumno se aburre y no se concentra',
          'Porque el cerebro aprende a ejecutar en ese contexto específico pero no desarrolla los sistemas de percepción, decisión y adaptación que el partido requiere',
          'Porque el canasto tiene pelotas más livianas que las de partido',
          'Porque el alumno no tiene adversario',
        ],
        correcta: 1,
      },
      {
        pregunta: '¿Cuál es el principio central del Game-Based Learning que lo diferencia del enfoque tradicional?',
        opciones: [
          'Que el alumno juega más tiempo por clase',
          'Que se eliminan los drills técnicos por completo',
          'Que el juego es el vehículo principal del aprendizaje — la técnica se enseña como respuesta a un problema que el juego genera',
          'Que el coach no interviene nunca durante la clase',
        ],
        correcta: 2,
      },
      {
        pregunta: 'Tenés un alumno adulto principiante que no logra darle profundidad al drive. ¿Cuál de estas opciones aplica mejor el GBL?',
        opciones: [
          '20 minutos de canasto corrigiendo la técnica del drive',
          'Peloteo competitivo donde solo suman los drives que caen más allá de la línea del servicio — la regla genera el objetivo sin corrección verbal',
          'Ver un video de un drive profesional y replicarlo',
          'Decirle "tirá más profundo" cada vez que la pelota cae corta',
        ],
        correcta: 1,
      },
      {
        pregunta: '¿Cuál es el efecto de la "interferencia contextual" en el aprendizaje motor?',
        opciones: [
          'Genera más errores al principio pero una memoria motora más sólida a largo plazo',
          'Mejora el rendimiento inmediato pero no tiene efecto a largo plazo',
          'Es perjudicial para principiantes y útil solo para avanzados',
          'Reduce el número de errores en las primeras sesiones',
        ],
        correcta: 0,
      },
      {
        pregunta: 'En una clase de GBL, ¿cuándo es el momento correcto para hacer una corrección técnica verbal?',
        opciones: [
          'Cada vez que el alumno comete un error de técnica',
          'Al principio de la clase, antes de empezar a jugar',
          'Nunca — en el GBL no se corrige la técnica',
          'Cuando hay un error técnico específico que limita al alumno y no va a resolverse con el juego solo',
        ],
        correcta: 3,
      },
      {
        pregunta: 'Diseñás un juego para un grupo de niños de Escuela con objetivo "dirección del drive". ¿Cuál de estas opciones es más apropiada?',
        opciones: [
          'Explicación de 10 minutos sobre la biomecánica del drive cruzado',
          'Canasto de 30 drives cruzados con corrección después de cada uno',
          '"Zonas de colores": el profe grita el color de la zona antes del punto y el alumno tiene que mandar la pelota a esa zona',
          'Partido libre sin restricciones para que descubran solos',
        ],
        correcta: 2,
      },
      {
        pregunta: '¿Cuál es el indicador más claro de que una clase de GBL funcionó?',
        opciones: [
          'Que el alumno hizo todos los ejercicios sin errores',
          'Que el alumno aplica en el juego libre lo que trabajó en el juego con restricciones, sin que nadie se lo indique',
          'Que el alumno se divirtió durante la clase',
          'Que el coach no tuvo que intervenir en ningún momento',
        ],
        correcta: 1,
      },
    ],
  },
]

export function getCurso(id: string): Curso | undefined {
  return CURSOS.find(c => c.id === id)
}
