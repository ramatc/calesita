# Calesita

Party games for friends in the same room, moderated by one shared device. No sign-up, no download, no backend: open the site, pick a game and play.

The interface is in Spanish (Argentina). All 15 games in the catalog are playable.

| Game | Players | What happens |
| --- | --- | --- |
| Actuá o perdés | 4 to 16 | Charades in two teams against the clock. |
| Palabras prohibidas | 4 to 12 | Describe a word to your team without saying the four forbidden ones. |
| Preguntados Calesita | 2 to 10 | Multiple-choice trivia, one question per turn; the app checks the answer. |
| Dibujalo como puedas | 4 to 12 | Draw the prompt on paper while your team guesses, in two teams. |
| Categorías explosivas | 2 to 10 | Name something in the category before time runs out. Last one with lives wins. |
| El infiltrado | 4 to 12 | Everyone gets the same word except one. Pass the phone, give clues, vote. |
| ¿Quién es más probable que...? | 3 to 20 | A question, a countdown, and everyone points at once. |
| Mentira o verdad | 3 to 12 | Tell a story, true or invented; the group votes and you score if you fooled them. |
| Defendé lo indefendible | 3 to 10 | Defend an absurd opinion for 45 seconds; score if you convinced the group. |
| Confesiones anónimas | 4 to 12 | Everyone writes an anonymous confession on paper; score by guessing who wrote it. |
| Desafío relámpago | 2 to 12 | Quick physical and social challenges by difficulty. Any challenge can be skipped. |
| Búsqueda desesperada | 3 to 12 | Find the item in the house first; one point per round. |
| Estatuas imposibles | 3 to 12 | Hold the pose until the clock runs out without moving. |
| Un minuto para ganar | 2 to 12 | Household-object skill tests with sixty seconds on the clock. |
| Olimpiadas Calesita | 4 to 16 | Two teams compete across timed events; most events won takes it. |

## Requirements

- Node.js 24 (`cn` needs Node 22 or newer; `package.json` pins `24.x` for deployments).
- pnpm 10 (the exact version is in `packageManager`; `corepack enable` installs it).

## Run it

```bash
pnpm install
pnpm dev
```

Then open <http://localhost:3000>.

## Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm test` runs the Vitest unit tests for game logic, content, storage and timers.

## Project structure

```text
src/
  app/          Routes: home, /juegos catalog, /juegos/[slug] detail, /jugar/[slug] play
  components/   UI only: brand, catalog, characters, design system, game shell, layout, shadcn/ui
  content/      Catalog, labels, characters, and each game's prompts and rules
  games/        Pure game logic (reducers, validation) and each game's screen
  hooks/        React hooks: persistent stores, game sessions, timers
  lib/          Utilities: versioned localStorage, timers, randomness, player names, character cast
  types/        Shared types
public/characters/  Character art; see public/characters/README.md
```

Each playable game lives in `src/games/<slug>/`:

- `logic.ts` is a pure reducer over a session, plus a validator for stored data. It has no React and is covered by `logic.test.ts`.
- `screen.tsx` renders the game with the shared components in `src/components/game/`.
- Its prompts and rules live in `src/content/<slug>.ts`, with unique ids and a `packId`, so new packs can be added without touching the built-in set.

Most games build on one of three shared modules instead of writing their own reducer:

- `src/games/team-turns/`: two teams take timed turns guessing cards (Actuá o perdés, Palabras prohibidas, Dibujalo como puedas).
- `src/games/challenge-turns/`: each player takes a turn at a card, optionally timed, and marks it completed, failed or skipped (Desafío relámpago, Un minuto para ganar, Estatuas imposibles, Defendé lo indefendible, Mentira o verdad).
- `src/games/rounds/`: every round deals a card, may run a clock, and the group says who scored (Preguntados Calesita, Búsqueda desesperada, Confesiones anónimas, Olimpiadas Calesita).

Such a game's `logic.ts` only passes its content and storage key to the module's factory, and its `screen.tsx` configures the shared screen.

## Adding a game

1. Add its content and `RULES` to `src/content/<slug>.ts`.
2. Write `src/games/<slug>/logic.ts` with its tests, and `screen.tsx`.
3. Register the screen in `GAME_SCREENS` in `src/games/registry.ts`.
4. In `src/content/catalog.ts`, set the game's `status` to `"available"` and pass its `rules`.

`src/games/registry.test.ts` fails if a game is available without a screen or rules.

## Saved data

Everything is stored in the browser's localStorage under `calesita:*` keys. Each value is wrapped with a version and validated on read. Missing, corrupt or outdated data falls back to a fresh state instead of breaking the page. Running games survive a reload, timers included. Prompt decks are stored apart from the game, so prompts do not repeat across games until a game's content is exhausted.

## Characters

The seven characters live in `public/characters`. See `public/characters/README.md` to replace the art or add expressions and poses. `pnpm characters:build` regenerates the art from the shared rig.

## Deploying to Vercel

The app is a standard Next.js project with no environment variables, so Vercel needs no extra configuration.

1. Import the GitHub repository in Vercel (<https://vercel.com/new>).
2. Keep the detected settings: framework Next.js, install `pnpm install`, build `pnpm build`.
3. Deploy. Node.js 24 is taken from `engines` in `package.json`.

With the Vercel CLI instead:

```bash
npm i -g vercel
vercel        # preview deployment
vercel --prod # production
```

Every route is prerendered at build time, and unknown game slugs return 404.

## La barra (participants)

- **Single source of truth.** Characters present live in `characterRosterStore` (the same roster game setups use); guests live in `guestsStore` (`calesita:guests`, v1). `src/lib/participants.ts` joins them; read them anywhere with `useParticipants()`.
- **Player count sync.** With 2 or more present, La barra writes the total to `playerCountStore`. Below 2 the count is untouched, so the picker keeps working manually. The picker stays editable either way. Games still seat characters up to their own count; guests count toward the total but do not take seats with avatars.
- **Roulette.** `drawIndex` draws the winner first with `crypto.getRandomValues` and rejection sampling (uniform). `planSpin` then computes a rotation that stops inside that segment; tests assert the pointer always lands on the drawn one. With `prefers-reduced-motion`, the wheel jumps to the result without animating. No sound.
