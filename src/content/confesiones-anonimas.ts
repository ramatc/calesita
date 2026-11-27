import type { ContentItem } from "@/types/game";

export type ConfessionTopic = ContentItem & {
  text: string;
};

/**
 * Light topics: nothing that exposes anyone. New entries go at the end, so
 * existing ids keep their meaning in stored games.
 */
const TEXTS: readonly string[] = [
  "Algo que hacés cuando nadie te ve.",
  "Tu placer culposo en la comida.",
  "Una canción que te sabés entera y no lo admitirías.",
  "La excusa más rara que usaste para no ir a algún lado.",
  "Algo que te da miedo y no tiene sentido.",
  "Una mentira piadosa que dijiste esta semana.",
  "Un hábito raro que tenés.",
  "Lo más vergonzoso que buscaste en internet.",
  "Una serie o película que viste más de cinco veces.",
  "Algo que hacías de chico y todavía hacés.",
  "Una manía que tenés con el orden o la limpieza.",
  "El apodo más raro que te pusieron.",
  "Algo que nunca aprendiste a hacer.",
  "La compra más inútil que hiciste.",
  "Una superstición que seguís.",
  "Algo que te hace llorar siempre.",
  "Tu peor cocinada.",
  "Un famoso que te cae mal sin motivo.",
  "Algo que fingiste que te gustaba.",
  "La vez que más te reíste en un momento serio.",
];

export const TOPICS: readonly ConfessionTopic[] = TEXTS.map((text, index) => ({
  id: `con-${String(index + 1).padStart(3, "0")}`,
  packId: "base",
  text,
}));

export const TOPIC_IDS = TOPICS.map((topic) => topic.id);

export function getTopic(id: string): ConfessionTopic | undefined {
  return TOPICS.find((topic) => topic.id === id);
}

export const RULES: readonly string[] = [
  "Consigan un papelito y algo para escribir cada uno.",
  "En cada ronda aparece un tema: todos escriben una confesión, sin firmar.",
  "Doblen los papeles, mézclenlos y que alguien los lea en voz alta.",
  "Para cada confesión, el grupo adivina de quién es.",
  "Marquen en la app a quienes adivinaron: cada uno suma un punto.",
];
