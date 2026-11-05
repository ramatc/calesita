import type { ContentItem } from "@/types/game";

export const PROMPT_CATEGORIES = [
  "Película",
  "Personaje",
  "Acción",
  "Situación absurda",
  "Objeto",
] as const;

export type PromptCategory = (typeof PROMPT_CATEGORIES)[number];

export type Prompt = ContentItem & {
  text: string;
  category: PromptCategory;
};

const TEXTS_BY_CATEGORY: Record<PromptCategory, readonly string[]> = {
  Película: [
    "Titanic",
    "El Rey León",
    "Harry Potter",
    "Star Wars",
    "Toy Story",
    "Shrek",
    "Jurassic Park",
    "Tiburón",
    "Buscando a Nemo",
    "Rocky",
    "Piratas del Caribe",
    "Volver al futuro",
  ],
  Personaje: [
    "Un pirata",
    "Una momia",
    "Un vampiro",
    "Un robot",
    "Una bombera",
    "Un mago",
    "Una astronauta",
    "Un cowboy",
    "Un zombi",
    "Una ninja",
    "Un técnico de fútbol",
    "Una sirena",
  ],
  Acción: [
    "Cebar un mate",
    "Prender el fuego del asado",
    "Lavarse los dientes",
    "Andar en bicicleta",
    "Pescar",
    "Tocar la guitarra",
    "Atarse los cordones",
    "Inflar un globo",
    "Pasear al perro",
    "Pintar una pared",
    "Planchar una camisa",
    "Cruzar un arroyo saltando piedras",
  ],
  "Situación absurda": [
    "Correr el colectivo con una torta en la mano",
    "Bailar con una escoba en una fiesta",
    "Un pingüino perdido en la playa",
    "Pelearse con una puerta automática",
    "No poder abrir un frasco en una cita",
    "Esconderse de una paloma",
    "Patinar sobre hielo en ojotas",
    "Bañarse con paraguas",
    "Un gato manejando un taxi",
    "Buscar los anteojos que tenés puestos",
    "Perder una carrera contra una tortuga",
    "Hablar por teléfono con una banana",
  ],
  Objeto: [
    "Un paraguas",
    "Una tijera",
    "Una licuadora",
    "Una aspiradora",
    "Una escalera",
    "Un despertador",
    "Un semáforo",
    "Un ventilador",
    "Un cepillo de dientes",
    "Un control remoto",
    "Un secador de pelo",
    "Una tostadora",
  ],
};

export const PROMPTS: readonly Prompt[] = PROMPT_CATEGORIES.flatMap((category) =>
  TEXTS_BY_CATEGORY[category].map((text) => ({ text, category })),
).map((prompt, index) => ({
  ...prompt,
  id: `act-${String(index + 1).padStart(3, "0")}`,
  packId: "base",
}));

export const PROMPT_IDS = PROMPTS.map((prompt) => prompt.id);

export function getPrompt(id: string): Prompt | undefined {
  return PROMPTS.find((prompt) => prompt.id === id);
}

export const RULES: readonly string[] = [
  "Armen dos equipos y elijan cuánto dura cada turno.",
  "Quien actúa mira la consigna en secreto y la representa sin hablar.",
  "Su equipo intenta adivinar antes de que se acabe el tiempo.",
  "Cada acierto suma un punto. Si se traban, pasen a la siguiente sin sumar.",
  "Al terminar las rondas, gana el equipo con más puntos.",
];
