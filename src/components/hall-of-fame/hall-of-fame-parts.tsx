import { Compass, Crown, Flame, Lock, Medal, Target, Trophy, type LucideIcon } from "lucide-react";

import { CharacterAvatar } from "@/components/characters/character-avatar";
import { getCharacterById } from "@/content/characters";
import { getGameBySlug } from "@/content/catalog";
import type { Achievement, AchievementIcon } from "@/lib/hall-of-fame/achievements";
import type { RankingCriterion, RankingEntry } from "@/lib/hall-of-fame/ranking";
import { isRateRanked } from "@/lib/hall-of-fame/ranking";
import { getCharacterResult, type CharacterStats, type SeatResult } from "@/lib/hall-of-fame/stats";
import type { MatchResult } from "@/lib/match-history";
import { cn } from "@/lib/utils";

const ICONS: Record<AchievementIcon, LucideIcon> = {
  trophy: Trophy,
  medal: Medal,
  flame: Flame,
  compass: Compass,
  target: Target,
  crown: Crown,
};

const MEDALS = ["#FFD12F", "#D9DEE8", "#E08A4F"] as const;

export function getGameName(slug: string) {
  return getGameBySlug(slug)?.name ?? slug;
}

export function formatRate(stats: CharacterStats) {
  return isRateRanked(stats) && stats.winRate !== null
    ? `${Math.round(stats.winRate * 100)}%`
    : "Sin clasificación";
}

function criterionText(stats: CharacterStats, criterion: RankingCriterion) {
  if (criterion === "wins") return `${stats.wins} ${stats.wins === 1 ? "victoria" : "victorias"}`;
  if (criterion === "played") return `${stats.played} ${stats.played === 1 ? "partida" : "partidas"}`;
  return formatRate(stats);
}

export function PositionBadge({ position }: { position: number | null }) {
  const medal = position !== null && position <= 3 ? MEDALS[position - 1] : null;
  return (
    <span
      aria-label={position === null ? "Sin posición" : `Puesto ${position}`}
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full font-display text-xl",
        medal ? "text-brand-ink shadow-card" : "bg-secondary text-muted-foreground",
      )}
      style={medal ? { backgroundColor: medal } : undefined}
    >
      {position ?? "–"}
    </span>
  );
}

type RankingRowProps = {
  entry: RankingEntry;
  criterion: RankingCriterion;
  selected: boolean;
  onSelect: () => void;
};

export function RankingRow({ entry, criterion, selected, onSelect }: RankingRowProps) {
  const character = getCharacterById(entry.stats.characterId);
  if (!character) return null;
  const { stats } = entry;

  return (
    <li>
      <button
        type="button"
        aria-pressed={selected}
        onClick={onSelect}
        className={cn(
          "flex w-full items-center gap-3 rounded-3xl border-2 bg-card p-3 text-left shadow-card transition-[border-color,transform] duration-200 ease-(--ease-out-expo) active:scale-[0.98] sm:gap-4 sm:p-4",
          selected ? "border-brand-yellow" : "border-transparent hover:border-brand-lavender",
        )}
        style={{ backgroundImage: `linear-gradient(100deg, ${character.colors.primary}33, transparent 55%)` }}
      >
        <PositionBadge position={entry.position} />
        <CharacterAvatar character={character} size="sm" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-display text-2xl leading-tight">{character.name}</span>
          <span className="text-sm text-muted-foreground">
            {stats.wins}G · {stats.ties}E · {stats.losses}P · {stats.played} jugadas
          </span>
        </span>
        <span className="shrink-0 text-right font-semibold text-brand-yellow">
          {criterionText(stats, criterion)}
        </span>
      </button>
    </li>
  );
}

export function AchievementTile({ achievement }: { achievement: Achievement }) {
  const Icon = achievement.unlocked ? ICONS[achievement.icon] : Lock;
  const percent = Math.round((achievement.progress / achievement.goal) * 100);

  return (
    <li
      className={cn(
        "flex gap-3 rounded-2xl border p-3",
        achievement.unlocked ? "border-brand-yellow/60 bg-brand-yellow/10" : "border-border bg-secondary/40",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-full",
          achievement.unlocked ? "bg-brand-yellow text-brand-ink" : "bg-card text-muted-foreground",
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-semibold">
          {achievement.name}
          <span className="sr-only">{achievement.unlocked ? ", desbloqueado" : ", bloqueado"}</span>
        </span>
        <span className="text-sm text-muted-foreground">{achievement.description}</span>
        {!achievement.unlocked && (
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              role="progressbar"
              aria-label={`Progreso de ${achievement.name}`}
              aria-valuemin={0}
              aria-valuemax={achievement.goal}
              aria-valuenow={achievement.progress}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-card"
            >
              <span className="block h-full rounded-full bg-brand-lavender" style={{ width: `${percent}%` }} />
            </span>
            {achievement.progress}/{achievement.goal}
          </span>
        )}
      </span>
    </li>
  );
}

const RESULT_LABELS: Record<SeatResult, string> = {
  win: "Victoria",
  tie: "Empate",
  loss: "Derrota",
  social: "Social",
  ambiguous: "Sin resultado",
};

function matchSummary(match: MatchResult) {
  if (match.kind === "social") return "Juego social, sin ganador";
  if (match.outcome === "no-winner") return "Sin ganador";
  const winners = match.winnerTeamIds.length
    ? match.teams.filter((team) => match.winnerTeamIds.includes(team.id)).map((team) => team.name)
    : match.participants.filter((seat) => match.winnerSeatIds.includes(seat.seatId)).map((seat) => seat.name);
  if (winners.length === 0) return "Sin ganador";
  return `${match.outcome === "tie" ? "Empate" : "Ganó"}: ${winners.join(", ")}`;
}

function scoreLines(match: MatchResult) {
  if (match.teams.some((team) => team.score !== undefined)) {
    return match.teams.map((team) => `${team.name} ${team.score ?? "–"}`);
  }
  if (match.participants.some((seat) => seat.score !== undefined)) {
    return match.participants.map((seat) => `${seat.name} ${seat.score ?? "–"}`);
  }
  return [];
}

const dateFormat = new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeStyle: "short" });

export function MatchRow({ match, characterId }: { match: MatchResult; characterId?: string }) {
  const characterResult = characterId
    ? getCharacterResult(match, characterId as Parameters<typeof getCharacterResult>[1])
    : null;
  const scores = scoreLines(match);
  const avatars = match.participants.flatMap((seat) => {
    const character = seat.kind === "character" && seat.refId ? getCharacterById(seat.refId) : undefined;
    return character ? [character] : [];
  });

  return (
    <li className="flex flex-col gap-2 rounded-2xl bg-card p-4 shadow-card">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <span className="font-semibold">{getGameName(match.game)}</span>
        <time dateTime={match.playedAt} className="text-sm text-muted-foreground">
          {dateFormat.format(new Date(match.playedAt))}
        </time>
      </div>
      <p className="font-medium text-brand-yellow">
        {matchSummary(match)}
        {characterResult && <span className="text-muted-foreground"> · {RESULT_LABELS[characterResult]}</span>}
      </p>
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span className="inline-flex -space-x-2" aria-hidden>
          {avatars.map((character) => (
            <CharacterAvatar key={character.id} character={character} size="xs" />
          ))}
        </span>
        <span>{match.participants.map((seat) => seat.name).join(", ")}</span>
      </div>
      {scores.length > 0 && <p className="text-sm text-muted-foreground">Puntos: {scores.join(" · ")}</p>}
    </li>
  );
}
