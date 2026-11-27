import type { Challenge } from "@/content/desafio-relampago";
import type { GameDifficulty } from "@/types/game";

type Draft = Pick<Challenge, "title" | "difficulty">;

/** Every speech gets the same time, so nobody can stretch a weak argument. */
export const SPEECH_SECONDS = 45;

const INSTRUCTIONS = "Defendé esta postura con total convicción. Al final, el grupo vota si te creyó.";

/**
 * Harmless, absurd opinions: nothing about real people, groups or tragedies.
 * New entries go at the end, so existing ids keep their meaning in stored games.
 */
const DRAFTS: readonly Draft[] = [
  { title: "La pizza fría es mejor que la caliente.", difficulty: "easy" },
  { title: "Las medias con sandalias son lo más elegante que existe.", difficulty: "easy" },
  { title: "El lunes es el mejor día de la semana.", difficulty: "easy" },
  { title: "Hay que ponerle ketchup al mate.", difficulty: "medium" },
  { title: "Las palomas son las verdaderas dueñas de la ciudad.", difficulty: "medium" },
  { title: "Dormir con el despertador a todo volumen es más sano.", difficulty: "medium" },
  { title: "Los dinosaurios nunca existieron: eran lagartijas grandes.", difficulty: "hard" },
  { title: "El agua es demasiado mojada.", difficulty: "hard" },
  { title: "La siesta debería ser obligatoria por ley.", difficulty: "easy" },
  { title: "Comer el postre antes de la comida es lo correcto.", difficulty: "easy" },
  { title: "Los gatos están planeando dominar el mundo.", difficulty: "medium" },
  { title: "Habría que caminar para atrás para no gastar las zapatillas.", difficulty: "hard" },
  { title: "Las vacaciones en invierno son mejores que en verano.", difficulty: "easy" },
  { title: "El control remoto debería estar prohibido.", difficulty: "medium" },
  { title: "Las verduras tienen sentimientos.", difficulty: "hard" },
  { title: "Bañarse una vez por semana alcanza y sobra.", difficulty: "medium" },
  { title: "Los aviones vuelan porque los pasajeros creen en ellos.", difficulty: "hard" },
  { title: "La mejor música para un cumpleaños es el himno nacional.", difficulty: "hard" },
  { title: "Las escaleras mecánicas son un invento innecesario.", difficulty: "medium" },
  { title: "El dulce de leche está sobrevalorado.", difficulty: "hard" },
];

export const CHALLENGES: readonly Challenge[] = DRAFTS.map((draft, index) => ({
  id: `def-${String(index + 1).padStart(3, "0")}`,
  packId: "base",
  instructions: INSTRUCTIONS,
  timerSeconds: SPEECH_SECONDS,
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
  "Elijan cuántos juegan y la dificultad.",
  "En cada turno, una persona recibe una postura absurda.",
  "Arranca el cronómetro y la defiende como si fuera la verdad absoluta.",
  "Al final, el grupo vota: si los convenció, suma; si no, no.",
  "Cualquiera puede saltar una postura, sin penalidad. Gana quien convenza más veces.",
];
