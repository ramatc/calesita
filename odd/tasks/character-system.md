# Feature: character-system

Objective: make the seven friends part of Calesita's identity through a shared illustrated rig, an optional cast selection, and in-game avatars, with no change to game rules.
Branch: `feat/calesita-characters`, based on `feat/calesita-mvp`. Delivery: `exception-ok`, as in the two previous features; PR and merge stay user decisions. Test runner: Vitest, plus headless Chrome renders kept in the session scratchpad.
Engram mirror `odd/character-system/tasks`: PENDING (Engram tools are not available this session).

## Specs

The full wording of every requirement is in `L1`.

- S1 Art direction and the seven characters: owns L1 §1 and §2. "todos los personajes deben compartir exactamente el mismo lenguaje visual." "Nunca mostrar alturas numéricas en la interfaz." "No inventar rasgos físicos específicos que no hayan sido indicados."
- S2 Data and components: owns L1 §3. "ID. Nombre. Color principal. Color secundario. Ruta del avatar. Accesorios visuales. Estado de disponibilidad." "Crear un componente CharacterAvatar reutilizable." "Crear un componente CharacterSelector con tarjetas visuales."
- S3 Optional selection: "Permitir seleccionar personajes de forma opcional antes de iniciar partidas compatibles." "No obligar a todos los usuarios a elegir un personaje." "La experiencia de empezar a jugar debe seguir siendo muy rápida."
- S4 Integration: owns L1 §4. "Selección de jugadores. Pantallas de inicio de partida. Turnos. Puntuaciones. Resultados. Rankings futuros. Ilustraciones decorativas de la home."
- S5 Assets: owns L1 §5. "preparar el sistema para recibir archivos SVG o PNG transparentes." "No sustituir las ilustraciones definitivas por emojis genéricos como solución final." "trabajar primero en una hoja de personajes conjunta" "Preparar la arquitectura para utilizar más adelante diferentes expresiones y poses."
- S6 Constraints: "No modificar las reglas de los minijuegos." "No implementar autenticación." "No agregar una base de datos." "Preservar toda la funcionalidad existente."

## Tasks

- [x] T1 S1 S5 inline: shared SVG rig, seven characters, joint sheet, asset folders. Evidence: L4.
- [x] T2 S2 S5 inline: data model, asset resolver, cast stores, CharacterAvatar. Evidence: L4.
- [x] T3 S2 S3 inline: CharacterSelector and optional setup selection. Evidence: L4.
- [x] T4 S4 S6 inline: turns, scores, results, home lineup. Evidence: L4.

Route evidence: every task is inline; the tasks depend on each other, so no Writer trigger reason exists.

## Log

- L1 (2026-11-06, user's request, verbatim):

````markdown
# CALESITA — SISTEMA DE PERSONAJES E IDENTIDAD DEL GRUPO

Quiero incorporar a Calesita un sistema de personajes ilustrados basado en los siete amigos que forman nuestro grupo.

La aplicación ya existe y estamos desarrollando un rediseño bajo la dirección visual "Premium Playground".

El objetivo es que los personajes formen parte de la identidad de marca y de la experiencia de juego, sin transformar Calesita en un videojuego tradicional.

## 1. DIRECCIÓN ARTÍSTICA

Crear un universo de siete personajes 2D estilo cartoon premium.

Inspiración visual:
- Party games modernos.
- Ilustraciones vectoriales de videojuegos independientes.
- Personajes expresivos con proporciones estilizadas.
- Diseño de personajes reconocibles a partir de siluetas, peinados, ropa y accesorios.

Características:
- Cabezas ligeramente grandes.
- Formas redondeadas.
- Siluetas distintivas.
- Expresiones simpáticas.
- Paleta vibrante.
- Contornos consistentes.
- Sombras simples.
- Detalles suficientes para distinguir cada personaje.

IMPORTANTE: todos los personajes deben compartir exactamente el mismo lenguaje visual.

No quiero personajes realistas, renders 3D, fotografías ni avatares genéricos.

Las alturas indicadas son exclusivamente una referencia para sus proporciones relativas. Nunca mostrar alturas numéricas en la interfaz.

## 2. LOS SIETE PERSONAJES

**RAMA**
- Altura de referencia: 176 cm.
- Pelo negro corto.
- Arito en la ceja.
- Corte en una ceja.
- Ropa oversized estilo streetwear/rap.
- Actitud relajada.
- Colores: violeta y amarillo.

**AGUYSAN**
- Altura de referencia: 185 cm.
- Pelo rubio.
- Nariz grande y reconocible.
- Silueta alta.
- Expresión simpática.
- Colores: naranja y crema.

**NEHUE**
- Altura de referencia: 176 cm.
- Pelo castaño.
- Hincha de Racing.
- Aficionado al gimnasio.
- Contextura atlética.
- Ropa celeste y blanca.
- Accesorio: mancuerna.

**PILI**
- Altura de referencia: 160 cm.
- Pelo oscuro.
- Anteojos.
- Silueta bajita.
- Accesorio: cerveza.
- Colores: rosa y bordó.

**PIKU**
- Altura de referencia: 160 cm.
- Pelo rubio.
- Ojos celestes.
- Silueta bajita.
- Actitud relajada.
- El cigarrillo puede ser un rasgo visual opcional, pero no debe ser imprescindible para identificarla.
- Colores: turquesa y amarillo pastel.

**CHINO**
- Altura de referencia: 180 cm.
- Pelo castaño.
- Fanático del fútbol.
- Hincha de River.
- Camiseta blanca con banda roja, inspirada en el club.
- Accesorio: pelota de fútbol.

**AGUSMAXI**
- Altura de referencia: 185 cm.
- Pelo castaño/rubio.
- Hincha de Vélez.
- Fanático de las hamburguesas.
- Ropa inspirada en los colores azul y blanco.
- Accesorio: hamburguesa.

No inventar rasgos físicos específicos que no hayan sido indicados. Si hacen falta detalles menores, utilizar decisiones estilísticas neutras.

## 3. SISTEMA DE AVATARES

Diseñar la estructura de datos de personajes incluyendo:

- ID.
- Nombre.
- Color principal.
- Color secundario.
- Ruta del avatar.
- Accesorios visuales.
- Estado de disponibilidad.

Crear un componente CharacterAvatar reutilizable.

Crear un componente CharacterSelector con tarjetas visuales.

Permitir seleccionar personajes de forma opcional antes de iniciar partidas compatibles.

No obligar a todos los usuarios a elegir un personaje.

## 4. INTEGRACIÓN CON CALESITA

Los personajes deben poder utilizarse en:

- Selección de jugadores.
- Pantallas de inicio de partida.
- Turnos.
- Puntuaciones.
- Resultados.
- Rankings futuros.
- Ilustraciones decorativas de la home.

No convertir los avatares en una mecánica obligatoria.

La experiencia de empezar a jugar debe seguir siendo muy rápida.

## 5. ASSETS VISUALES

Antes de implementar, revisar los assets disponibles.

Si no existen ilustraciones definitivas, preparar el sistema para recibir archivos SVG o PNG transparentes.

No sustituir las ilustraciones definitivas por emojis genéricos como solución final.

No generar automáticamente siete personajes inconsistentes entre sí.

Si se dispone de herramientas de generación visual, trabajar primero en una hoja de personajes conjunta para garantizar uniformidad.

Preparar la arquitectura para utilizar más adelante diferentes expresiones y poses.

## 6. IMPLEMENTACIÓN

Primero:
1. Revisar el proyecto existente.
2. Definir el modelo de datos.
3. Crear los componentes reutilizables.
4. Integrar la selección opcional de personajes.
5. Preparar las ubicaciones de los assets.
6. Aplicar la identidad Premium Playground.

No modificar las reglas de los minijuegos.

No implementar autenticación.

No agregar una base de datos.

Preservar toda la funcionalidad existente.

Quiero que los siete personajes se conviertan en parte de la identidad de Calesita y que el sistema pueda ampliarse con nuevas ilustraciones y expresiones en el futuro.
````

- L2 Decisions: no character assets existed and no image generator is available, so the art comes from one parametric SVG rig in `scripts/characters/`: same head, eye, outline, and shadow for all seven, drawn together first on `public/characters/sheet.svg`. Heights live only in the rig as proportions; they never reach app data, and a test pins that. All skin uses one neutral tone because none was specified; hair length and hair shape are neutral style choices. Club references are shirt colors and patterns only, with no crests. Piku has no cigarette, because the brief makes it optional and the character reads without it.
- L3 Decisions: game state and reducers do not know about characters. The selection is a roster of tap-ordered ids; each start locks it into a separate cast keyed by game slug and seat id, so a roster edit cannot rewrite a game in progress. A chosen seat takes the character's name over a typed name, so an avatar and a name cannot disagree. The selector is a closed disclosure on setup. Quién es más probable que is not compatible: it tracks a count, not players. Actuá o perdés seats alternate between teams, so the selector says so and the handoff, scores, and win screen show the team's characters. Results and the life-lost line already request `celebrating` and `sad`, which fall back to the base portrait until that art exists. "Rankings futuros" gets only the reusable avatar and catalog; no ranking was built.
- L4 Evidence: RED on the missing catalog and cast modules, then GREEN; 216 unit tests, lint, typecheck, build, and detector pass. Browser checks on the production build: full Categorías game with three characters to a win; Actuá o perdés handoff and scores with team stacks; Desafío with seven characters plus one unnamed seat, at 390 px in an iframe, with no overflow; no-character Desafío game keeps "Jugador 1", shows no avatar, and reaches results; full-seat blocking and swap; missing art shows the initial, proven with a path that never existed (an earlier attempt with a moved file was inconclusive because of the image cache). Not checked: real devices, Actuá o perdés win screen with a team, the 320 px selector.
