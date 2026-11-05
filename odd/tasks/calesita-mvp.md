# Feature: calesita-mvp

Objective: build Calesita, a party-games web MVP with five playable games, in the six stages the user defined.
Branch: `feat/calesita-mvp`. Delivery: `exception-ok` (no remote configured, so no PRs; push, PR and merge stay user decisions). Test runner: none in Stage 1; Vitest arrives with the first game logic in Stage 3.
Engram mirror `odd/calesita-mvp/tasks`: PENDING (Engram tools were not available this session).

## Specs

The full wording of every requirement is in `L1`; each spec quotes its stage and points to the L1 sections it owns.

- S1 "Etapa 1 — Fundación": "Inicializar Next.js." "Instalar dependencias." "Configurar Tailwind y shadcn/ui." "Crear estructura." "Configurar identidad visual." Owns L1 §2, §3, §9.
- S2 "Etapa 2 — Catálogo": "Home." "Navegación." "Tarjetas de juegos." "Filtros." "Página de detalle." "Botón Sorprendeme." Owns L1 §4.
- S3 "Etapa 3 — Primer juego": "Implementar ¿Quién es más probable que...?" "Crear el sistema de consignas." "Añadir navegación entre tarjetas." "Probar la experiencia completa." Owns L1 §5 JUEGO 1, §8.
- S4 "Etapa 4 — Componentes y juegos": "Crear cronómetro." "Crear sistema de jugadores." "Crear equipos." "Crear puntuaciones." "Implementar Actuá o perdés, Desafío relámpago y Categorías explosivas." Owns L1 §5 JUEGOS 2, 4, 5, §6.
- S5 "Etapa 5 — Información secreta": "Implementar El infiltrado." "Probar el flujo de revelado de palabras entre jugadores." "Completar votaciones y resultados." Owns L1 §5 JUEGO 3.
- S6 "Etapa 6 — Calidad y publicación": "Revisar responsive." "Corregir errores." "Ejecutar lint, TypeScript y build." "Crear README." "Preparar despliegue en Vercel." Owns L1 §7, §12.
- S7 Cross-stage rules: "No avances a una etapa posterior dejando errores conocidos en la anterior." "Después de cada etapa, indicá qué se implementó, cómo probarlo y qué sigue." "No afirmes que algo funciona si no pudiste ejecutarlo o verificarlo."

## Tasks

- [ ] T1 S1 inline: Next.js, Tailwind, shadcn/ui, base structure, visual identity. Evidence: pending.
- [ ] T2 S2 inline: home, catalog, filters, detail page, Sorprendeme.
- [ ] T3 S3 inline: prompt system and first game.
- [ ] T4 S4 inline: timer, players, teams, scoring, three games.
- [ ] T5 S5 inline: El infiltrado.
- [ ] T6 S6 inline: quality pass, README, Vercel readiness.

Route evidence: every task is inline because no Writer trigger reason exists yet; stages depend on each other, so they are not parallel units.

## Log

- L1 (2026-11-04, user's original request, verbatim):

````markdown
# PROYECTO: CALESITA 🎠

Actuá como un Senior Full-Stack Developer, Game Designer, UI/UX Designer y Product Engineer especializado en aplicaciones web modernas.

Quiero que me ayudes a diseñar y desarrollar desde cero una aplicación web llamada **Calesita**.

Tu objetivo es construir un MVP funcional, visualmente atractivo, bien estructurado, responsive y preparado para escalar.

No quiero solamente una landing page o un prototipo visual. Quiero una aplicación real con juegos que funcionen.

## 1. CONCEPTO DEL PRODUCTO

**Nombre:** Calesita

**Eslogan:** La juntada sigue girando.

**Concepto:** Una plataforma web de party games para jugar con amigos cuando estamos reunidos físicamente.

El problema que buscamos resolver es simple:

Estamos en una juntada con amigos, no sabemos qué hacer, entramos a Calesita, elegimos un juego y empezamos a divertirnos.

IMPORTANTE:

Calesita NO es una plataforma de videojuegos tradicionales.

Los juegos ocurren principalmente en la vida real. La web funciona como anfitrión, organizador y moderador de las partidas.

Sus responsabilidades son:

- Mostrar consignas y tarjetas.
- Explicar las reglas.
- Generar desafíos aleatorios.
- Organizar turnos y rondas.
- Controlar cronómetros.
- Asignar roles secretos.
- Llevar puntuaciones cuando corresponda.
- Permitir empezar nuevos juegos fácilmente.

Debe ser posible jugar utilizando un solo celular o una computadora compartida.

No necesitamos multijugador online en tiempo real.

## 2. STACK TECNOLÓGICO

Utilizar:

- Next.js con App Router.
- TypeScript.
- Tailwind CSS.
- shadcn/ui.
- Lucide React para iconografía.
- React Hooks.
- localStorage para persistencia inicial.

No utilizar Supabase, Firebase ni bases de datos en el MVP.

No implementar autenticación inicialmente.

No incorporar dependencias innecesarias.

Priorizar código limpio, reutilizable y fácil de mantener.

## 3. IDENTIDAD VISUAL

Quiero una experiencia visual moderna, divertida y con mucho carácter.

La referencia conceptual es una mezcla entre:

- Party games modernos.
- Juegos de mesa.
- Plataformas de entretenimiento.
- Interfaces de productos digitales premium.

Estilo:

- Dark mode por defecto.
- Fondo oscuro con tonalidades violetas.
- Violeta como color principal.
- Acentos en naranja, amarillo, rosa y turquesa.
- Tarjetas grandes y llamativas.
- Bordes redondeados.
- Tipografía moderna.
- Animaciones sutiles.
- Ilustraciones y elementos gráficos relacionados con cada juego.
- Microinteracciones divertidas.

Evitar que parezca un dashboard empresarial o una plantilla genérica de SaaS.

Quiero que se sienta como un producto de entretenimiento real.

Debe funcionar perfectamente tanto en desktop como en mobile.

La navegación y los controles de las partidas deben estar especialmente optimizados para celular.

## 4. ESTRUCTURA PRINCIPAL

### HOME

La página principal debe incluir:

- Logo de Calesita.
- Eslogan.
- Hero atractivo.
- Botón principal "Empezar a jugar".
- Botón "Sorprendeme".
- Juegos destacados.
- Categorías.
- Acceso al catálogo completo.

El botón "Sorprendeme" debe seleccionar un juego disponible, compatible con la cantidad de participantes configurada si se conoce.

### CATÁLOGO

Mostrar 15 juegos organizados en tres categorías:

**Clásicos**
1. Actuá o perdés
2. Palabras prohibidas
3. Preguntados Calesita
4. Dibujalo como puedas
5. Categorías explosivas

**Sociales**
6. El infiltrado
7. ¿Quién es más probable que...?
8. Mentira o verdad
9. Defendé lo indefendible
10. Confesiones anónimas

**Desafíos físicos**
11. Desafío relámpago
12. Búsqueda desesperada
13. Estatuas imposibles
14. Un minuto para ganar
15. Olimpiadas Calesita

Cada juego debe tener:

- Nombre.
- Descripción breve.
- Categoría.
- Cantidad mínima y máxima de jugadores.
- Duración aproximada.
- Materiales necesarios.
- Dificultad.
- Imagen o ilustración distintiva.
- Estado: disponible o próximamente.

Agregar filtros por categoría, cantidad de jugadores, duración y materiales.

Los juegos todavía no implementados deben mostrarse como "Próximamente", sin botones engañosos que aparenten iniciar partidas.

## 5. JUEGOS FUNCIONALES DEL MVP

Desarrollar completamente estos cinco juegos:

### JUEGO 1: ¿QUIÉN ES MÁS PROBABLE QUE...?

Un juego social para romper el hielo.

Funcionamiento:

1. Los jugadores indican cuántas personas participan.
2. Aparece una pregunta aleatoria.
3. Todos señalan al mismo tiempo al amigo que mejor encaja.
4. Se muestra un pequeño contador para hacer la votación simultánea.
5. El grupo puede debatir.
6. Se pasa a la siguiente pregunta.

Ejemplos:

- ¿Quién es más probable que llegue tarde a su propio cumpleaños?
- ¿Quién sobreviviría menos tiempo en una isla desierta?
- ¿Quién se haría famoso por accidente?
- ¿Quién organizaría un viaje y se olvidaría de reservar el alojamiento?
- ¿Quién sería eliminado primero de un reality show?

Incluir inicialmente al menos 50 preguntas variadas.

Este juego no necesita puntuación obligatoria.

### JUEGO 2: ACTUÁ O PERDÉS

Juego de mímica.

Funcionamiento:

1. Elegir cantidad de jugadores.
2. Crear dos equipos.
3. Definir la duración de cada turno.
4. Mostrar una consigna secreta al participante que actúa.
5. Iniciar el cronómetro.
6. El jugador debe representar la consigna sin hablar.
7. Su equipo intenta adivinar.
8. Registrar acierto o pasar.
9. Al terminar el tiempo, cambiar de equipo.
10. Después de las rondas configuradas, mostrar el ganador.

Incluir al menos 50 consignas.

Categorías sugeridas: películas, personajes, acciones, situaciones absurdas y objetos.

### JUEGO 3: EL INFILTRADO

Juego de deducción social.

Funcionamiento:

1. Configurar entre 4 y 12 participantes.
2. Ingresar nombres opcionalmente.
3. Generar una partida con una pareja de palabras relacionadas.
4. Asignar aleatoriamente una palabra a la mayoría y otra al infiltrado.
5. Pasar el dispositivo de jugador en jugador.
6. Cada participante revela su palabra individualmente.
7. Ocultar completamente la palabra antes de pasar el dispositivo.
8. Comenzar la ronda presencial de pistas.
9. Los jugadores dan pistas sin mencionar sus palabras.
10. El grupo debate y vota presencialmente.
11. Registrar el jugador elegido.
12. Revelar quién era el infiltrado.
13. Determinar el resultado.

Incluir al menos 40 parejas de palabras.

Es fundamental impedir que el siguiente jugador vea la información secreta del anterior.

Utilizar un sistema claro de "Revelar", "Ocultar" y "Pasar al siguiente".

### JUEGO 4: DESAFÍO RELÁMPAGO

Juego de desafíos físicos y sociales.

Funcionamiento:

1. Elegir cantidad de jugadores.
2. Seleccionar dificultad.
3. Mostrar un desafío aleatorio.
4. Mostrar instrucciones.
5. Iniciar cronómetro cuando corresponda.
6. Permitir marcar el desafío como completado o fallido.
7. Continuar a otro desafío.

Ejemplos:

- Mantenerse en un pie durante 30 segundos.
- Imitar a un integrante del grupo.
- Construir una torre con cinco objetos disponibles.
- Representar una película usando solamente sonidos.
- Inventar un comercial de 20 segundos para un objeto de la habitación.

Incluir al menos 50 desafíos.

Evitar retos peligrosos, humillantes u obligatorios. Permitir saltar cualquier desafío.

### JUEGO 5: CATEGORÍAS EXPLOSIVAS

Juego de velocidad mental.

Funcionamiento:

1. Seleccionar cantidad de jugadores.
2. Mostrar una categoría aleatoria.
3. El primer jugador dice un elemento de esa categoría.
4. El turno pasa al siguiente jugador.
5. Nadie puede repetir una respuesta.
6. Hay un temporizador configurable por turno.
7. Si alguien repite, se equivoca o se queda sin tiempo, pierde una vida.
8. Registrar manualmente el resultado de cada turno.
9. El último jugador con vidas gana.

Ejemplos de categorías:

- Cosas que hay en una cocina.
- Excusas para llegar tarde.
- Países.
- Marcas de autos.
- Cosas que no deberías decir en una entrevista de trabajo.
- Objetos que llevarías a una isla desierta.

Incluir al menos 60 categorías.

## 6. COMPONENTES COMPARTIDOS

Crear componentes reutilizables para:

- GameCard.
- GameFilters.
- GameInstructions.
- GameSetup.
- GameTimer.
- PromptCard.
- SecretReveal.
- RoundIndicator.
- Scoreboard.
- GameResults.
- ConfirmDialog.
- ProgressIndicator.

Crear hooks y utilidades para:

- Selección aleatoria.
- Barajar consignas.
- Evitar repeticiones.
- Manejo del cronómetro.
- Gestión de turnos.
- Estado de las partidas.
- Persistencia local.

Diseñar la lógica para que un nuevo juego pueda incorporarse sin modificar innecesariamente los existentes.

## 7. EXPERIENCIA DE USUARIO

Priorizar estos principios:

**Jugar rápido:** entrar al sitio y comenzar un juego en muy pocos pasos.

**Reglas claras:** explicaciones breves, con ejemplos cuando sea necesario.

**Un solo dispositivo:** no exigir que todos los jugadores tengan un celular.

**Sin registro:** el usuario debe poder jugar inmediatamente.

**Partidas fluidas:** controles grandes para avanzar, pausar o finalizar.

**Cero confusión:** siempre debe quedar claro qué hacer a continuación.

**Mobile first:** botones accesibles, tipografía legible y buen contraste.

Agregar confirmaciones cuando una acción pueda borrar el progreso de una partida.

No generar consignas duplicadas dentro de la misma sesión hasta agotar el contenido disponible.

## 8. CONTENIDO Y PERSONALIZACIÓN FUTURA

El contenido inicial debe estar almacenado en archivos estructurados de TypeScript o JSON.

Utilizar identificadores únicos para consignas y tarjetas.

Diseñar modelos de datos que permitan incorporar más adelante:

- Preguntas creadas por usuarios.
- Grupos de amigos.
- Nombres y apodos.
- Anécdotas internas.
- Paquetes temáticos.
- Favoritos.
- Estadísticas.
- Historial de partidas.
- Rankings.

No desarrollar todavía autenticación ni paneles de administración.

## 9. ARQUITECTURA Y CALIDAD

Quiero una estructura de carpetas clara y escalable.

Separar:

- Componentes visuales.
- Lógica de juego.
- Contenido.
- Tipos.
- Hooks.
- Utilidades.
- Rutas.

Usar TypeScript de forma estricta.

Evitar código duplicado y componentes gigantes.

Agregar manejo de errores y estados vacíos.

Asegurar que los cronómetros limpien correctamente sus intervalos y que las partidas se comporten bien al pausar o actualizar la página.

Utilizar almacenamiento local con validación y versionado de datos cuando sea necesario.

Incluir accesibilidad básica: botones semánticos, navegación por teclado, etiquetas y contraste adecuado.

## 10. FLUJO DE DESARROLLO

No intentes construir toda la aplicación en un único bloque de código.

Trabajá en etapas, entregando código funcional y verificable.

**Etapa 1 — Fundación**
- Inicializar Next.js.
- Instalar dependencias.
- Configurar Tailwind y shadcn/ui.
- Crear estructura.
- Configurar identidad visual.

**Etapa 2 — Catálogo**
- Home.
- Navegación.
- Tarjetas de juegos.
- Filtros.
- Página de detalle.
- Botón Sorprendeme.

**Etapa 3 — Primer juego**
- Implementar ¿Quién es más probable que...?
- Crear el sistema de consignas.
- Añadir navegación entre tarjetas.
- Probar la experiencia completa.

**Etapa 4 — Componentes y juegos**
- Crear cronómetro.
- Crear sistema de jugadores.
- Crear equipos.
- Crear puntuaciones.
- Implementar Actuá o perdés, Desafío relámpago y Categorías explosivas.

**Etapa 5 — Información secreta**
- Implementar El infiltrado.
- Probar el flujo de revelado de palabras entre jugadores.
- Completar votaciones y resultados.

**Etapa 6 — Calidad y publicación**
- Revisar responsive.
- Corregir errores.
- Ejecutar lint, TypeScript y build.
- Crear README.
- Preparar despliegue en Vercel.

No avances a una etapa posterior dejando errores conocidos en la anterior.

## 11. INSTRUCCIONES DE COLABORACIÓN

Quiero que trabajemos como si estuviéramos construyendo un producto real.

Tomá decisiones razonables cuando falten detalles menores.

Priorizá la simplicidad y el funcionamiento por encima de la complejidad técnica.

Antes de implementar, explicame brevemente la arquitectura y el plan de trabajo.

Después comenzá con la primera etapa.

Cuando estés trabajando dentro de mi repositorio, creá y modificá los archivos directamente, si tenés acceso.

No me des solamente pseudocódigo.

Después de cada etapa, indicá qué se implementó, cómo probarlo y qué sigue.

No afirmes que algo funciona si no pudiste ejecutarlo o verificarlo.

## 12. OBJETIVO FINAL

Quiero poder abrir Calesita en una juntada con siete amigos, elegir entre diferentes juegos y comenzar a jugar sin descargar nada, registrarme ni configurar sistemas complejos.

La plataforma tiene que ser:

- Divertida.
- Visualmente atractiva.
- Intuitiva.
- Rápida.
- Fácil de ampliar.
- Verdaderamente funcional.

**Empezá presentando la arquitectura propuesta y desarrollando la Etapa 1 del proyecto.**
````
