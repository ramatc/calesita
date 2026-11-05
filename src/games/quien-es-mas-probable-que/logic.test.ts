import { describe, expect, it } from "vitest";

import { GAMES } from "@/content/catalog";
import { QUESTIONS } from "@/content/quien-es-mas-probable-que";
import {
  createSession,
  isSession,
  reduceSession,
  type Session,
} from "@/games/quien-es-mas-probable-que/logic";

function started(players = 8) {
  return reduceSession(createSession(), { type: "start", players });
}

function game(session: Session) {
  if (!session.game) throw new Error("expected an active game");
  return session.game;
}

describe("question content", () => {
  it("has at least 50 questions with unique ids and texts", () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(50);
    expect(new Set(QUESTIONS.map((question) => question.id)).size).toBe(QUESTIONS.length);
    expect(new Set(QUESTIONS.map((question) => question.text)).size).toBe(QUESTIONS.length);
  });

  it("includes the five example questions from the brief", () => {
    const texts = QUESTIONS.map((question) => question.text);
    expect(texts).toEqual(
      expect.arrayContaining([
        "¿Quién es más probable que llegue tarde a su propio cumpleaños?",
        "¿Quién sobreviviría menos tiempo en una isla desierta?",
        "¿Quién se haría famoso por accidente?",
        "¿Quién organizaría un viaje y se olvidaría de reservar el alojamiento?",
        "¿Quién sería eliminado primero de un reality show?",
      ]),
    );
  });

  it("every question starts and ends as a question", () => {
    for (const question of QUESTIONS) {
      expect(question.text.startsWith("¿Quién")).toBe(true);
      expect(question.text.endsWith("?")).toBe(true);
    }
  });
});

describe("catalog entry", () => {
  it("is available and has rules to show", () => {
    const entry = GAMES.find((item) => item.slug === "quien-es-mas-probable-que");
    expect(entry?.status).toBe("available");
    expect(entry?.rules?.length).toBeGreaterThan(0);
  });
});

describe("reduceSession", () => {
  it("starts on a random question in the reading phase", () => {
    const current = game(started(8));
    expect(current).toMatchObject({ players: 8, phase: "reading", asked: 1 });
    expect(QUESTIONS.some((question) => question.id === current.questionId)).toBe(true);
  });

  it("walks reading, countdown, pointing and on to a new question", () => {
    let session = started();
    const firstQuestion = game(session).questionId;

    session = reduceSession(session, { type: "call-vote" });
    expect(game(session).phase).toBe("countdown");

    session = reduceSession(session, { type: "reveal" });
    expect(game(session).phase).toBe("pointing");

    session = reduceSession(session, { type: "next" });
    expect(game(session)).toMatchObject({ phase: "reading", asked: 2 });
    expect(game(session).questionId).not.toBe(firstQuestion);
  });

  it("lets the group skip a question while reading", () => {
    const session = reduceSession(started(), { type: "next" });
    expect(game(session)).toMatchObject({ phase: "reading", asked: 2 });
  });

  it("does not change on an action that does not fit the phase", () => {
    const reading = started();
    expect(reduceSession(reading, { type: "reveal" })).toBe(reading);

    const countdown = reduceSession(reading, { type: "call-vote" });
    expect(reduceSession(countdown, { type: "next" })).toBe(countdown);
    expect(reduceSession(countdown, { type: "call-vote" })).toBe(countdown);
  });

  it("repeats no question until all of them were asked", () => {
    let session = started();
    const seen = new Set([game(session).questionId]);
    for (let index = 1; index < QUESTIONS.length; index += 1) {
      session = reduceSession(session, { type: "next" });
      seen.add(game(session).questionId);
    }
    expect(seen.size).toBe(QUESTIONS.length);
  });

  it("keeps the deck when a game ends, so a new game continues without repeats", () => {
    const first = started();
    const ended = reduceSession(first, { type: "end" });
    expect(ended.game).toBeNull();

    const second = reduceSession(ended, { type: "start", players: 8 });
    expect(game(second).questionId).not.toBe(game(first).questionId);
    expect(second.deck.remaining).toHaveLength(QUESTIONS.length - 2);
  });
});

describe("isSession", () => {
  it("accepts sessions in any phase", () => {
    expect(isSession(createSession())).toBe(true);
    expect(isSession(started())).toBe(true);
  });

  it("rejects a question that no longer exists or a malformed game", () => {
    const session = started();
    expect(isSession({ ...session, game: { ...game(session), questionId: "gone" } })).toBe(false);
    expect(isSession({ ...session, game: { ...game(session), phase: "other" } })).toBe(false);
    expect(isSession({ ...session, game: { ...game(session), players: "8" } })).toBe(false);
    expect(isSession({ game: null })).toBe(false);
  });
});
