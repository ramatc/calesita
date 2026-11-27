import type { Challenge } from "@/content/desafio-relampago";
import type { GameDifficulty } from "@/types/game";

type Draft = Pick<Challenge, "title" | "difficulty">;

const INSTRUCTIONS =
  "Elegí en secreto si vas a contar algo real o inventado. El grupo pregunta, debate y vota.";

/**
 * Light, everyday topics: nobody has to share anything private.
 * New entries go at the end, so existing ids keep their meaning in stored games.
 */
const DRAFTS: readonly Draft[] = [
  { title: "Contá la comida más rara que probaste.", difficulty: "easy" },
  { title: "Contá un viaje que salió mal.", difficulty: "easy" },
  { title: "Contá algo que te pasó en la escuela.", difficulty: "easy" },
  { title: "Contá tu primer trabajo.", difficulty: "easy" },
  { title: "Contá una vez que conociste a alguien famoso.", difficulty: "medium" },
  { title: "Contá un talento oculto que tenés.", difficulty: "medium" },
  { title: "Contá la mascota más extraña que tuviste.", difficulty: "medium" },
  { title: "Contá una vez que te perdiste.", difficulty: "easy" },
  { title: "Contá el regalo más raro que recibiste.", difficulty: "easy" },
  { title: "Contá algo que rompiste y nadie se enteró.", difficulty: "medium" },
  { title: "Contá una vez que te confundieron con otra persona.", difficulty: "medium" },
  { title: "Contá un deporte que practicaste.", difficulty: "easy" },
  { title: "Contá el peor corte de pelo que tuviste.", difficulty: "easy" },
  { title: "Contá una vez que ganaste algo.", difficulty: "medium" },
  { title: "Contá un récord personal raro.", difficulty: "hard" },
  { title: "Contá una vez que hiciste algo muy valiente.", difficulty: "hard" },
  { title: "Contá algo insólito que te pasó en un colectivo.", difficulty: "medium" },
  { title: "Contá una vez que llegaste tardísimo a algo importante.", difficulty: "easy" },
  { title: "Contá un sueño que se hizo realidad.", difficulty: "hard" },
  { title: "Contá la anécdota más increíble de tu familia.", difficulty: "hard" },
];

export const CHALLENGES: readonly Challenge[] = DRAFTS.map((draft, index) => ({
  id: `mov-${String(index + 1).padStart(3, "0")}`,
  packId: "base",
  instructions: INSTRUCTIONS,
  ...draft,
}));

export const CHALLENGE_IDS = CHALLENGES.map((challenge) => challenge.id);

export function getChallengeIds(difficulty: GameDifficulty): string[] {
  return CHALLENGES.filter((challenge) => challenge.difficulty === difficulty).map(
    (challenge) => challenge.id,
  );
}

export function getChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((challenge) => challenge.id === id);
}

export const RULES: readonly string[] = [
  "En cada turno, una persona recibe un tema.",
  "Decide en secreto si cuenta algo real o se lo inventa, y lo cuenta.",
  "El resto le hace preguntas y vota: ¿mentira o verdad?",
  "Quien cuenta revela la respuesta. Si engañó al grupo, suma; si lo descubrieron, no.",
  "Cualquiera puede saltar un tema, sin penalidad. Gana quien engañe más veces.",
];
