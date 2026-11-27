import type { Metadata } from "next";
import { Dices, Play } from "lucide-react";

import { ArcadeChip } from "@/components/arcade/arcade-chip";
import { ArcadeCard, ArcadePanel, type ArcadeTone } from "@/components/arcade/arcade-surface";
import { CheckerBand } from "@/components/arcade/checker-band";
import { PixelHeading, PixelLabel } from "@/components/arcade/pixel-type";
import { CharacterAvatar } from "@/components/characters/character-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CHARACTERS } from "@/content/characters";

/** Internal reference sheet for the arcade design system; not linked from the site. */
export const metadata: Metadata = {
  title: "Sistema arcade",
  robots: { index: false, follow: false },
};

const SURFACES: readonly { tone: ArcadeTone; name: string }[] = [
  { tone: "light", name: "Crema" },
  { tone: "sky", name: "Celeste" },
  { tone: "dark", name: "Violeta" },
];

function Specimen({ tone, name }: { tone: ArcadeTone; name: string }) {
  return (
    <ArcadePanel tone={tone} aria-labelledby={`surface-${tone}`} className="flex flex-col gap-6 p-6 sm:p-8">
      <div className="flex flex-col gap-2">
        <PixelLabel accent>Superficie {name}</PixelLabel>
        <PixelHeading id={`surface-${tone}`} size="h1">
          La juntada sigue girando
        </PixelHeading>
        <p className="max-w-prose font-ui text-arcade-muted">
          Texto funcional en Manrope. Las consignas, instrucciones y controles siempre usan esta
          tipografía para que se lean de lejos.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button variant="arcade" size="arcade-xl">
          <Play />
          Empezar
        </Button>
        <Button variant="arcade-orange" size="arcade">
          <Dices />
          Sorprendeme
        </Button>
        <Button variant="arcade-outline" size="arcade">
          Ver juegos
        </Button>
        <Button variant="arcade-ghost" size="arcade">
          Cómo se juega
        </Button>
        <Button variant="arcade" size="arcade" disabled>
          Próximamente
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="arcade">3–8 jugadores</Badge>
        <Badge variant="arcade-yellow">15 min</Badge>
        <Badge variant="arcade-pink">Actuación</Badge>
        <Badge variant="arcade-turquoise">Nuevo</Badge>
      </div>

      <div role="group" aria-label="Duración" className="flex flex-wrap gap-3">
        <ArcadeChip selected>30 s</ArcadeChip>
        <ArcadeChip selected={false}>60 s</ArcadeChip>
        <ArcadeChip selected={false}>90 s</ArcadeChip>
      </div>

      <label className="flex max-w-sm flex-col gap-2 font-ui font-semibold">
        Nombre del invitado
        <Input variant="arcade" placeholder="Ej.: la prima de Pili" />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <ArcadeCard className="flex flex-col gap-2">
          <PixelLabel className="text-arcade-muted">High scores</PixelLabel>
          <p className="font-pixel text-pixel-h2" data-tabular>
            1ST · 12 PTS
          </p>
          <p className="font-ui text-sm text-arcade-muted">Tarjeta estática sobre la superficie.</p>
        </ArcadeCard>
        <ArcadeCard interactive className="flex items-center gap-3">
          <CharacterAvatar character={CHARACTERS[0]} size="md" />
          <a href="#" className="font-ui font-bold outline-none">
            Tarjeta interactiva
          </a>
        </ArcadeCard>
      </div>
    </ArcadePanel>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-2">
        <PixelLabel accent>Insert coin</PixelLabel>
        <PixelHeading as="h1" size="display">
          Sistema arcade
        </PixelHeading>
        <p className="max-w-prose font-ui text-muted-foreground">
          Hoja de referencia interna del Sprint 4. Muestra tokens, tipografías, componentes y
          utilidades sobre las tres superficies.
        </p>
      </header>

      {SURFACES.map((surface) => (
        <Specimen key={surface.tone} {...surface} />
      ))}

      <ArcadePanel tone="dark" className="overflow-hidden" aria-labelledby="player-select">
        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <PixelLabel id="player-select" accent>
            Player select
          </PixelLabel>
          <ul className="flex flex-wrap gap-4">
            {CHARACTERS.map((character) => (
              <li key={character.id} className="flex flex-col items-center gap-2">
                <CharacterAvatar character={character} size="lg" />
                <span className="font-ui text-sm font-semibold">{character.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <CheckerBand fade />
      </ArcadePanel>

      <section aria-labelledby="utilities" className="flex flex-col gap-4">
        <PixelHeading id="utilities" size="h2">
          Utilidades
        </PixelHeading>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="surface-light arcade-edge flex h-28 items-end rounded-arcade-card p-3 font-ui font-semibold">
            arcade-edge
          </div>
          <div className="surface-light arcade-edge checker flex h-28 items-end overflow-hidden rounded-arcade-card [--checker-a:var(--arcade-sky)]">
            <span className="m-3 rounded-arcade-control bg-arcade-raised px-2 font-ui font-semibold">checker</span>
          </div>
          <div className="pixel-corners flex h-28 items-end bg-arcade-yellow p-3 font-ui font-semibold text-arcade-ink">
            pixel-corners
          </div>
        </div>
        <div className="pixel-rule text-arcade-yellow" aria-hidden />
      </section>
    </main>
  );
}
