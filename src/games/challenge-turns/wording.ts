/** The words a challenge game uses for its turns and outcomes. */
export type ChallengeWording = {
  /** Counter label, such as "Desafío 3". */
  turn: string;
  completed: string;
  failed: string;
  completedPlural: string;
  failedPlural: string;
};

export const DEFAULT_WORDING: ChallengeWording = {
  turn: "Desafío",
  completed: "Completado",
  failed: "Fallido",
  completedPlural: "Completados",
  failedPlural: "Fallidos",
};
