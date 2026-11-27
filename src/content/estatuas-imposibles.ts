import type { Challenge } from "@/content/desafio-relampago";
import type { GameDifficulty } from "@/types/game";

type Draft = Pick<Challenge, "title" | "instructions" | "difficulty"> & { timerSeconds: number };

/**
 * Poses anyone can try on a flat floor, away from furniture.
 * New entries go at the end, so existing ids keep their meaning in stored games.
 */
const DRAFTS: readonly Draft[] = [
  {
    title: "El flamenco",
    instructions: "Parate en un pie, con los brazos abiertos como alas.",
    difficulty: "easy",
    timerSeconds: 15,
  },
  {
    title: "El pensador",
    instructions: "En cuclillas, con el codo en la rodilla y la mano en el mentón.",
    difficulty: "easy",
    timerSeconds: 15,
  },
  {
    title: "Superhéroe en vuelo",
    instructions: "Un brazo estirado hacia adelante, el otro atrás y una pierna levantada.",
    difficulty: "medium",
    timerSeconds: 15,
  },
  {
    title: "La tetera",
    instructions: "Una mano en la cintura, el otro brazo como pico y el cuerpo inclinado.",
    difficulty: "easy",
    timerSeconds: 10,
  },
  {
    title: "Estatua de la Libertad",
    instructions: "Un brazo bien alto con la antorcha imaginaria y cara seria.",
    difficulty: "easy",
    timerSeconds: 20,
  },
  {
    title: "El arquero",
    instructions: "Piernas abiertas, tensando un arco imaginario con un ojo cerrado.",
    difficulty: "medium",
    timerSeconds: 15,
  },
  {
    title: "Bailarina en puntas",
    instructions: "En puntas de pie, con los brazos en círculo sobre la cabeza.",
    difficulty: "medium",
    timerSeconds: 15,
  },
  {
    title: "El avión",
    instructions:
      "Inclinado hacia adelante sobre una pierna, con la otra estirada atrás y los brazos abiertos.",
    difficulty: "hard",
    timerSeconds: 15,
  },
  {
    title: "Silla invisible",
    instructions: "Espalda contra la pared, como sentado en una silla que no existe.",
    difficulty: "hard",
    timerSeconds: 20,
  },
  {
    title: "Risa congelada",
    instructions: "Cara de carcajada y manos en la panza, sin hacer ningún ruido.",
    difficulty: "medium",
    timerSeconds: 15,
  },
  {
    title: "El surfista",
    instructions: "Piernas abiertas y flexionadas, brazos en equilibrio sobre una ola imaginaria.",
    difficulty: "easy",
    timerSeconds: 15,
  },
  {
    title: "El árbol",
    instructions: "Un pie apoyado en la pantorrilla de la otra pierna y las manos juntas arriba.",
    difficulty: "medium",
    timerSeconds: 20,
  },
  {
    title: "A ciegas en un pie",
    instructions: "Parado en un pie, con los ojos cerrados y los brazos cruzados.",
    difficulty: "hard",
    timerSeconds: 10,
  },
  {
    title: "Foto de egresados",
    instructions: "Pose ganadora con los dos pulgares arriba y la sonrisa más grande.",
    difficulty: "easy",
    timerSeconds: 20,
  },
  {
    title: "Robot sin batería",
    instructions: "Brazos rígidos en ángulo, una rodilla levantada y la mirada perdida.",
    difficulty: "medium",
    timerSeconds: 15,
  },
  {
    title: "El puente",
    instructions:
      "Sentado en el piso, levantá la cadera con manos y pies apoyados, panza para arriba.",
    difficulty: "hard",
    timerSeconds: 15,
  },
];

export const CHALLENGES: readonly Challenge[] = DRAFTS.map((draft, index) => ({
  id: `est-${String(index + 1).padStart(3, "0")}`,
  packId: "base",
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
  "En cada turno, una persona recibe una pose para copiar.",
  "Cuando esté en posición, arranquen el cronómetro.",
  "Si se mueve, se ríe o pierde el equilibrio antes de que termine, es fallida.",
  "Cualquiera puede saltar una pose, sin penalidad. Gana quien aguante más.",
];
