"use client";

import { Trophy } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { HallCameo } from "@/components/alive/hall-cameo";
import { ArcadePanel } from "@/components/arcade/arcade-surface";
import { CheckerBand } from "@/components/arcade/checker-band";
import { PixelLabel } from "@/components/arcade/pixel-type";
import { CharacterAvatar } from "@/components/characters/character-avatar";
import { FilterChip } from "@/components/design/filter-chip";
import { OptionGroup } from "@/components/design/option-group";
import { SectionHeading } from "@/components/design/section-heading";
import {
  AchievementTile,
  formatRate,
  getGameName,
  MatchRow,
  RankingRow,
} from "@/components/hall-of-fame/hall-of-fame-parts";
import { CHARACTERS, getCharacterArt, getCharacterById } from "@/content/characters";
import { usePersistentStore } from "@/hooks/use-persistent-store";
import { getAchievements } from "@/lib/hall-of-fame/achievements";
import {
  getPlayedGames,
  getRanking,
  getRecentMatches,
  MIN_RANKED_MATCHES,
  RANKING_CRITERIA,
  RANKING_CRITERION_LABELS,
  type RankingCriterion,
} from "@/lib/hall-of-fame/ranking";
import { getCharacterStats, normalizeHistory } from "@/lib/hall-of-fame/stats";
import { isMatchResult, matchHistoryStore } from "@/lib/match-history";
import type { CharacterId } from "@/types/character";

const ALL = "";
const HISTORY_PAGE = 10;

function SummaryTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="arcade-edge flex flex-col rounded-arcade-card bg-card px-4 py-3">
      <span className="font-display text-5xl leading-none text-arcade-yellow" data-tabular>{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

function GameFilter({ games, value, onChange, label }: {
  games: string[];
  value: string;
  onChange: (game: string) => void;
  label: string;
}) {
  if (games.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <span className="font-semibold text-muted-foreground">{label}</span>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[ALL, ...games].map((game) => (
          <FilterChip key={game || "all"} selected={value === game} onClick={() => onChange(game)} className="shrink-0">
            {game ? getGameName(game) : "Todos"}
          </FilterChip>
        ))}
      </div>
    </div>
  );
}

function CharacterCard({ characterId, history }: { characterId: CharacterId; history: ReturnType<typeof normalizeHistory> }) {
  const character = getCharacterById(characterId);
  const stats = getCharacterStats(history, characterId);
  if (!character) return null;
  const achievements = getAchievements(stats);
  const recent = [...stats.matches].reverse().slice(0, 3);

  return (
    <article
      aria-labelledby="character-card-title"
      className="arcade-edge flex flex-col gap-5 overflow-hidden rounded-arcade-panel bg-card p-5 sm:p-6"
    >
      <div className="-mx-5 -mt-5 flex items-end gap-4 border-b-2 border-arcade-edge px-5 pt-5 sm:-mx-6 sm:-mt-6 sm:px-6" style={{ backgroundColor: `${character.colors.primary}40` }}>
        <Image
          src={getCharacterArt(character, "full")}
          alt=""
          aria-hidden="true"
          width={260}
          height={420}
          unoptimized
          className="h-40 w-auto shrink-0 sm:h-52"
        />
        <div className="flex flex-col pb-5">
          <PixelLabel accent>Player profile</PixelLabel>
          <h3 id="character-card-title" className="font-display text-6xl leading-[0.85]">{character.name}</h3>
          <p className="mt-2 text-muted-foreground">
            {achievements.filter((entry) => entry.unlocked).length} de {achievements.length} logros
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-2 text-center sm:grid-cols-6">
        {[
          ["Jugadas", stats.played],
          ["Competitivas", stats.eligible],
          ["Victorias", stats.wins],
          ["Empates", stats.ties],
          ["Derrotas", stats.losses],
          ["Efectividad", formatRate(stats)],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col-reverse rounded-arcade-card border-2 border-border bg-secondary px-2 py-3">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className={typeof value === "number" ? "font-display text-4xl leading-none" : "text-sm font-semibold"} data-tabular>{value}</dd>
          </div>
        ))}
      </dl>

      {stats.topGames.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="pixel-label">Juegos más jugados</h4>
          <ul className="flex flex-wrap gap-2">
            {stats.topGames.slice(0, 3).map(({ game, played }) => (
              <li key={game} className="rounded-arcade-control border-2 border-border bg-secondary px-3 py-1 text-sm font-semibold">
                {getGameName(game)} · {played}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h4 className="pixel-label">Vitrina de logros</h4>
        <ul className="grid gap-2 sm:grid-cols-2">
          {achievements.map((achievement) => (
            <AchievementTile key={achievement.id} achievement={achievement} />
          ))}
        </ul>
      </div>

      {recent.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="pixel-label">Últimas partidas</h4>
          <ul className="flex flex-col gap-2">
            {recent.map(({ match }) => (
              <MatchRow key={match.id} match={match} characterId={characterId} />
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

export function HallOfFame() {
  const stored = usePersistentStore(matchHistoryStore);
  const history = useMemo(() => normalizeHistory(stored.filter(isMatchResult)), [stored]);
  const games = useMemo(() => getPlayedGames(history), [history]);

  const [criterion, setCriterion] = useState<RankingCriterion>("wins");
  const [rankingGame, setRankingGame] = useState(ALL);
  const [selected, setSelected] = useState<CharacterId>(CHARACTERS[0].id);
  const [historyCharacter, setHistoryCharacter] = useState(ALL);
  const [historyGame, setHistoryGame] = useState(ALL);
  const [historyLimit, setHistoryLimit] = useState(HISTORY_PAGE);

  const ranking = useMemo(
    () => getRanking(history, { criterion, game: rankingGame || undefined }),
    [history, criterion, rankingGame],
  );
  const filteredHistory = getRecentMatches(history, {
    characterId: historyCharacter || undefined,
    game: historyGame || undefined,
  });
  const competitive = history.filter((match) => match.kind === "competitive").length;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-12 px-4 pt-6 pb-16 sm:px-5">
      <ArcadePanel as="header" tone="dark" className="relative overflow-hidden px-5 pt-8 sm:px-8">
        <div className="flex items-center gap-3 text-arcade-yellow">
          <Trophy aria-hidden className="size-7" />
          <PixelLabel>High scores · La barra</PixelLabel>
        </div>
        <h1 className="mt-2 font-display text-[clamp(3.5rem,15vw,6rem)] leading-[0.82] text-arcade-yellow">
          Salón de la Fama
        </h1>
        <p className="mt-3 max-w-xl text-lg text-muted-foreground">
          Victorias, rachas y logros de la barra, sacados de las partidas que terminaron de verdad.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-2 sm:max-w-md">
          <SummaryTile value={history.length} label="Partidas" />
          <SummaryTile value={competitive} label="Competitivas" />
          <SummaryTile value={history.length - competitive} label="Sociales" />
        </div>
        <HallCameo />
        <div aria-hidden="true" className="relative mt-6 -mb-1 flex items-end justify-center">
          {CHARACTERS.map((character) => (
            <Image
              key={character.id}
              src={getCharacterArt(character, "full")}
              alt=""
              width={260}
              height={420}
              unoptimized
              className="relative z-10 -mx-[1.5%] h-auto w-[16%] max-w-28"
            />
          ))}
          <CheckerBand className="absolute inset-x-[-2rem] bottom-0 h-8 opacity-70" size={1} />
        </div>
      </ArcadePanel>

      <section aria-labelledby="ranking-title" className="flex flex-col gap-5">
        <SectionHeading
          id="ranking-title"
          eyebrow="Top players"
          title="Ranking"
          description={`El porcentaje es victorias sobre partidas competitivas con resultado. Hacen falta ${MIN_RANKED_MATCHES} para clasificar.`}
        />
        <OptionGroup
          id="ranking-criterion"
          label="Ordenar por"
          options={RANKING_CRITERIA}
          value={criterion}
          format={(option) => RANKING_CRITERION_LABELS[option]}
          onChange={setCriterion}
        />
        <GameFilter games={games} value={rankingGame} onChange={setRankingGame} label="Juego" />
        {history.length === 0 && (
          <p className="rounded-arcade-card border-2 border-dashed border-border p-4 text-muted-foreground">
            Todavía no hay partidas registradas. Terminen un juego y la barra empieza a sumar.
          </p>
        )}
        <ol className="flex flex-col gap-2">
          {ranking.map((entry) => (
            <RankingRow
              key={entry.stats.characterId}
              entry={entry}
              criterion={criterion}
              selected={selected === entry.stats.characterId}
              onSelect={() => setSelected(entry.stats.characterId)}
            />
          ))}
        </ol>
        <p className="text-sm text-muted-foreground">Tocá un personaje para ver su ficha.</p>
      </section>

      <section aria-label="Ficha del personaje">
        <CharacterCard characterId={selected} history={history} />
      </section>

      <section aria-labelledby="history-title" className="flex flex-col gap-5">
        <SectionHeading id="history-title" eyebrow="Credits" title="Historial" description="Las partidas más recientes primero." />
        {history.length > 0 && (
          <>
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-muted-foreground">Personaje</span>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <FilterChip selected={historyCharacter === ALL} onClick={() => setHistoryCharacter(ALL)} className="shrink-0">
                  Todos
                </FilterChip>
                {CHARACTERS.map((character) => (
                  <FilterChip
                    key={character.id}
                    selected={historyCharacter === character.id}
                    onClick={() => setHistoryCharacter(character.id)}
                    className="shrink-0 pl-1.5"
                  >
                    <CharacterAvatar character={character} size="xs" />
                    {character.name}
                  </FilterChip>
                ))}
              </div>
            </div>
            <GameFilter games={games} value={historyGame} onChange={setHistoryGame} label="Juego" />
          </>
        )}
        {filteredHistory.length === 0 ? (
          <p className="rounded-arcade-card border-2 border-dashed border-border p-4 text-muted-foreground">
            {history.length === 0 ? "El historial está vacío por ahora." : "No hay partidas con estos filtros."}
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {filteredHistory.slice(0, historyLimit).map((match) => (
              <MatchRow key={match.id} match={match} characterId={historyCharacter || undefined} />
            ))}
          </ul>
        )}
        {filteredHistory.length > historyLimit && (
          <FilterChip selected={false} onClick={() => setHistoryLimit((limit) => limit + HISTORY_PAGE)} className="self-center">
            Ver más partidas
          </FilterChip>
        )}
      </section>

      <p className="text-center text-sm text-muted-foreground">
        Las estadísticas se guardan solo en este navegador.
      </p>
    </main>
  );
}
