import { describe, expect, it } from "vitest";

import { LETTERS, ROSCO_SECONDS, ROSCOS } from "@/content/la-rosca";
import {
  countStatus,
  getWinnerIndex,
  reduceSession,
  type Action,
  type Session,
} from "@/games/la-rosca/logic";

const ROSCO_IDS = ["rosca-1", "rosca-2"];

function play(actions: readonly Action[]): Session {
  return actions.reduce(reduceSession, { game: null } as Session);
}

const start: Action = { type: "start", players: 4, teamNames: [], roscoIds: ROSCO_IDS };

describe("La Rosca content", () => {
  it("has one clue per rosco letter, matching its kind", () => {
    for (const rosco of ROSCOS) {
      expect(rosco.clues.map((clue) => clue.letter)).toEqual([...LETTERS]);
      for (const clue of rosco.clues) {
        const answer = clue.answer.toUpperCase();
        if (clue.kind === "starts") expect(answer.normalize("NFD")[0]).toBe(clue.letter.normalize("NFD")[0]);
        else expect(answer).toContain(clue.letter);
      }
    }
  });
});

describe("La Rosca", () => {
  it("gives each team its own rosco and clock", () => {
    const { game } = play([start]);
    expect(game?.teams.map((team) => team.roscoId)).toEqual(ROSCO_IDS);
    expect(game?.teams.every((team) => team.timer.remainingMs === ROSCO_SECONDS * 1000)).toBe(true);
  });

  it("keeps the turn after a correct answer", () => {
    const { game } = play([start, { type: "begin-turn", now: 0 }, { type: "answer", result: "correct", now: 1 }]);
    expect(game?.turnIndex).toBe(0);
    expect(game?.phase).toBe("playing");
    expect(game?.teams[0].cursor).toBe(1);
  });

  it("passes the turn and stops the clock after a miss", () => {
    const { game } = play([start, { type: "begin-turn", now: 0 }, { type: "answer", result: "wrong", now: 5000 }]);
    expect(game?.teams[0].statuses[0]).toBe("wrong");
    expect(game?.turnIndex).toBe(1);
    expect(game?.phase).toBe("handoff");
    expect(game?.teams[0].timer).toMatchObject({ deadlineMs: null, remainingMs: ROSCO_SECONDS * 1000 - 5000 });
  });

  it("leaves a passed letter pending for the next lap", () => {
    const { game } = play([start, { type: "begin-turn", now: 0 }, { type: "answer", result: "pass", now: 1 }]);
    expect(game?.teams[0].statuses[0]).toBe("pending");
    expect(game?.teams[0].cursor).toBe(1);
    expect(game?.turnIndex).toBe(1);
  });

  it("comes back to passed letters after the last one", () => {
    const actions: Action[] = [start, { type: "begin-turn", now: 0 }, { type: "answer", result: "pass", now: 1 }];
    actions.push({ type: "begin-turn", now: 2 }, { type: "answer", result: "wrong", now: 3 });
    actions.push({ type: "begin-turn", now: 4 });
    for (let i = 1; i < LETTERS.length; i += 1) actions.push({ type: "answer", result: "correct", now: 5 });
    const { game } = play(actions);
    expect(game?.teams[0].cursor).toBe(0);
    expect(countStatus(game!.teams[0], "pending")).toBe(1);
  });

  it("ends the team's rosco when time runs out and lets the rival keep playing", () => {
    const { game } = play([
      start,
      { type: "begin-turn", now: 0 },
      { type: "expire", now: ROSCO_SECONDS * 1000 },
      { type: "begin-turn", now: 0 },
      { type: "answer", result: "wrong", now: 1 },
    ]);
    expect(game?.turnIndex).toBe(1);
    expect(game?.phase).toBe("handoff");
  });

  it("finishes when both roscos are over and picks the team with more correct answers", () => {
    const { game } = play([
      start,
      { type: "begin-turn", now: 0 },
      { type: "answer", result: "correct", now: 1 },
      { type: "expire", now: ROSCO_SECONDS * 1000 },
      { type: "begin-turn", now: 0 },
      { type: "expire", now: ROSCO_SECONDS * 1000 },
    ]);
    expect(game?.phase).toBe("finished");
    expect(getWinnerIndex(game!)).toBe(0);
  });

  it("breaks a tie on correct answers by fewer mistakes", () => {
    const { game } = play([
      start,
      { type: "begin-turn", now: 0 },
      { type: "answer", result: "wrong", now: 1 },
      { type: "begin-turn", now: 0 },
      { type: "expire", now: ROSCO_SECONDS * 1000 },
      { type: "begin-turn", now: 0 },
      { type: "expire", now: ROSCO_SECONDS * 1000 },
    ]);
    expect(game?.phase).toBe("finished");
    expect(getWinnerIndex(game!)).toBe(1);
  });
});
