# Feature: arcade-alive

Objective: Sprint 4 "Calesita Arcade Alive", a Retro Arcade x Premium Playground redesign plus contextual character appearances, without changing game rules, statistics, history formats, character identities, the roulette algorithm, or persistence.
Branch: `feat/arcade-alive`. Delivery: `ask-on-risk`; push and merge only with explicit user authorization. Test runner: Vitest, plus scripted browser checks kept in the session scratchpad.
Engram mirror `odd/arcade-alive/tasks`: PENDING (Engram tools not loaded this session).

## Specs

- S1 Fase 4A — Arcade Design System: "Tokens semánticos de color. Escala tipográfica. Tipografías. Espaciados. Radios de borde. Bordes y sombras. Botones. Tarjetas. Badges. Campos y selectores. Estados interactivos. Patrones gráficos reutilizables." "Crear variantes para superficies claras y oscuras." "No aplicar cambios globales indiscriminadamente si pueden romper pantallas de juego." "Preservar contraste, legibilidad y accesibilidad." User scope for 4A: "implementes los tokens, tipografías, componentes base, variantes claras y oscuras y utilidades gráficas, pero sin rediseñar todavía todas las páginas."
- S2 Typography: "Jersey 10 será la tipografía principal de display, pero también puede utilizarse en etiquetas decorativas cortas y legibles, como PLAYER SELECT, HIGH SCORES, INSERT COIN o GAME OVER. No utilizarla en consignas, instrucciones ni textos largos." Manrope for functional text; Shrikhand stays for the logo.
- S3 Balance: "No quiero una interfaz sobrecargada de píxeles, patrones o decoraciones." "Usá checkerboard, bordes duros, sombras y elementos 8-bit de forma intencional."
- S4 Fase 4B — redesign of home, catalog, La Barra, Salón de la Fama and game screens (game screens stay dark). Characters: "Integrá sus ilustraciones originales en composiciones del hero, La Barra y el Salón de la Fama. No modifiques ni regeneres los personajes."
- S5 Fase 4C — Calesita Alive: "Las apariciones de Calesita Alive deben ser ocasionales, contextuales y no invasivas." "No quiero una animación nueva en cada navegación." "Respetar movimiento reducido, accesibilidad, rendimiento y control de frecuencia."
- S6 Fase 4D — quality pass; "No declarar verificaciones manuales como completadas si no se ejecutaron."
- S7 Per phase: "Mostrame qué cambió. Indicá los archivos modificados. Explicá cómo probar visualmente los componentes. Ejecutá typecheck, lint, tests y build. No avances automáticamente a 4B. No hagas merge ni push sin mi autorización."

## Tasks

- [x] T1 S1-S3, S7 inline: 4A design system (tokens, fonts, surfaces, utilities, button/badge/input variants, arcade components, preview route `/diseno`). Evidence: typecheck, lint, 353 unit tests and build pass; `/diseno` renders in Chrome at desktop width with Jersey 10 and Manrope loaded, noindex, no horizontal overflow. Contrast: ink/cream 15.32, muted/cream 7.03, muted/sky 7.65, violet ring/cream 5.23, muted/midnight 10.64, yellow/midnight 12.09, ink/yellow 11.93, ink/orange 6.13, ink/pink 6.28, ink/turquoise 9.40; white/orange 2.84 rejected. Not verified: 390px view (window resize did not apply). Test-first exception: visual tokens have no meaningful RED.
- [ ] T2 S4 — waits for user go-ahead.
- [ ] T3 S5 — waits for user go-ahead.
- [ ] T4 S6 — waits for user go-ahead.

Route evidence: T1 inline, no Writer trigger reason (one sequential unit).

## Log

- L1 (2026-11-27, user's request): the full "CALESITA — SPRINT 4: ARCADE ALIVE" prompt from the conversation of 2026-11-27; S1-S6 quote its relevant fragments verbatim. Visual direction proposed and approved in the same conversation.
- L2 (2026-11-27, user's approval, verbatim excerpt): "Apruebo la dirección visual propuesta para el Sprint 4 — Calesita Arcade Alive." "Podés crear `odd/tasks/arcade-alive.md` y trabajar en la rama `feat/arcade-alive`. Avanzá con la Fase 4A — Arcade Design System."
- L3 Decision: 4A adds tokens and components without re-pointing existing tokens, so current pages and game screens render unchanged until 4B adopts them.
