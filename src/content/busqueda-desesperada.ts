import type { ContentItem } from "@/types/game";

export type SearchCard = ContentItem & {
  text: string;
  timerSeconds: number;
};

/**
 * Things most homes have. Nothing that needs climbing, running down stairs or
 * going outside. New entries go at the end, so existing ids keep their meaning.
 */
const DRAFTS: readonly (readonly [string, number])[] = [
  ["Algo rojo", 30],
  ["Una cuchara", 30],
  ["Algo que haga ruido", 30],
  ["Una media", 30],
  ["Algo más chico que una moneda", 45],
  ["Algo redondo", 30],
  ["Un libro", 45],
  ["Algo que tenga números", 30],
  ["Algo de madera", 30],
  ["Algo que se pueda comer", 45],
  ["Algo amarillo", 30],
  ["Un objeto con botones", 45],
  ["Algo suave", 30],
  ["Una foto o un dibujo", 45],
  ["Algo que empiece con la letra P", 45],
  ["Un cable", 30],
  ["Algo que brille", 45],
  ["Algo con rayas", 45],
  ["Un juguete", 45],
  ["Algo de metal", 30],
  ["Algo que se use en el baño", 30],
  ["Algo con olor rico", 45],
  ["Algo más largo que tu brazo", 45],
  ["Algo verde", 30],
];

export const SEARCHES: readonly SearchCard[] = DRAFTS.map(([text, timerSeconds], index) => ({
  id: `bus-${String(index + 1).padStart(3, "0")}`,
  packId: "base",
  text,
  timerSeconds,
}));

export const SEARCH_IDS = SEARCHES.map((card) => card.id);

export function getSearch(id: string): SearchCard | undefined {
  return SEARCHES.find((card) => card.id === id);
}

export const RULES: readonly string[] = [
  "Elijan cuántas rondas juegan.",
  "En cada ronda aparece algo para buscar en la casa.",
  "Arranquen el cronómetro: todos salen a buscar a la vez, caminando.",
  "Quien vuelve primero con lo pedido suma un punto.",
  "Al terminar las rondas, gana quien tenga más puntos.",
];
