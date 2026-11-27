import type { Challenge } from "@/content/desafio-relampago";
import type { GameDifficulty } from "@/types/game";

type Draft = Pick<Challenge, "title" | "instructions" | "difficulty">;

/** Every challenge plays against the same clock: that is the game. */
export const CHALLENGE_SECONDS = 60;

/**
 * Household objects only, nothing sharp, hot or breakable.
 * New entries go at the end, so existing ids keep their meaning in stored games.
 */
const DRAFTS: readonly Draft[] = [
  {
    title: "Torre de vasos",
    instructions: "Apilá 10 vasos de plástico en pirámide y que quede parada.",
    difficulty: "easy",
  },
  {
    title: "Medias al balde",
    instructions: "Hacé bollos con medias y embocá 3 en un balde desde dos metros.",
    difficulty: "easy",
  },
  {
    title: "Fideos ensartados",
    instructions:
      "Con un fideo largo en la boca, ensartá 5 fideos cortos tipo tubo, sin usar las manos.",
    difficulty: "medium",
  },
  {
    title: "Galletita viajera",
    instructions: "Poné una galletita en la frente y llevala a la boca solo moviendo la cara.",
    difficulty: "medium",
  },
  {
    title: "Ropa doblada",
    instructions: "Doblá 5 remeras bien dobladas, una encima de la otra.",
    difficulty: "easy",
  },
  {
    title: "Soplo certero",
    instructions:
      "Con un sorbete, soplá una pelotita de papel de punta a punta de la mesa sin que se caiga.",
    difficulty: "easy",
  },
  {
    title: "Monedas en el codo",
    instructions:
      "Apoyá 3 monedas en el codo doblado, bajá el brazo rápido y atrapalas con la misma mano.",
    difficulty: "hard",
  },
  {
    title: "Rollo infinito",
    instructions: "Desenrollá todo un rollo de papel higiénico con una sola mano, sin que se corte.",
    difficulty: "medium",
  },
  {
    title: "Clasificador de colores",
    instructions: "Separá por color una mezcla de 20 botones, caramelos o tapitas.",
    difficulty: "easy",
  },
  {
    title: "Castillo de naipes",
    instructions: "Armá un castillo de cartas de dos pisos que se sostenga solo 3 segundos.",
    difficulty: "hard",
  },
  {
    title: "Pelotita en la cuchara",
    instructions:
      "Con una cuchara en la boca y una pelotita encima, cruzá la habitación ida y vuelta.",
    difficulty: "medium",
  },
  {
    title: "Globo cabeceador",
    instructions: "Mantené un globo en el aire sin que toque el piso, usando solo la cabeza.",
    difficulty: "medium",
  },
  {
    title: "Palitos chinos",
    instructions: "Pasá 10 porotos de un plato a otro usando dos lápices como palitos.",
    difficulty: "hard",
  },
  {
    title: "Botella parada",
    instructions:
      "Tirá una botella de plástico con un poco de agua para que dé una vuelta y caiga parada.",
    difficulty: "hard",
  },
  {
    title: "Escritura al revés",
    instructions:
      "Escribí tu nombre completo tres veces con la mano que no usás, y que se entienda.",
    difficulty: "easy",
  },
  {
    title: "De tres en tres",
    instructions:
      "Contá de 3 en 3 hasta 99 en voz alta, aplaudiendo en cada número. Si te equivocás, empezás de nuevo.",
    difficulty: "medium",
  },
  {
    title: "Pila de monedas",
    instructions: "Apilá 15 monedas en una torre con una sola mano.",
    difficulty: "medium",
  },
  {
    title: "Hoja escurridiza",
    instructions:
      "Sacá una hoja de abajo de un vaso de plástico con agua, sin tocar el vaso ni derramar.",
    difficulty: "hard",
  },
  {
    title: "Moño a ciegas",
    instructions: "Con los ojos cerrados, atá los cordones de una zapatilla con moño.",
    difficulty: "easy",
  },
  {
    title: "Puntería de tapitas",
    instructions: "Deslizá tapitas sobre la mesa hasta que 3 queden dentro de un círculo de papel.",
    difficulty: "medium",
  },
  {
    title: "Naranja con la nariz",
    instructions: "Empujá una naranja con la nariz de una punta a la otra de la habitación.",
    difficulty: "easy",
  },
  {
    title: "Trabalenguas triple",
    instructions:
      "Decí «tres tristes tigres tragaban trigo en un trigal» cinco veces seguidas sin trabarte.",
    difficulty: "hard",
  },
];

export const CHALLENGES: readonly Challenge[] = DRAFTS.map((draft, index) => ({
  id: `min-${String(index + 1).padStart(3, "0")}`,
  packId: "base",
  timerSeconds: CHALLENGE_SECONDS,
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
  "En cada turno, una persona recibe una prueba con cosas de la casa.",
  "Preparen los objetos y arranquen el cronómetro: hay un minuto.",
  "Si la logra antes de que termine, es completada. Si no, fallida.",
  "Cualquiera puede saltar una prueba, sin penalidad. Gana quien complete más.",
];
