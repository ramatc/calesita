import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { getPrompt, PROMPTS } from "@/content/actua-o-perdes";
import { createSession, reduceSession, type Game } from "@/games/actua-o-perdes/logic";
import { ActingView, HandoffView, SummaryView } from "@/games/actua-o-perdes/play-views";

const NOW = 1_000_000;
const noop = () => {};

const handoff = reduceSession(createSession(), {
  type: "start",
  players: 4,
  teamNames: ["Los Pumas", "Las Leonas"],
  turnSeconds: 60,
  rounds: 2,
});
const acting = reduceSession(handoff, { type: "begin-turn", now: NOW });
const paused = reduceSession(acting, { type: "pause", now: NOW + 1000 });

function promptText(game: Game | null) {
  return getPrompt(game?.promptId ?? "")?.text ?? "";
}

function renderActing(game: Game | null) {
  if (!game) throw new Error("expected an active game");
  return renderToStaticMarkup(
    createElement(ActingView, {
      game,
      surface: "classic",
      onHit: noop,
      onPass: noop,
      onPause: noop,
      onResume: noop,
      onExpire: noop,
    }),
  );
}

describe("secret prompt", () => {
  it("is on screen with its category while acting", () => {
    const html = renderActing(acting.game);
    expect(html).toContain(promptText(acting.game));
    expect(html).toContain(getPrompt(acting.game?.promptId ?? "")?.category);
  });

  it("is hidden and both buttons are blocked while paused", () => {
    const html = renderActing(paused.game);
    expect(html).not.toContain(promptText(paused.game));
    expect(html).not.toContain(getPrompt(paused.game?.promptId ?? "")?.category);
    expect(html.match(/<button[^>]* disabled=""/g)).toHaveLength(2);
  });

  it("is nowhere in the handoff markup, which names the team", () => {
    const game = handoff.game;
    if (!game) throw new Error("expected an active game");
    const html = renderToStaticMarkup(createElement(HandoffView, { game, onBeginTurn: noop }));
    expect(html).toContain("Le toca a Los Pumas");
    for (const prompt of PROMPTS) expect(html).not.toContain(prompt.text);
  });
});

describe("turn summary", () => {
  it("shows the turn's points and hands over to the other team", () => {
    const hit = reduceSession(acting, { type: "hit", now: NOW });
    const summary = reduceSession(hit, { type: "expire", now: NOW + 60_000 });
    const game = summary.game;
    if (!game) throw new Error("expected an active game");

    const html = renderToStaticMarkup(createElement(SummaryView, { game, onNext: noop }));
    expect(html).toContain("Los Pumas sumó 1 punto en este turno.");
    expect(html).toContain("Sigue Las Leonas");
  });
});
