# Feature: premium-redesign

Objective: evolve the Calesita interface into the "Premium Playground" visual system without changing game logic, routes, or data.
Branch: `feat/calesita-mvp`, remote `origin`. Delivery: `exception-ok` (same branch as the MVP; PR and merge stay user decisions). Test runner: Vitest, plus scripted Chrome flows kept in the session scratchpad.
Engram mirror `odd/premium-redesign/tasks`: PENDING (Engram tools were not available this session).

## Specs

The full wording of every requirement is in `L1`; each spec quotes its phase and points to the L1 sections it owns.

- S1 "Fase 1: Design tokens, tipografía y componentes base." Owns L1 §3, §4, and the base pieces of §6.
- S2 "Fase 2: Navbar y hero." Owns L1 §5 Navegación and Hero.
- S3 "Fase 3: Tarjetas, catálogo y categorías." Owns L1 §5 Juegos destacados and Categorías.
- S4 "Fase 4: Pantallas internas de juegos." Owns L1 §7.
- S5 "Fase 5: Animaciones, responsive y pulido." Owns L1 §6 Motion and §10.
- S6 Cross-phase rules: "No recrees el proyecto desde cero." "No elimines funcionalidades existentes." "No modifiques la lógica de los minijuegos salvo que sea estrictamente necesario." "No cambies rutas ni estructuras de datos sin justificación." "No agregues funcionalidades que no forman parte del rediseño visual." "No afirmes haber verificado algo que no pudiste ejecutar."

## Tasks

- [x] T1 S1 inline: tokens, type, and base components. Evidence: lint, typecheck, build and 189 unit tests pass; 37 game, 31 first-game and 20 catalog browser checks pass, with 2 stale catalog checks that expect the removed no-games message; measured contrast pairs are all at least 4.5:1. Test-first exception: visual tokens have no meaningful RED.
- [x] T2 S2 inline: navbar and hero. Evidence: lint, typecheck, build, 189 unit tests and detector pass; 25 scripted browser checks pass at 1280, 1024, 820, 390 and 360 px (no overflow, two-line headline, selector, persistence, menu, Categorías anchor, Sorprendeme, reduced motion, no console errors). The game flows were not rerun because no game code changed. Unverified: the navbar empty message, unreachable today because every count from 2 to 20 has a game. Test-first exception: visual composition has no meaningful RED.
- [x] T3 S3 inline: cards, catalog, categories. Evidence: RED then GREEN on `groupByAvailability`; lint, typecheck, build, 190 unit tests and detector pass; 15 card checks (hover, keyboard focus, ticket and Jugar links, category links, filter, reduced motion, no console errors), 18 catalog, 31 first-game and 37 game browser checks pass; no horizontal overflow at 1280, 820 and 390 px. The catalog flow script was corrected first: its home block expected the stepper and empty message removed earlier, and its count selector hit the navbar status. Test-first exception: visual composition has no meaningful RED.
- [ ] T4 S4: in-game screens.
- [ ] T5 S5: motion, responsive, polish.

Route evidence: T1, T2 and T3 are inline because no Writer trigger reason exists; later tasks are decided when they start.

## Log

- L1 (2026-11-05, user's request, verbatim):

````markdown
# CALESITA — PREMIUM UI/UX REDESIGN

Actuá como un Senior Product Designer, Creative Developer y Frontend Engineer especializado en experiencias digitales premium, interfaces de juegos y diseño web interactivo.

Estoy desarrollando **Calesita**, una plataforma de party games para jugar con amigos en reuniones presenciales.

La aplicación YA EXISTE, está desarrollada con Next.js y tiene una identidad visual definida.

Quiero que rediseñes su experiencia visual para llevarla a un nivel mucho más premium y profesional, sin perder su personalidad divertida.

## 1. OBJETIVO

Transformar la interfaz actual en una experiencia visual de alta calidad que combine:

- Premium playful design.
- Modern arcade aesthetics.
- Digital board game interfaces.
- Editorial web design.
- Microinteracciones y motion design.

El resultado debería sentirse como un producto digital creado por un estudio de diseño de primer nivel, pero sin perder la cercanía y el humor propios de Calesita.

No quiero una landing genérica de SaaS.

No quiero un dashboard empresarial.

Tampoco quiero un sitio infantil o excesivamente caricaturesco.

Busco una identidad divertida, madura, distintiva y con excelente ejecución visual.

## 2. REFERENCIAS DE DISEÑO

Analizá estas referencias, si tenés acceso a ellas:

**Propaganda — Party Game**
https://dribbble.com/shots/27011239-Propaganda-Landing-Page-Redesign-Concept

Referencia para identidad fuerte, composiciones atrevidas y tratamiento ilustrativo.

**Playdate — Design System**
https://styles.refero.design/style/2175034b-96d7-417e-886f-ff5a4d8551ae

Referencia para jerarquía, composición editorial, contraste y presentación premium de juegos.

**Core Gaming — Dynamic Cards**
https://dribbble.com/shots/26726309-AI-Landing-page-web-design-cards-overview-Core-Gaming

Referencia para tarjetas de juegos, profundidad, composiciones superpuestas y transiciones.

**Card Game Website — Soft Light Team**
https://dribbble.com/shots/19886236-Card-Game-Website-Concept

Referencia para fondos oscuros, ilustraciones protagonistas y atmósfera visual.

**Discord — Design System**
https://styles.refero.design/style/faec4b0c-cf93-4150-97de-0a8e7eed1840

Referencia para coherencia visual, lenguaje gaming, ilustraciones y control de los colores de acento.

No copies literalmente ninguna referencia. Utilizalas para inspirar un sistema visual original para Calesita.

## 3. IDENTIDAD QUE DEBEMOS CONSERVAR

Mantener:

- Nombre Calesita.
- Eslogan "La juntada sigue girando".
- Fondo violeta oscuro.
- Amarillo característico.
- Rosa, turquesa y naranja como acentos.
- Concepto de feria/calesita.
- Personajes y elementos ilustrados.
- Tono divertido y cercano.

La identidad actual es buena y no quiero reemplazarla.

Quiero evolucionarla.

Podés refinar proporciones, tipografías, colores, espaciados y estilo gráfico para conseguir un resultado superior.

## 4. NUEVA DIRECCIÓN VISUAL

Nombre conceptual: **Premium Playground**.

Paleta sugerida:

- Background: #130A24
- Surface: #211437
- Elevated Surface: #30204B
- Primary Yellow: #FFD12F
- Pink: #FF62AB
- Turquoise: #31D4C5
- Lavender: #AB8CFF
- Cream: #FFF9ED

Utilizar la paleta como punto de partida y ajustar contrastes cuando sea necesario.

Tipografía:

- Conservar la personalidad distintiva del logotipo.
- Utilizar una sans-serif moderna y muy legible para la interfaz.
- Títulos grandes, con buena jerarquía.
- Excelente legibilidad en las descripciones.
- Evitar textos demasiado pequeños.

Superficies:

- Fondos oscuros con distintas profundidades.
- Gradientes sutiles.
- Iluminación controlada.
- Bordes y sombras refinados.
- Uso intencional de espacios negativos.

Evitar glassmorphism excesivo, brillos exagerados y gradientes genéricos.

## 5. REDISEÑO DE HOME

Reestructurá el inicio.

### Navegación

Crear un navbar profesional con:

- Logotipo Calesita.
- Juegos.
- Categorías.
- Selector de jugadores.
- Acción principal cuando corresponda.

Debe funcionar correctamente en mobile.

### Hero

Rediseñar completamente el hero manteniendo el universo de la calesita.

Probar una composición con:

- Titular principal de alto impacto.
- Subtítulo breve.
- CTA "Explorar juegos".
- CTA secundario "Sorprendeme".
- Ilustración protagonista.
- Cartas flotantes o elementos relacionados con los juegos.
- Animaciones discretas.

Propuesta de titular:

"Menos pantalla. Más quilombo."

Conservar "La juntada sigue girando" como eslogan de marca.

La ilustración de la calesita puede seguir presente, pero quiero que forme parte de una composición visual más trabajada y no quede aislada.

### Juegos destacados

Reemplazar el tratamiento visual actual por un sistema de tarjetas premium.

Cada tarjeta debe incluir:

- Ilustración propia o elemento visual distintivo.
- Nombre del juego.
- Categoría.
- Número de jugadores.
- Duración estimada.
- Estado de disponibilidad.
- Acción claramente identificable.

Explorar diferentes tamaños de tarjetas y una jerarquía que permita destacar ciertos juegos.

Mantener consistencia visual entre todas las tarjetas.

Agregar estados hover, focus, active y disabled.

### Categorías

Crear una sección visualmente distintiva para:

- Clásicos.
- Sociales.
- Desafíos físicos.

Cada categoría debe tener identidad gráfica propia dentro del mismo sistema.

## 6. COMPONENTES Y MOTION

Crear o refinar:

- Navbar.
- Hero.
- GameCard.
- FeaturedGameCard.
- CategoryCard.
- PlayerSelector.
- FilterChip.
- PrimaryButton.
- SecondaryButton.
- StatusIndicator.
- SectionHeading.

Motion:

- Hover con pequeñas elevaciones y rotaciones.
- Transiciones suaves entre estados.
- Apariciones sutiles de contenido.
- Microinteracciones en botones.
- Animaciones livianas en la ilustración de la calesita.

Usar Framer Motion / Motion si ya está instalado o si aporta un beneficio concreto.

Respetar prefers-reduced-motion.

No sacrificar rendimiento por animaciones.

## 7. REDISEÑO DE PANTALLAS INTERNAS

No limitar el diseño a la landing.

Aplicar el mismo lenguaje visual a:

- Catálogo completo.
- Filtros.
- Detalle de cada juego.
- Configuración de partida.
- Consignas y tarjetas.
- Cronómetros.
- Pantallas con información secreta.
- Puntajes.
- Resultados.

La prioridad durante una partida es la claridad.

Las consignas deben ser grandes, fáciles de leer y con controles evidentes.

No sobrecargar las pantallas donde la gente está jugando.

## 8. CONSIDERACIONES TÉCNICAS

Antes de hacer cambios:

1. Inspeccioná la estructura existente del proyecto.
2. Identificá las tecnologías y dependencias utilizadas.
3. Revisá componentes y estilos actuales.
4. Reutilizá lo que esté bien implementado.
5. Detectá inconsistencias en la interfaz.

IMPORTANTE:

No recrees el proyecto desde cero.

No elimines funcionalidades existentes.

No modifiques la lógica de los minijuegos salvo que sea estrictamente necesario.

No cambies rutas ni estructuras de datos sin justificación.

No agregues funcionalidades que no forman parte del rediseño visual.

Trabajá de forma incremental.

## 9. IMPLEMENTACIÓN

Primero presentá:

- Diagnóstico de la interfaz actual.
- Propuesta de dirección visual.
- Sistema de diseño.
- Plan de implementación.

Después implementá:

**Fase 1:** Design tokens, tipografía y componentes base.

**Fase 2:** Navbar y hero.

**Fase 3:** Tarjetas, catálogo y categorías.

**Fase 4:** Pantallas internas de juegos.

**Fase 5:** Animaciones, responsive y pulido.

Comprobá que el proyecto compile y que no se hayan roto funcionalidades existentes.

No afirmes haber verificado algo que no pudiste ejecutar.

## 10. CRITERIOS DE CALIDAD

La interfaz final debe:

- Verse profesional en desktop.
- Ser excelente en dispositivos móviles.
- Tener personalidad visual propia.
- Mantener coherencia entre páginas.
- Mostrar información legible.
- Comunicar claramente qué juegos están disponibles.
- Tener animaciones fluidas y controladas.
- Facilitar que un grupo de amigos empiece a jugar rápidamente.

Quiero un rediseño ambicioso a nivel visual, pero responsable a nivel técnico.

**Empezá inspeccionando el proyecto y proponiendo los cambios concretos de diseño. Luego implementá la primera fase.**
````

- L2 Reference access (2026-11-05): the two refero pages (Playdate, Discord) were read. The three Dribbble pages returned empty content, so they were not analyzed.
- L3 Decisions for T1: Shrikhand is now logo-only through `font-logo`; `font-display` is Bricolage Grotesque 800, so existing headings and timers changed without per-screen edits; Figtree is the interface face. `PrimaryButton` and `SecondaryButton` are the refined `marquee` and `secondary` variants of `Button`, not new wrappers, so the 19 existing call sites keep working. New pieces live in `src/components/design/`. PlayerSelector moves to T2 with the navbar. Motion is not installed; CSS covers T1, and T5 decides whether it earns its weight. El infiltrado does not exist yet, so secret-screen work covers the Actuá o perdés handoff until that game is built. Next step: T2.
- L4 User's request (2026-11-05, verbatim): "Sigamos"
- L5 Decisions for T2: the logo is always in the navbar and the h1 is now the headline. PlayerSelector is a chip that opens the existing PlayerCountPicker in a popover, so the rules stay in one place and the hero no longer carries the stepper. The navbar primary action is Sorprendeme outside the home, because the hero already offers it there. "Categorías" is `/#categorias`, with no route change. The slogan moved to a turning yellow marquee that replaces the bulb divider. Hero copy reuses the site description. Floating cards are decorative. Stage ring uses dots, no radial rays. `.impeccable/surfaces/src-app-page-tsx.md` is orphaned and predates this brief. Next step: T3.
- L6 User's request (2026-11-06, verbatim): "Sigamos"
- L7 Decisions for T3: available games show a "Jugar" action straight to `/jugar/<slug>`, and the rest of the ticket still opens the detail page, so a group reaches a game in one tap with no route change. The game name is the stretched link, and `CardShell` sits outside the ticket mask so the focus ring and shadow are not clipped. `groupByAvailability` drives the catalog sections "Para jugar ahora" and "Próximamente" and the featured order; catalog data is unchanged. Coming-soon is the card's disabled state: dimmed stub, no rotation, "Ver detalle" or an arrow, still reachable. `GameRowCard` drops the description, which remains on the detail page. Category identity comes from CSS motifs: bulbs, rings, and stripes. The filter panel only got its surface; deeper filter work stays with T4 under L1 §7. Engram tools were again unavailable, so the mirror stays pending. Next step: T4.
- L8 Native assess for T3 (base 97c91b4, committed only, untracked `.atl/` excluded): medium, `under_budget`, no review due; the slice stays pending for a later commit.
