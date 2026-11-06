# Calesita

Party games for friends in the same room, moderated by one shared device. No sign-up, no download, no backend: open the site, pick a game and play.

The interface is in Spanish (Argentina). The catalog lists 15 games; 5 are playable today.

| Game | Players | What happens |
| --- | --- | --- |
| ¿Quién es más probable que...? | 3 to 20 | A question, a countdown, and everyone points at once. |
| Actuá o perdés | 4 to 16 | Charades in two teams against the clock. |
| El infiltrado | 4 to 12 | Everyone gets the same word except one. Pass the phone, give clues, vote. |
| Desafío relámpago | 2 to 12 | Quick physical and social challenges by difficulty. Any challenge can be skipped. |
| Categorías explosivas | 2 to 10 | Name something in the category before time runs out. Last one with lives wins. |

The rest of the catalog is shown as "Próximamente".

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
