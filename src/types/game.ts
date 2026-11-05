export type GameCategory = "classic" | "social" | "physical";

export type GameDifficulty = "easy" | "medium" | "hard";

export type GameStatus = "available" | "coming-soon";

export type NumericRange = {
  min: number;
  max: number;
};

/** Catalog entry. Playable behavior lives in the game's own module. */
export type GameDefinition = {
  slug: string;
  name: string;
  description: string;
  category: GameCategory;
  players: NumericRange;
  durationMinutes: NumericRange;
  materials: string[];
  difficulty: GameDifficulty;
  status: GameStatus;
};

/** Base shape for any prompt or card; each game extends it with its own fields. */
export type ContentItem = {
  id: string;
  /** Lets themed or user-made packs add content without touching the built-in set. */
  packId: string;
};
