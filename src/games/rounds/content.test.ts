import { describe, expect, it } from "vitest";

import * as busqueda from "@/content/busqueda-desesperada";
import * as confesiones from "@/content/confesiones-anonimas";
import * as olimpiadas from "@/content/olimpiadas-calesita";
import * as preguntados from "@/content/preguntados-calesita";
import * as busquedaGame from "@/games/busqueda-desesperada/logic";
import * as confesionesGame from "@/games/confesiones-anonimas/logic";
import * as olimpiadasGame from "@/games/olimpiadas-calesita/logic";
import * as preguntadosGame from "@/games/preguntados-calesita/logic";
import { createSession } from "@/games/rounds/logic";

const unique = (values: readonly string[]) => new Set(values).size === values.length;

describe("round games content", () => {
  it("has unique ids and texts, and rules, in every game", () => {
    expect(unique(busqueda.SEARCH_IDS) && unique(busqueda.SEARCHES.map((c) => c.text))).toBe(true);
    expect(unique(confesiones.TOPIC_IDS) && unique(confesiones.TOPICS.map((c) => c.text))).toBe(true);
    expect(unique(olimpiadas.EVENT_IDS) && unique(olimpiadas.EVENTS.map((c) => c.title))).toBe(true);
    expect(unique(preguntados.QUESTION_IDS) && unique(preguntados.QUESTIONS.map((c) => c.text))).toBe(true);
    for (const rules of [busqueda.RULES, confesiones.RULES, olimpiadas.RULES, preguntados.RULES]) {
      expect(rules.length).toBeGreaterThan(0);
    }
  });

  it("gives every question four different options and a valid answer", () => {
    for (const question of preguntados.QUESTIONS) {
      expect(question.options).toHaveLength(4);
      expect(unique(question.options)).toBe(true);
      expect(question.answer).toBeGreaterThanOrEqual(0);
      expect(question.answer).toBeLessThan(4);
    }
  });

  it("spreads the right answers over every position", () => {
    const positions = new Set(preguntados.QUESTIONS.map((question) => question.answer));
    expect(positions.size).toBe(4);
  });
});

describe("round games wiring", () => {
  const players = [
    { id: "player-1", name: "Ana", seatIds: ["player-1"] },
    { id: "player-2", name: "Beto", seatIds: ["player-2"] },
  ];

  it("times searches and events, and leaves questions and topics untimed", () => {
    const start = { type: "start", participants: players, rounds: 2 } as const;
    expect(busquedaGame.reduceSession(createSession(), start).game?.phase).toBe("ready");
    expect(olimpiadasGame.reduceSession(createSession(), start).game?.phase).toBe("ready");
    expect(preguntadosGame.reduceSession(createSession(), start).game?.phase).toBe("judging");
    expect(confesionesGame.reduceSession(createSession(), start).game?.phase).toBe("judging");
  });
});
