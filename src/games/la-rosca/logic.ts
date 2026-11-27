import { LETTERS, ROSCO_SECONDS, ROSCOS } from "@/content/la-rosca";
import { createPlayers, createTeams, isTeam, type Team } from "@/games/players";
import { createPersistentStore } from "@/lib/storage";
import { createTimer, getRemainingMs, isTimer, pauseTimer, startTimer, type Timer } from "@/lib/timer";
import { shuffle } from "@/lib/random";

export const SLUG = "la-rosca";

export type LetterStatus = "pending" | "correct" | "wrong";

export type RoscaTeam = Team & {
  roscoId: string;
  statuses: LetterStatus[];
  /** Index of the letter this team answers next. */
  cursor: number;
  timer: Timer;
};

export type Phase = "handoff" | "playing" | "finished";

export type Game = {
  players: number;
  teams: [RoscaTeam, RoscaTeam];
  turnIndex: 0 | 1;
  phase: Phase;
};

export type Session = { game: Game | null };

export type Answer = "correct" | "wrong" | "pass";

export type Action =
  | { type: "start"; players: number; teamNames: readonly string[]; roscoIds?: readonly string[] }
  | { type: "begin-turn"; now: number }
  | { type: "answer"; result: Answer; now: number }
  | { type: "pause"; now: number }
  | { type: "resume"; now: number }
  | { type: "expire"; now: number }
  | { type: "play-again"; roscoIds?: readonly string[] }
  | { type: "end" };

export function countStatus(team: RoscaTeam, status: LetterStatus): number {
  return team.statuses.filter((entry) => entry === status).length;
}

/** A rosco is over once every letter is answered or its clock ran out. */
export function isTeamDone(team: RoscaTeam, now = Date.now()): boolean {
  return !team.statuses.includes("pending") || getRemainingMs(team.timer, now) === 0;
}

/** More correct answers win; on a tie, fewer mistakes. Returns null for a draw. */
export function getWinnerIndex(game: Game): 0 | 1 | null {
  const [a, b] = game.teams;
  const diff = countStatus(a, "correct") - countStatus(b, "correct");
  if (diff !== 0) return diff > 0 ? 0 : 1;
  const errors = countStatus(a, "wrong") - countStatus(b, "wrong");
  if (errors !== 0) return errors < 0 ? 0 : 1;
  return null;
}

/** Next pending letter after the current one, coming back around the rosco. */
function nextPending(statuses: readonly LetterStatus[], from: number): number {
  for (let step = 1; step <= statuses.length; step += 1) {
    const index = (from + step) % statuses.length;
    if (statuses[index] === "pending") return index;
  }
  return from;
}

function pickRoscoIds(): string[] {
  return shuffle(ROSCOS.map((rosco) => rosco.id)).slice(0, 2);
}

function createGame(players: number, teamNames: readonly string[], roscoIds: readonly string[]): Game {
  const [first, second] = createTeams(createPlayers(players), teamNames).map((team, index) => ({
    ...team,
    roscoId: roscoIds[index] ?? ROSCOS[index % ROSCOS.length].id,
    statuses: LETTERS.map((): LetterStatus => "pending"),
    cursor: 0,
    timer: createTimer(ROSCO_SECONDS),
  }));
  return { players, teams: [first, second], turnIndex: 0, phase: "handoff" };
}

function withTeam(game: Game, team: RoscaTeam): Game {
  const teams: [RoscaTeam, RoscaTeam] = [...game.teams];
  teams[game.turnIndex] = team;
  return { ...game, teams };
}

/** After a miss, a pass or a finished rosco: the rival plays if it still can. */
function passTurn(game: Game, now: number): Game {
  const other = game.turnIndex === 0 ? 1 : 0;
  if (!isTeamDone(game.teams[other], now)) return { ...game, turnIndex: other, phase: "handoff" };
  if (!isTeamDone(game.teams[game.turnIndex], now)) return { ...game, phase: "handoff" };
  return { ...game, phase: "finished" };
}

function answer(game: Game, result: Answer, now: number): Game {
  const team = game.teams[game.turnIndex];
  if (team.timer.deadlineMs === null) return game;
  if (getRemainingMs(team.timer, now) === 0) return expire(game, now);

  const statuses = [...team.statuses];
  if (result !== "pass") statuses[team.cursor] = result;
  const updated: RoscaTeam = { ...team, statuses, cursor: nextPending(statuses, team.cursor) };

  if (result === "correct" && statuses.includes("pending")) return withTeam(game, updated);
  return passTurn(withTeam(game, { ...updated, timer: pauseTimer(team.timer, now) }), now);
}

function expire(game: Game, now: number): Game {
  const team = game.teams[game.turnIndex];
  if (getRemainingMs(team.timer, now) > 0) return game;
  const timer = { ...team.timer, remainingMs: 0, deadlineMs: null };
  return passTurn(withTeam(game, { ...team, timer }), now);
}

export function reduceSession(session: Session, action: Action): Session {
  const { game } = session;

  if (action.type === "start") {
    if (game && game.phase !== "finished") return session;
    return { game: createGame(action.players, action.teamNames, action.roscoIds ?? pickRoscoIds()) };
  }

  if (!game) return session;
  const team = game.teams[game.turnIndex];

  switch (action.type) {
    case "begin-turn":
      if (game.phase !== "handoff") return session;
      return {
        game: { ...withTeam(game, { ...team, timer: startTimer(team.timer, action.now) }), phase: "playing" },
      };
    case "answer":
      if (game.phase !== "playing") return session;
      return { game: answer(game, action.result, action.now) };
    case "pause":
      if (game.phase !== "playing") return session;
      return { game: withTeam(game, { ...team, timer: pauseTimer(team.timer, action.now) }) };
    case "resume":
      if (game.phase !== "playing" || team.timer.deadlineMs !== null) return session;
      return { game: withTeam(game, { ...team, timer: startTimer(team.timer, action.now) }) };
    case "expire":
      if (game.phase !== "playing") return session;
      return { game: expire(game, action.now) };
    case "play-again":
      if (game.phase !== "finished") return session;
      return {
        game: createGame(
          game.players,
          game.teams.map((entry) => entry.name),
          action.roscoIds ?? pickRoscoIds(),
        ),
      };
    case "end":
      return { game: null };
  }
}

function isRoscaTeam(value: unknown): value is RoscaTeam {
  if (!isTeam(value)) return false;
  const team = value as Partial<RoscaTeam>;
  return (
    typeof team.roscoId === "string" &&
    ROSCOS.some((rosco) => rosco.id === team.roscoId) &&
    Array.isArray(team.statuses) &&
    team.statuses.length === LETTERS.length &&
    team.statuses.every((status) => status === "pending" || status === "correct" || status === "wrong") &&
    typeof team.cursor === "number" &&
    isTimer(team.timer)
  );
}

export function isSession(value: unknown): value is Session {
  if (typeof value !== "object" || value === null || !("game" in value)) return false;
  const { game } = value as { game: unknown };
  if (game === null) return true;
  if (typeof game !== "object" || game === null) return false;
  const candidate = game as Partial<Game>;
  return (
    typeof candidate.players === "number" &&
    Array.isArray(candidate.teams) &&
    candidate.teams.length === 2 &&
    candidate.teams.every(isRoscaTeam) &&
    (candidate.turnIndex === 0 || candidate.turnIndex === 1) &&
    (candidate.phase === "handoff" || candidate.phase === "playing" || candidate.phase === "finished")
  );
}

export const sessionStore = createPersistentStore<Session>({
  key: "calesita:la-rosca",
  version: 1,
  fallback: { game: null },
  validate: isSession,
});
