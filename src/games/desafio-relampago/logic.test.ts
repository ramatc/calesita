import { describe, expect, it } from "vitest";

import {
  CHALLENGE_IDS,
  CHALLENGES,
  getChallenge,
  getChallengeIds,
  RULES,
  type Challenge,
} from "@/content/desafio-relampago";
import {
  createSession,
  DIFFICULTY_OPTIONS,
  getTotals,
  isSession,
  reduceSession,
  type DifficultyOption,
  type Game,
  type Session,
} from "@/games/desafio-relampago/logic";
import { createPlayers } from "@/games/players";

const PLAYERS = createPlayers(3, ["Ana", "Beto", "Caro"]);

function started(difficulty: DifficultyOption = "mixed", players = PLAYERS) {
  return reduceSession(createSession(), { type: "start", players, difficulty });
}

function game(session: Session): Game {
  if (!session.game) throw new Error("expected an active game");
  return session.game;
}

function current(session: Session): Challenge {
  const challenge = getChallenge(game(session).challengeId);
  if (!challenge) throw new Error("expected a known challenge");
  return challenge;
}

/** Skips through the public reducer until the dealt challenge matches. */
function skipUntil(session: Session, matches: (challenge: Challenge) => boolean) {
  let next = session;
  for (let step = 0; step <= CHALLENGES.length; step += 1) {
    if (matches(current(next))) return next;
    next = reduceSession(next, { type: "resolve", outcome: "skipped" });
  }
  throw new Error("no challenge matched");
}

function startedTimed() {
  return skipUntil(started(), (challenge) => challenge.timerSeconds !== undefined);
}

function startedUntimed() {
  return skipUntil(started(), (challenge) => challenge.timerSeconds === undefined);
}

function running(nowMs = 1_000) {
  return reduceSession(startedTimed(), { type: "start-timer", now: nowMs });
}

function paused() {
  return reduceSession(running(1_000), { type: "pause", now: 2_000 });
}

function durationOf(session: Session) {
  return (current(session).timerSeconds ?? 0) * 1000;
}

function expired() {
  const session = running(1_000);
  return reduceSession(session, { type: "expire", now: 1_000 + durationOf(session) });
}

function tally(session: Session, index: number) {
  return game(session).tallies[index];
}

describe("challenge content", () => {
  it("has at least 50 challenges with unique ids and titles in the base pack", () => {
    expect(CHALLENGES.length).toBeGreaterThanOrEqual(50);
    expect(new Set(CHALLENGE_IDS).size).toBe(CHALLENGES.length);
    expect(new Set(CHALLENGES.map((challenge) => challenge.title)).size).toBe(CHALLENGES.length);
    for (const challenge of CHALLENGES) {
      expect(challenge.id).toMatch(/^des-\d{3}$/);
      expect(challenge.packId).toBe("base");
      expect(challenge.instructions.length).toBeGreaterThan(0);
    }
  });

  it("has at least 12 challenges per difficulty", () => {
    for (const difficulty of ["easy", "medium", "hard"] as const) {
      expect(getChallengeIds(difficulty).length).toBeGreaterThanOrEqual(12);
    }
  });

  it("includes the five challenges from the brief", () => {
    const titles = CHALLENGES.map((challenge) => challenge.title);
    expect(titles).toEqual(
      expect.arrayContaining([
        "Mantenerse en un pie durante 30 segundos.",
        "Imitar a un integrante del grupo.",
        "Construir una torre con cinco objetos disponibles.",
        "Representar una película usando solamente sonidos.",
        "Inventar un comercial de 20 segundos para un objeto de la habitación.",
      ]),
    );
  });

  it("times the brief challenges that name a duration with that duration", () => {
    const secondsOf = (start: string) =>
      CHALLENGES.find((challenge) => challenge.title.startsWith(start))?.timerSeconds;
    expect(secondsOf("Mantenerse en un pie")).toBe(30);
    expect(secondsOf("Inventar un comercial")).toBe(20);
  });

  it("mixes timed and untimed challenges with positive durations", () => {
    const timed = CHALLENGES.filter((challenge) => challenge.timerSeconds !== undefined);
    expect(timed.length).toBeGreaterThan(0);
    expect(timed.length).toBeLessThan(CHALLENGES.length);
    expect(timed.every((challenge) => (challenge.timerSeconds ?? 0) > 0)).toBe(true);
  });

  it("names nothing dangerous, sexual, alcohol-related or edible", () => {
    const banned =
      /alcohol|cerveza|vino\b|fernet|shot|borrach|comer\b|comida|beber|tragar|masticar|trepar|escalar|subite|subirse|mare[oa]|contener|respiraci|desnud|\bbes[oaá]|sexo|sexy|humill|obligad[oa] a/i;
    for (const { title, instructions } of CHALLENGES) {
      expect(`${title} ${instructions}`).not.toMatch(banned);
    }
  });

  it("explains the game in four or five short steps that offer the skip", () => {
    expect(RULES.length).toBeGreaterThanOrEqual(4);
    expect(RULES.length).toBeLessThanOrEqual(5);
    expect(RULES.join(" ")).toMatch(/saltar/i);
  });

  it("looks a challenge up by id and misses unknown ids", () => {
    expect(getChallenge(CHALLENGE_IDS[0])?.id).toBe(CHALLENGE_IDS[0]);
    expect(getChallenge("gone")).toBeUndefined();
  });
});

describe("starting a game", () => {
  it("deals to the first player with zeroed counts", () => {
    const session = started();
    expect(game(session)).toMatchObject({
      players: PLAYERS,
      difficulty: "mixed",
      turn: 0,
      played: 1,
    });
    expect(game(session).tallies).toEqual([
      { completed: 0, failed: 0, skipped: 0 },
      { completed: 0, failed: 0, skipped: 0 },
      { completed: 0, failed: 0, skipped: 0 },
    ]);
  });

  it("offers the four difficulty options", () => {
    expect(DIFFICULTY_OPTIONS).toEqual(["easy", "medium", "hard", "mixed"]);
  });

  it("deals a stopped timer only for a timed challenge", () => {
    const timed = startedTimed();
    expect(game(timed).phase).toBe("idle");
    expect(game(timed).timer).toEqual({
      durationMs: durationOf(timed),
      remainingMs: durationOf(timed),
      deadlineMs: null,
    });

    const untimed = startedUntimed();
    expect(game(untimed)).toMatchObject({ phase: "idle", timer: null });
  });
});

describe("difficulty", () => {
  it.each(["easy", "medium", "hard"] as const)(
    "deals only %s challenges, without repeats, until exhaustion",
    (difficulty) => {
      const ids = getChallengeIds(difficulty);
      let session = started(difficulty);
      const seen = [game(session).challengeId];
      for (let index = 1; index < ids.length; index += 1) {
        session = reduceSession(session, { type: "resolve", outcome: "skipped" });
        seen.push(game(session).challengeId);
      }
      expect([...seen].sort()).toEqual([...ids].sort());
    },
  );

  it("covers every challenge on mixed, without repeats, until exhaustion", () => {
    let session = started("mixed");
    const seen = new Set([game(session).challengeId]);
    for (let index = 1; index < CHALLENGES.length; index += 1) {
      session = reduceSession(session, { type: "resolve", outcome: "skipped" });
      seen.add(game(session).challengeId);
    }
    expect(seen.size).toBe(CHALLENGES.length);
  });

  it("deals again once a difficulty is exhausted", () => {
    const ids = getChallengeIds("easy");
    let session = started("easy");
    for (let index = 0; index < ids.length; index += 1) {
      session = reduceSession(session, { type: "resolve", outcome: "skipped" });
    }
    expect(ids).toContain(game(session).challengeId);
    expect(session.decks.easy.cycle).toBe(2);
  });

  it("keeps the deck when a game ends, so a new game continues without repeats", () => {
    const first = started("easy");
    const ended = reduceSession(first, { type: "end" });
    expect(ended.game).toBeNull();

    const second = reduceSession(ended, { type: "start", players: PLAYERS, difficulty: "easy" });
    expect(game(second).challengeId).not.toBe(game(first).challengeId);
    expect(second.decks.easy.remaining).toHaveLength(getChallengeIds("easy").length - 2);
  });

  it("keeps one deck per difficulty option", () => {
    const ended = reduceSession(started("easy"), { type: "end" });
    const hard = reduceSession(ended, { type: "start", players: PLAYERS, difficulty: "hard" });
    expect(hard.decks.easy.remaining).toHaveLength(getChallengeIds("easy").length - 1);
    expect(hard.decks.hard.remaining).toHaveLength(getChallengeIds("hard").length - 1);
    expect(hard.decks.mixed.cycle).toBe(0);
  });
});

describe("turns and counts", () => {
  it("rotates the turn and wraps to the first player", () => {
    let session = started();
    const order = [game(session).turn];
    for (let step = 0; step < 3; step += 1) {
      session = reduceSession(session, { type: "resolve", outcome: "skipped" });
      order.push(game(session).turn);
    }
    expect(order).toEqual([0, 1, 2, 0]);
  });

  it("counts completed, failed and skipped for the player whose turn it is", () => {
    const untimed = startedUntimed();
    const { turn, tallies } = game(untimed);
    const before = tallies[turn];

    const completed = reduceSession(untimed, { type: "resolve", outcome: "completed" });
    expect(tally(completed, turn)).toEqual({ ...before, completed: before.completed + 1 });

    const failed = reduceSession(untimed, { type: "resolve", outcome: "failed" });
    expect(tally(failed, turn)).toEqual({ ...before, failed: before.failed + 1 });

    const skipped = reduceSession(untimed, { type: "resolve", outcome: "skipped" });
    expect(tally(skipped, turn)).toEqual({ ...before, skipped: before.skipped + 1 });
  });

  it("does not touch the other players' counts", () => {
    const session = startedUntimed();
    const { turn, tallies } = game(session);
    const next = reduceSession(session, { type: "resolve", outcome: "completed" });
    game(next).tallies.forEach((value, index) => {
      if (index !== turn) expect(value).toEqual(tallies[index]);
    });
  });

  it("deals a new challenge and counts one more played after resolving", () => {
    const session = startedUntimed();
    const next = reduceSession(session, { type: "resolve", outcome: "completed" });
    expect(game(next).challengeId).not.toBe(game(session).challengeId);
    expect(game(next).played).toBe(game(session).played + 1);
    expect(game(next).phase).toBe("idle");
  });

  it("adds up the counts of every player", () => {
    let session = startedUntimed();
    const before = getTotals(game(session).tallies);
    session = reduceSession(session, { type: "resolve", outcome: "skipped" });
    session = reduceSession(session, { type: "resolve", outcome: "skipped" });
    expect(getTotals(game(session).tallies)).toEqual({
      ...before,
      skipped: before.skipped + 2,
    });
  });

  it("drops the previous timer when the next challenge is dealt", () => {
    const next = reduceSession(running(), { type: "resolve", outcome: "completed" });
    const seconds = current(next).timerSeconds;
    expect(game(next).timer).toEqual(
      seconds === undefined
        ? null
        : { durationMs: seconds * 1000, remainingMs: seconds * 1000, deadlineMs: null },
    );
  });
});

describe("skipping", () => {
  const phases: [string, () => Session][] = [
    ["an untimed challenge", startedUntimed],
    ["a timer that was not started", startedTimed],
    ["a running timer", () => running()],
    ["a paused timer", paused],
    ["an expired timer", expired],
  ];

  it.each(phases)("is possible with %s and moves on", (_, build) => {
    const session = build();
    const { turn, tallies, challengeId } = game(session);
    const before = tallies[turn];
    const next = reduceSession(session, { type: "resolve", outcome: "skipped" });

    expect(game(next).turn).toBe((turn + 1) % PLAYERS.length);
    expect(game(next).challengeId).not.toBe(challengeId);
    expect(tally(next, turn)).toEqual({ ...before, skipped: before.skipped + 1 });
  });
});

describe("timer", () => {
  it("starts on demand", () => {
    const session = running(1_000);
    expect(game(session).phase).toBe("running");
    expect(game(session).timer?.deadlineMs).toBe(1_000 + durationOf(session));
  });

  it("pauses keeping the time left and resumes from it", () => {
    const session = running(1_000);
    const duration = durationOf(session);

    const stopped = reduceSession(session, { type: "pause", now: 3_000 });
    expect(game(stopped).phase).toBe("paused");
    expect(game(stopped).timer).toMatchObject({
      remainingMs: duration - 2_000,
      deadlineMs: null,
    });

    const resumed = reduceSession(stopped, { type: "resume", now: 10_000 });
    expect(game(resumed).phase).toBe("running");
    expect(game(resumed).timer?.deadlineMs).toBe(10_000 + duration - 2_000);
  });

  it("only stops on expiry, keeping the turn, the challenge and the counts", () => {
    const session = running(1_000);
    const next = reduceSession(session, { type: "expire", now: 1_000 + durationOf(session) });

    expect(game(next).phase).toBe("expired");
    expect(game(next).timer).toMatchObject({ remainingMs: 0, deadlineMs: null });
    expect(game(next)).toMatchObject({
      turn: game(session).turn,
      challengeId: game(session).challengeId,
      tallies: game(session).tallies,
      played: game(session).played,
    });
  });

  it("ignores an expiry that arrives before the deadline", () => {
    const session = running(1_000);
    const early = reduceSession(session, {
      type: "expire",
      now: 1_000 + durationOf(session) - 1,
    });
    expect(early).toBe(session);
  });

  it("allows marking while the timer runs, while paused and after expiry", () => {
    for (const session of [running(), paused(), expired()]) {
      const { turn, tallies } = game(session);
      const completed = reduceSession(session, { type: "resolve", outcome: "completed" });
      expect(tally(completed, turn).completed).toBe(tallies[turn].completed + 1);
      const failed = reduceSession(session, { type: "resolve", outcome: "failed" });
      expect(tally(failed, turn).failed).toBe(tallies[turn].failed + 1);
    }
  });
});

describe("actions in the wrong phase", () => {
  it("ignores everything but start without a game", () => {
    const session = createSession();
    expect(reduceSession(session, { type: "start-timer", now: 1 })).toBe(session);
    expect(reduceSession(session, { type: "pause", now: 1 })).toBe(session);
    expect(reduceSession(session, { type: "resume", now: 1 })).toBe(session);
    expect(reduceSession(session, { type: "expire", now: 1 })).toBe(session);
    expect(reduceSession(session, { type: "resolve", outcome: "skipped" })).toBe(session);
  });

  it("ignores every timer action on an untimed challenge", () => {
    const session = startedUntimed();
    expect(reduceSession(session, { type: "start-timer", now: 1 })).toBe(session);
    expect(reduceSession(session, { type: "pause", now: 1 })).toBe(session);
    expect(reduceSession(session, { type: "resume", now: 1 })).toBe(session);
    expect(reduceSession(session, { type: "expire", now: 1 })).toBe(session);
  });

  it("requires starting a timed challenge before marking it", () => {
    const session = startedTimed();
    expect(reduceSession(session, { type: "resolve", outcome: "completed" })).toBe(session);
    expect(reduceSession(session, { type: "resolve", outcome: "failed" })).toBe(session);
  });

  it("ignores pause, resume and expiry on a timer that was not started", () => {
    const session = startedTimed();
    expect(reduceSession(session, { type: "pause", now: 1 })).toBe(session);
    expect(reduceSession(session, { type: "resume", now: 1 })).toBe(session);
    expect(reduceSession(session, { type: "expire", now: Infinity })).toBe(session);
  });

  it("ignores start and resume on a running timer", () => {
    const session = running();
    expect(reduceSession(session, { type: "start-timer", now: 5 })).toBe(session);
    expect(reduceSession(session, { type: "resume", now: 5 })).toBe(session);
  });

  it("ignores pause, start and expiry on a paused timer", () => {
    const session = paused();
    expect(reduceSession(session, { type: "pause", now: 3_000 })).toBe(session);
    expect(reduceSession(session, { type: "start-timer", now: 3_000 })).toBe(session);
    expect(reduceSession(session, { type: "expire", now: Infinity })).toBe(session);
  });

  it("ignores every timer action after expiry", () => {
    const session = expired();
    expect(reduceSession(session, { type: "start-timer", now: 1 })).toBe(session);
    expect(reduceSession(session, { type: "pause", now: 1 })).toBe(session);
    expect(reduceSession(session, { type: "resume", now: 1 })).toBe(session);
    expect(reduceSession(session, { type: "expire", now: Infinity })).toBe(session);
  });
});

describe("isSession", () => {
  it("accepts sessions in every phase, also after a JSON round trip", () => {
    const sessions = [
      createSession(),
      startedUntimed(),
      startedTimed(),
      running(),
      paused(),
      expired(),
    ];
    for (const session of sessions) {
      expect(isSession(JSON.parse(JSON.stringify(session)))).toBe(true);
    }
  });

  it("rejects a malformed session shape", () => {
    const { decks } = createSession();
    expect(isSession(null)).toBe(false);
    expect(isSession({ game: null })).toBe(false);
    expect(isSession({ decks: { ...decks, mixed: "x" }, game: null })).toBe(false);
    expect(isSession({ decks: { easy: decks.easy }, game: null })).toBe(false);
  });

  it("rejects a malformed game", () => {
    const session = startedUntimed();
    const broken = (patch: Record<string, unknown>) => ({
      ...session,
      game: { ...game(session), ...patch },
    });

    expect(isSession(broken({ challengeId: "gone" }))).toBe(false);
    expect(isSession(broken({ difficulty: "brutal" }))).toBe(false);
    expect(isSession(broken({ phase: "other" }))).toBe(false);
    expect(isSession(broken({ players: [] }))).toBe(false);
    expect(isSession(broken({ players: [{ id: 1 }] }))).toBe(false);
    expect(isSession(broken({ turn: 3 }))).toBe(false);
    expect(isSession(broken({ turn: -1 }))).toBe(false);
    expect(isSession(broken({ turn: "0" }))).toBe(false);
    expect(isSession(broken({ played: 0 }))).toBe(false);
    expect(isSession(broken({ tallies: [] }))).toBe(false);
    expect(
      isSession(broken({ tallies: game(session).tallies.map(() => ({ completed: 0 })) })),
    ).toBe(false);
  });

  it("rejects a challenge that does not belong to the difficulty", () => {
    const session = started("easy");
    const [hardId] = getChallengeIds("hard");
    expect(isSession({ ...session, game: { ...game(session), challengeId: hardId } })).toBe(false);
  });

  it("rejects a timer that does not match the challenge or the phase", () => {
    const untimed = startedUntimed();
    const timed = startedTimed();
    const live = running();
    const broken = (session: Session, patch: Record<string, unknown>) => ({
      ...session,
      game: { ...game(session), ...patch },
    });

    expect(isSession(broken(untimed, { timer: game(timed).timer }))).toBe(false);
    expect(isSession(broken(timed, { timer: null }))).toBe(false);
    expect(isSession(broken(timed, { timer: { durationMs: 1 } }))).toBe(false);
    expect(isSession(broken(live, { phase: "paused" }))).toBe(false);
    expect(isSession(broken(timed, { phase: "running" }))).toBe(false);
    expect(isSession(broken(untimed, { phase: "running" }))).toBe(false);
  });
});
