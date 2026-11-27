import type { ContentItem } from "@/types/game";

export const DRAWING_CATEGORIES = ["Objeto", "Animal", "Lugar", "Acción", "Película"] as const;

export type DrawingCategory = (typeof DRAWING_CATEGORIES)[number];

export type Drawing = ContentItem & {
  text: string;
  category: DrawingCategory;
};

/** New entries go at the end of a category list, so existing ids keep their meaning. */
const TEXTS_BY_CATEGORY: Record<DrawingCategory, readonly string[]> = {
  Objeto: [
    "Un paraguas",
    "Una escalera",
    "Un ventilador",
    "Una tetera",
    "Un candado",
    "Una bicicleta",
    "Un sacacorchos",
    "Una lámpara",
    "Un reloj despertador",
    "Una mochila",
  ],
  Animal: [
    "Una jirafa",
    "Un pulpo",
    "Un caracol",
    "Un pingüino",
    "Un murciélago",
    "Un camello",
    "Una medusa",
    "Un canguro",
  ],
  Lugar: [
    "Un faro",
    "Una isla desierta",
    "Un castillo",
    "Una montaña rusa",
    "Un volcán",
    "Un iglú",
    "Una plaza",
    "Un estadio",
  ],
  Acción: [
    "Andar en skate",
    "Pescar",
    "Estornudar",
    "Hacer un asado",
    "Bucear",
    "Planchar",
    "Hacer malabares",
    "Tomar mate",
  ],
  Película: [
    "Titanic",
    "El Rey León",
    "Tiburón",
    "Toy Story",
    "Jurassic Park",
    "Harry Potter",
    "E.T.",
    "Frozen",
  ],
};

export const DRAWINGS: readonly Drawing[] = DRAWING_CATEGORIES.flatMap((category) =>
  TEXTS_BY_CATEGORY[category].map((text) => ({ text, category })),
).map((drawing, index) => ({
  ...drawing,
  id: `dib-${String(index + 1).padStart(3, "0")}`,
  packId: "base",
}));

export const DRAWING_IDS = DRAWINGS.map((drawing) => drawing.id);

export function getDrawing(id: string): Drawing | undefined {
  return DRAWINGS.find((drawing) => drawing.id === id);
}

export const RULES: readonly string[] = [
  "Armen dos equipos, consigan papel y lápiz, y elijan cuánto dura cada turno.",
  "Quien dibuja mira la consigna en secreto.",
  "Tiene que dibujarla sin letras, números ni gestos, mientras su equipo adivina.",
  "Cada acierto suma un punto. Si se traban, pasen a la siguiente sin sumar.",
  "Al terminar las rondas, gana el equipo con más puntos.",
];
