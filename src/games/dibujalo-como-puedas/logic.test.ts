import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DRAWINGS, getDrawing, RULES } from "@/content/dibujalo-como-puedas";
import { isSession, reduceSession } from "@/games/dibujalo-como-puedas/logic";
import { renderDrawing } from "@/games/dibujalo-como-puedas/screen";
import { createSession } from "@/games/team-turns/logic";

const NOW = 1_000_000;

function acting() {
  const handoff = reduceSession(createSession(), {
    type: "start",
    players: 4,
    teamNames: [],
    turnSeconds: 90,
    rounds: 2,
  });
  return reduceSession(handoff, { type: "begin-turn", now: NOW });
}

describe("dibujalo como puedas content", () => {
  it("has unique ids and texts", () => {
    expect(new Set(DRAWINGS.map((item) => item.id)).size).toBe(DRAWINGS.length);
    expect(new Set(DRAWINGS.map((item) => item.text)).size).toBe(DRAWINGS.length);
    expect(RULES.length).toBeGreaterThan(0);
  });
});

describe("dibujalo como puedas game", () => {
  it("deals a drawing when the turn begins and scores a hit for the team", () => {
    const session = acting();
    expect(getDrawing(session.game?.promptId ?? "")).toBeDefined();
    const hit = reduceSession(session, { type: "hit", now: NOW + 1000 });
    expect(hit.game?.teams[0].score).toBe(1);
  });

  it("validates its own stored sessions only", () => {
    const session = acting();
    expect(isSession(session)).toBe(true);
    expect(isSession({ ...session, game: { ...session.game!, promptId: "act-001" } })).toBe(false);
  });

  it("shows the drawing with its category", () => {
    const drawing = DRAWINGS[0];
    const html = renderToStaticMarkup(createElement(() => renderDrawing(drawing.id)));
    expect(html).toContain(drawing.text);
    expect(html).toContain(drawing.category);
  });
});
