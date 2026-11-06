import type { ContentItem } from "@/types/game";

/** Two related words. Which one goes to the majority is decided per game. */
export type WordPair = ContentItem & {
  words: readonly [string, string];
};

export const RULES: readonly string[] = [
  "Todos reciben la misma palabra, menos uno: el infiltrado tiene otra parecida y no sabe que es el infiltrado.",
  "Pásense el celular. Cada uno toca Revelar, mira su palabra, toca Ocultar y se lo pasa al siguiente.",
  "Por turnos, cada uno da una pista de su palabra sin decirla.",
  "Debatan y voten en voz alta a quién creen que es el infiltrado. Marquen en la pantalla al elegido.",
  "Si eligen al infiltrado, gana el grupo. Si no, gana el infiltrado.",
];

const PAIRS: readonly (readonly [string, string])[] = [
  ["Playa", "Pileta"],
  ["Mate", "Café"],
  ["Perro", "Gato"],
  ["Pizza", "Empanada"],
  ["Avión", "Helicóptero"],
  ["Guitarra", "Violín"],
  ["Fútbol", "Básquet"],
  ["Cine", "Teatro"],
  ["Helado", "Flan"],
  ["Montaña", "Volcán"],
  ["Tren", "Subte"],
  ["Bicicleta", "Moto"],
  ["Doctor", "Enfermero"],
  ["Lluvia", "Nieve"],
  ["Sol", "Luna"],
  ["Libro", "Revista"],
  ["Celular", "Tablet"],
  ["Asado", "Choripán"],
  ["Medialuna", "Tostada"],
  ["Cumpleaños", "Casamiento"],
  ["Hospital", "Farmacia"],
  ["Escuela", "Universidad"],
  ["Piano", "Batería"],
  ["León", "Tigre"],
  ["Tiburón", "Delfín"],
  ["Manzana", "Pera"],
  ["Limón", "Naranja"],
  ["Silla", "Banco"],
  ["Cama", "Sillón"],
  ["Zapatilla", "Ojota"],
  ["Gorra", "Sombrero"],
  ["Paraguas", "Piloto"],
  ["Castillo", "Palacio"],
  ["Pirata", "Vikingo"],
  ["Bruja", "Hada"],
  ["Vampiro", "Zombi"],
  ["Payaso", "Mago"],
  ["Policía", "Bombero"],
  ["Supermercado", "Kiosco"],
  ["Río", "Lago"],
  ["Desierto", "Selva"],
  ["Heladera", "Freezer"],
  ["Cuchara", "Tenedor"],
  ["Taza", "Vaso"],
  ["Reloj", "Pulsera"],
  ["Carta", "Mensaje"],
  ["Fiesta", "Recital"],
  ["Abuelo", "Tío"],
];

export const WORD_PAIRS: readonly WordPair[] = PAIRS.map((words, index) => ({
  id: `pair-${String(index + 1).padStart(3, "0")}`,
  packId: "base",
  words,
}));

export const PAIR_IDS = WORD_PAIRS.map((pair) => pair.id);

export function getWordPair(id: string): WordPair | undefined {
  return WORD_PAIRS.find((pair) => pair.id === id);
}
