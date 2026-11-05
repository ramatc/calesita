import { describe, expect, it } from "vitest";

import { getPrompt, PROMPT_CATEGORIES, PROMPTS, RULES } from "@/content/actua-o-perdes";
import {
  createSession,
  isLastTurn,
  isSession,
  reduceSession,
  type Action,
  type Session,
} from "@/games/actua-o-perdes/logic";

const NOW = 1_000_000;
const TURN_MS = 60_000;

function started(rounds: 2 | 3 | 5 = 2) {
  return reduceSession(createSession(), {
    type: "start",
    players: 6,
    teamNames: ["Los Pumas", ""],
    turnSeconds: 60,
    rounds,
  });
}

function game(session: Session) {
  if (!session.game) throw new Error("expected an active game");
  return session.game;
}

function apply(session: Session, ...actions: Action[]) {
  return actions.reduce(reduceSession, session);
}

const scores = (session: Session) => game(session).teams.map((team) => team.score);

const acting = () => reduceSession(started(), { type: "begin-turn", now: NOW });

const expire: Action = { type: "expire", now: NOW + TURN_MS };

/** Plays one whole turn with the given number of hits, ending on the next handoff or results. */
function playTurn(session: Session, hits: number) {
  const hitActions = Array.from({ length: hits }, (): Action => ({ type: "hit", now: NOW }));
  return apply(
    session,
    { type: "begin-turn", now: NOW },
    ...hitActions,
    expire,
    { type: "next-turn" },
  );
}

function finishedGame() {
  return [0, 0, 0, 0].reduce(playTurn, started(2));
}

describe("prompt content", () => {
  it("has at least 50 prompts with unique ids and texts in the base pack", () => {
    expect(PROMPTS.length).toBeGreaterThanOrEqual(50);
    expect(new Set(PROMPTS.map((prompt) => prompt.id)).size).toBe(PROMPTS.length);
    expect(new Set(PROMPTS.map((prompt) => prompt.text)).size).toBe(PROMPTS.length);
    for (const prompt of PROMPTS) {
      expect(prompt.id).toMatch(/^act-\d{3}$/);
      expect(prompt.packId).toBe("base");
    }
  });

  it("spreads prompts across the five suggested categories", () => {
    expect(PROMPT_CATEGORIES).toEqual([
      "Película",
      "Personaje",
      "Acción",
      "Situación absurda",
      "Objeto",
    ]);
    for (const category of PROMPT_CATEGORIES) {
      const inCategory = PROMPTS.filter((prompt) => prompt.category === category);
      expect(inCategory.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("finds a prompt by id", () => {
    expect(getPrompt(PROMPTS[0].id)).toEqual(PROMPTS[0]);
    expect(getPrompt("gone")).toBeUndefined();
  });

  it("has four or five rules", () => {
    expect(RULES.length).toBeGreaterThanOrEqual(4);
    expect(RULES.length).toBeLessThanOrEqual(5);
  });
});

describe("start", () => {
  it("opens on the first team's handoff, with no prompt and both scores at zero", () => {
    const current = game(started());
    expect(current).toMatchObject({
      players: 6,
      phase: "handoff",
      promptId: null,
      turnIndex: 0,
      round: 1,
      totalRounds: 2,
      turnSeconds: 60,
      turnPoints: 0,
    });
    expect(current.teams.map((team) => [team.name, team.score])).toEqual([
      ["Los Pumas", 0],
      ["Equipo Turquesa", 0],
    ]);
    expect(current.teams.flatMap((team) => team.playerIds)).toHaveLength(6);
  });

  it("uses the chosen turn duration for the timer", () => {
    const session = reduceSession(createSession(), {
      type: "start",
      players: 4,
      teamNames: [],
      turnSeconds: 30,
      rounds: 3,
    });
    expect(game(session).timer.durationMs).toBe(30_000);
    expect(game(session).timer.deadlineMs).toBeNull();
  });

  it("does not replace a game in progress", () => {
    const session = acting();
    const restart: Action = {
      type: "start",
      players: 4,
      teamNames: [],
      turnSeconds: 30,
      rounds: 2,
    };
    expect(reduceSession(session, restart)).toBe(session);
  });
});

describe("a turn", () => {
  it("starting it deals a secret prompt and runs the timer", () => {
    const current = game(acting());
    expect(current.phase).toBe("acting");
    expect(getPrompt(current.promptId ?? "")).toBeDefined();
    expect(current.timer.deadlineMs).toBe(NOW + TURN_MS);
  });

  it("adds a point and moves to the next prompt on a hit", () => {
    const before = acting();
    const after = reduceSession(before, { type: "hit", now: NOW + 1000 });
    expect(scores(after)).toEqual([1, 0]);
    expect(game(after).turnPoints).toBe(1);
    expect(game(after).promptId).not.toBe(game(before).promptId);
    expect(game(after).timer).toEqual(game(before).timer);
  });

  it("moves to the next prompt without a point on a pass", () => {
    const before = acting();
    const after = reduceSession(before, { type: "pass", now: NOW + 1000 });
    expect(scores(after)).toEqual([0, 0]);
    expect(game(after).turnPoints).toBe(0);
    expect(game(after).promptId).not.toBe(game(before).promptId);
  });

  it("repeats no prompt until all of them were dealt, across turns and teams", () => {
    let session = reduceSession(started(5), { type: "begin-turn", now: NOW });
    const seen = new Set([game(session).promptId]);
    for (let index = 1; index < PROMPTS.length; index += 1) {
      session =
        index % 10 === 0
          ? apply(session, expire, { type: "next-turn" }, { type: "begin-turn", now: NOW })
          : reduceSession(session, { type: index % 2 ? "hit" : "pass", now: NOW });
      seen.add(game(session).promptId);
    }
    expect(seen.size).toBe(PROMPTS.length);
  });

  it("keeps the deck when a game ends, so a new game continues without repeats", () => {
    const first = acting();
    const ended = reduceSession(first, { type: "end" });
    expect(ended.game).toBeNull();

    const second = apply(
      ended,
      { type: "start", players: 4, teamNames: [], turnSeconds: 60, rounds: 2 },
      { type: "begin-turn", now: NOW },
    );
    expect(game(second).promptId).not.toBe(game(first).promptId);
    expect(second.deck.remaining).toHaveLength(PROMPTS.length - 2);
  });
});

describe("pause", () => {
  it("keeps the remaining time and the prompt through pause and resume", () => {
    const paused = reduceSession(acting(), { type: "pause", now: NOW + 20_000 });
    expect(game(paused).timer).toMatchObject({ remainingMs: 40_000, deadlineMs: null });

    const resumed = reduceSession(paused, { type: "resume", now: NOW + 500_000 });
    expect(game(resumed).timer.deadlineMs).toBe(NOW + 540_000);
    expect(game(resumed).promptId).toBe(game(paused).promptId);
  });

  it("blocks hit, pass and expiry while paused", () => {
    const paused = reduceSession(acting(), { type: "pause", now: NOW + 20_000 });
    expect(reduceSession(paused, { type: "hit", now: NOW + 21_000 })).toBe(paused);
    expect(reduceSession(paused, { type: "pass", now: NOW + 21_000 })).toBe(paused);
    expect(reduceSession(paused, { type: "expire", now: NOW + 900_000 })).toBe(paused);
  });

  it("ignores a pause while paused and a resume while running", () => {
    const running = acting();
    expect(reduceSession(running, { type: "resume", now: NOW + 1 })).toBe(running);

    const paused = reduceSession(running, { type: "pause", now: NOW + 1 });
    expect(reduceSession(paused, { type: "pause", now: NOW + 2 })).toBe(paused);
  });
});

describe("time out", () => {
  it("ends the turn on the summary with its points and no prompt", () => {
    const summary = apply(acting(), { type: "hit", now: NOW }, { type: "hit", now: NOW }, expire);
    expect(game(summary)).toMatchObject({ phase: "summary", promptId: null, turnPoints: 2 });
    expect(game(summary).timer.deadlineMs).toBeNull();
    expect(scores(summary)).toEqual([2, 0]);
  });

  it("ignores an expiry before the deadline", () => {
    const session = acting();
    expect(reduceSession(session, { type: "expire", now: NOW + TURN_MS - 1 })).toBe(session);
  });

  it("gives no point for a hit that arrives after the deadline and ends the turn", () => {
    const late = reduceSession(acting(), { type: "hit", now: NOW + TURN_MS });
    expect(game(late).phase).toBe("summary");
    expect(scores(late)).toEqual([0, 0]);
  });

  it("ends the turn when a pass or pause arrives after the deadline", () => {
    const pass = reduceSession(acting(), { type: "pass", now: NOW + TURN_MS });
    const pause = reduceSession(acting(), { type: "pause", now: NOW + TURN_MS });
    expect(game(pass).phase).toBe("summary");
    expect(game(pause).phase).toBe("summary");
  });

  it("treats a deadline that passed during a reload as a normal timeout", () => {
    const reloaded = JSON.parse(JSON.stringify(acting())) as Session;
    expect(isSession(reloaded)).toBe(true);
    const after = reduceSession(reloaded, { type: "expire", now: NOW + 10 * TURN_MS });
    expect(game(after).phase).toBe("summary");
  });
});

describe("turn order and rounds", () => {
  it("hands the turn to the other team and resets the turn points", () => {
    const summary = apply(acting(), { type: "hit", now: NOW }, expire);
    const handoff = reduceSession(summary, { type: "next-turn" });
    expect(game(handoff)).toMatchObject({
      phase: "handoff",
      turnIndex: 1,
      round: 1,
      promptId: null,
    });

    const next = reduceSession(handoff, { type: "begin-turn", now: NOW + 100_000 });
    expect(game(next).turnPoints).toBe(0);
    expect(game(next).timer.deadlineMs).toBe(NOW + 100_000 + TURN_MS);

    const hit = reduceSession(next, { type: "hit", now: NOW + 100_001 });
    expect(scores(hit)).toEqual([1, 1]);
  });

  it("counts a round when both teams played one turn", () => {
    const oneTurn = playTurn(started(), 0);
    expect(game(oneTurn)).toMatchObject({ turnIndex: 1, round: 1 });

    const twoTurns = playTurn(oneTurn, 0);
    expect(game(twoTurns)).toMatchObject({ turnIndex: 0, round: 2, phase: "handoff" });
  });

  it("flags only the last team's turn of the last round", () => {
    expect(isLastTurn(game(apply(acting(), expire)))).toBe(false);

    const threeTurns = [0, 0, 0].reduce(playTurn, started(2));
    const lastSummary = apply(threeTurns, { type: "begin-turn", now: NOW }, expire);
    expect(isLastTurn(game(lastSummary))).toBe(true);
  });

  it("finishes after the configured rounds with the final scores", () => {
    const threeTurns = [3, 1, 2].reduce(playTurn, started(2));
    expect(game(threeTurns).phase).toBe("handoff");

    const finished = playTurn(threeTurns, 0);
    expect(game(finished)).toMatchObject({ phase: "finished", promptId: null, round: 2 });
    expect(scores(finished)).toEqual([5, 1]);
  });

  it("keeps matching scores as they are, so the screen shows a tie", () => {
    const finished = [1, 2, 1, 0].reduce(playTurn, started(2));
    expect(game(finished).phase).toBe("finished");
    expect(scores(finished)).toEqual([2, 2]);
  });

  it("starts a new game from the results", () => {
    const again = reduceSession([1, 0, 0, 0].reduce(playTurn, started(2)), {
      type: "start",
      players: 4,
      teamNames: [],
      turnSeconds: 90,
      rounds: 5,
    });
    expect(game(again)).toMatchObject({ phase: "handoff", round: 1, totalRounds: 5 });
    expect(scores(again)).toEqual([0, 0]);
  });
});

describe("actions in the wrong phase", () => {
  const timed = (type: "begin-turn" | "hit" | "pass" | "pause" | "resume" | "expire"): Action => ({
    type,
    now: NOW + 10 * TURN_MS,
  });

  it("does nothing without a game", () => {
    const session = createSession();
    expect(reduceSession(session, timed("begin-turn"))).toBe(session);
    expect(reduceSession(session, timed("hit"))).toBe(session);
    expect(reduceSession(session, { type: "next-turn" })).toBe(session);
  });

  it("ignores turn actions during the handoff", () => {
    const session = started();
    for (const type of ["hit", "pass", "pause", "resume", "expire"] as const) {
      expect(reduceSession(session, timed(type))).toBe(session);
    }
    expect(reduceSession(session, { type: "next-turn" })).toBe(session);
  });

  it("ignores begin-turn and next-turn while acting", () => {
    const session = acting();
    expect(reduceSession(session, timed("begin-turn"))).toBe(session);
    expect(reduceSession(session, { type: "next-turn" })).toBe(session);
  });

  it("ignores turn actions on the summary and on the results", () => {
    const summary = apply(acting(), expire);
    const finished = finishedGame();

    for (const session of [summary, finished]) {
      for (const type of ["begin-turn", "hit", "pass", "pause", "resume", "expire"] as const) {
        expect(reduceSession(session, timed(type))).toBe(session);
      }
    }
    expect(reduceSession(finished, { type: "next-turn" })).toBe(finished);
  });
});

describe("isSession", () => {
  it("accepts every phase after a storage round trip", () => {
    const paused = reduceSession(acting(), { type: "pause", now: NOW + 5 });
    const summary = apply(acting(), expire);

    for (const session of [
      createSession(),
      started(),
      acting(),
      paused,
      summary,
      finishedGame(),
    ]) {
      const stored = JSON.parse(JSON.stringify(session)) as Session;
      expect(isSession(stored)).toBe(true);
      expect(stored).toEqual(session);
    }
  });

  it("rejects malformed sessions", () => {
    const session = acting();
    const current = game(session);
    const broken: unknown[] = [
      null,
      { game: null },
      { ...session, deck: { remaining: "x" } },
      { ...session, game: "x" },
      { ...session, game: { ...current, phase: "other" } },
      { ...session, game: { ...current, promptId: "gone" } },
      { ...session, game: { ...current, promptId: null } },
      { ...session, game: { ...current, players: "6" } },
      { ...session, game: { ...current, teams: current.teams.slice(0, 1) } },
      { ...session, game: { ...current, teams: [{ id: "t" }, { id: "u" }] } },
      { ...session, game: { ...current, turnIndex: 2 } },
      { ...session, game: { ...current, round: 3 } },
      { ...session, game: { ...current, round: 0 } },
      { ...session, game: { ...current, turnSeconds: 45 } },
      { ...session, game: { ...current, totalRounds: 4 } },
      { ...session, game: { ...current, turnPoints: "1" } },
      { ...session, game: { ...current, timer: { durationMs: 1 } } },
      { ...session, game: { ...current, timer: { ...current.timer, durationMs: 1 } } },
      { ...session, game: { ...current, phase: "handoff" } },
    ];
    for (const value of broken) expect(isSession(value)).toBe(false);
  });
});
