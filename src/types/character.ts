export type CharacterId =
  | "rama"
  | "aguysan"
  | "nehue"
  | "pili"
  | "piku"
  | "chino"
  | "agusmaxi";

/** A framing of the art. New poses join this union and the art record below. */
export type CharacterView = "portrait" | "full";

export type CharacterExpression = "neutral" | "celebrating" | "sad";

export type CharacterAvailability = "available" | "coming-soon";

export type CharacterArt = Record<CharacterView, string> & {
  /** Extra illustrations. Anything missing falls back to the base art of the view. */
  variants?: Partial<Record<`${CharacterView}-${CharacterExpression}`, string>>;
};

export type Character = {
  id: CharacterId;
  name: string;
  colors: { primary: string; secondary: string };
  art: CharacterArt;
  /** Visual accessories, as a description of the art. */
  accessories: readonly string[];
  availability: CharacterAvailability;
};
