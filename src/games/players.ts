export type Player = {
  id: string;
  name: string;
};

export type Team = {
  id: string;
  name: string;
  playerIds: string[];
  score: number;
};

const DEFAULT_TEAM_NAMES = ["Equipo Violeta", "Equipo Turquesa"];

export function createPlayers(count: number, names: readonly string[] = []): Player[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `player-${index + 1}`,
    name: names[index]?.trim() || `Jugador ${index + 1}`,
  }));
}

/** Next index in turn order, skipping inactive players such as those out of lives. */
export function getNextActiveIndex(current: number, active: readonly boolean[]): number {
  for (let step = 1; step < active.length; step += 1) {
    const index = (current + step) % active.length;
    if (active[index]) return index;
  }
  return current;
}

export function createTeams(
  players: readonly Player[],
  names: readonly string[] = [],
): Team[] {
  return DEFAULT_TEAM_NAMES.map((defaultName, teamIndex) => ({
    id: `team-${teamIndex + 1}`,
    name: names[teamIndex]?.trim() || defaultName,
    playerIds: players
      .filter((_, playerIndex) => playerIndex % DEFAULT_TEAM_NAMES.length === teamIndex)
      .map((player) => player.id),
    score: 0,
  }));
}

export function addTeamPoint(teams: readonly Team[], teamId: string): Team[] {
  return teams.map((team) =>
    team.id === teamId ? { ...team, score: team.score + 1 } : team,
  );
}

/** Everyone tied at the top score. More than one result means a tie. */
export function getLeaders<T extends { score: number }>(items: readonly T[]): T[] {
  const top = Math.max(...items.map((item) => item.score));
  return items.filter((item) => item.score === top);
}

export function isPlayer(value: unknown): value is Player {
  if (typeof value !== "object" || value === null) return false;
  const player = value as Partial<Player>;
  return typeof player.id === "string" && typeof player.name === "string";
}

export function isTeam(value: unknown): value is Team {
  if (typeof value !== "object" || value === null) return false;
  const team = value as Partial<Team>;
  return (
    typeof team.id === "string" &&
    typeof team.name === "string" &&
    typeof team.score === "number" &&
    Array.isArray(team.playerIds) &&
    team.playerIds.every((id) => typeof id === "string")
  );
}
