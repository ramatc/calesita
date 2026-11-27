import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { getWordCard, RULES, WORDS } from "@/content/palabras-prohibidas";
import { isSession, reduceSession } from "@/games/palabras-prohibidas/logic";
import { renderWordCard } from "@/games/palabras-prohibidas/screen";
import { createSession } from "@/games/team-turns/logic";

const NOW = 1_000_000;

function acting() {
  const handoff = reduceSession(createSession(), {
    type: "start",
    players: 4,
    teamNames: [],
    turnSeconds: 60,
    rounds: 2,
  });
  return reduceSession(handoff, { type: "begin-turn", now: NOW });
}

describe("palabras prohibidas content", () => {
  it("has unique ids and words, each with four forbidden words that differ from it", () => {
    expect(new Set(WORDS.map((card) => card.id)).size).toBe(WORDS.length);
    expect(new Set(WORDS.map((card) => card.word)).size).toBe(WORDS.length);
    for (const card of WORDS) {
      expect(card.forbidden).toHaveLength(4);
      expect(card.forbidden).not.toContain(card.word);
    }
    expect(RULES.length).toBeGreaterThan(0);
  });
});

describe("palabras prohibidas game", () => {
  it("deals a word card when the turn begins and scores a hit for the team", () => {
    const session = acting();
    expect(getWordCard(session.game?.promptId ?? "")).toBeDefined();

    const hit = reduceSession(session, { type: "hit", now: NOW + 1000 });
    expect(hit.game?.teams[0].score).toBe(1);
    expect(hit.game?.promptId).not.toBe(session.game?.promptId);
  });

  it("validates its own stored sessions only", () => {
    const session = acting();
    expect(isSession(session)).toBe(true);
    const foreign = { ...session, game: { ...session.game!, promptId: "act-001" } };
    expect(isSession(foreign)).toBe(false);
  });

  it("shows the word with all its forbidden words", () => {
    const card = WORDS[0];
    const html = renderToStaticMarkup(createElement(() => renderWordCard(card.id)));
    expect(html).toContain(card.word);
    for (const word of card.forbidden) expect(html).toContain(word);
  });
});
