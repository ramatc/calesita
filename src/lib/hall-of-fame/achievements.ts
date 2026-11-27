import { isEligible, type CharacterStats } from "@/lib/hall-of-fame/stats";

/** Achievements are derived from the stats on every read; none of them is stored. */

export type AchievementIcon = "trophy" | "medal" | "flame" | "compass" | "target" | "crown";

export type AchievementDefinition = {
  id: string;
  name: string;
  description: string;
  icon: AchievementIcon;
  goal: number;
  /** How far the character is toward the goal. */
  progress: (stats: CharacterStats) => number;
};

export type Achievement = Omit<AchievementDefinition, "progress"> & {
  unlocked: boolean;
  /** Capped at the goal. */
  progress: number;
};

/** The longest run of wins in a row. Ties and losses break it; other matches are skipped. */
export function getLongestWinStreak(stats: CharacterStats): number {
  let longest = 0;
  let current = 0;
  for (const { result } of stats.matches) {
    if (!isEligible(result)) continue;
    current = result === "win" ? current + 1 : 0;
    longest = Math.max(longest, current);
  }
  return longest;
}

export function getMostWinsInOneGame(stats: CharacterStats): number {
  const wins = new Map<string, number>();
  for (const { match, result } of stats.matches) {
    if (result === "win") wins.set(match.game, (wins.get(match.game) ?? 0) + 1);
  }
  return Math.max(0, ...wins.values());
}

export const ACHIEVEMENTS: readonly AchievementDefinition[] = [
  {
    id: "first-win",
    name: "Primera victoria",
    description: "Ganar una primera partida competitiva.",
    icon: "trophy",
    goal: 1,
    progress: (stats) => stats.wins,
  },
  {
    id: "veteran",
    name: "Veterano",
    description: "Participar en al menos 20 partidas registradas.",
    icon: "medal",
    goal: 20,
    progress: (stats) => stats.played,
  },
  {
    id: "unbeaten",
    name: "Invicto",
    description: "Ganar 3 partidas competitivas seguidas, sin derrota ni empate entre ellas.",
    icon: "flame",
    goal: 3,
    progress: getLongestWinStreak,
  },
  {
    id: "all-rounder",
    name: "Todoterreno",
    description: "Participar en al menos 4 juegos diferentes.",
    icon: "compass",
    goal: 4,
    progress: (stats) => stats.topGames.length,
  },
  {
    id: "specialist",
    name: "Especialista",
    description: "Ganar al menos 5 partidas de un mismo juego.",
    icon: "target",
    goal: 5,
    progress: getMostWinsInOneGame,
  },
  {
    id: "legend",
    name: "Leyenda de la Barra",
    description: "Acumular 25 victorias competitivas.",
    icon: "crown",
    goal: 25,
    progress: (stats) => stats.wins,
  },
];

export function getAchievements(stats: CharacterStats): Achievement[] {
  return ACHIEVEMENTS.map(({ progress, ...definition }) => {
    const value = progress(stats);
    return {
      ...definition,
      unlocked: value >= definition.goal,
      progress: Math.min(value, definition.goal),
    };
  });
}
