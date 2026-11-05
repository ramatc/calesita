export type GameCategory = "classic" | "social" | "physical";

export type GameDifficulty = "easy" | "medium" | "hard";

export type GameStatus = "available" | "coming-soon";

export type GameMaterial = "paper" | "household-objects";

export type GameSlug =
  | "actua-o-perdes"
  | "palabras-prohibidas"
  | "preguntados-calesita"
  | "dibujalo-como-puedas"
  | "categorias-explosivas"
  | "el-infiltrado"
  | "quien-es-mas-probable-que"
  | "mentira-o-verdad"
  | "defende-lo-indefendible"
  | "confesiones-anonimas"
  | "desafio-relampago"
  | "busqueda-desesperada"
  | "estatuas-imposibles"
  | "un-minuto-para-ganar"
  | "olimpiadas-calesita";

export type NumericRange = {
  min: number;
  max: number;
};

/** Catalog entry. Playable behavior lives in the game's own module. */
export type GameDefinition = {
  slug: GameSlug;
  name: string;
  description: string;
  category: GameCategory;
  players: NumericRange;
  durationMinutes: NumericRange;
  /** Empty means the shared device is all the group needs. */
  materials: GameMaterial[];
  difficulty: GameDifficulty;
  status: GameStatus;
  /** Short steps shown before playing. Required in practice once a game is available. */
  rules?: readonly string[];
};

/** Base shape for any prompt or card; each game extends it with its own fields. */
export type ContentItem = {
  id: string;
  /** Lets themed or user-made packs add content without touching the built-in set. */
  packId: string;
};
