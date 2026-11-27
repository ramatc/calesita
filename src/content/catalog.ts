import { RULES as ACTUA_O_PERDES_RULES } from "@/content/actua-o-perdes";
import { RULES as CATEGORIAS_EXPLOSIVAS_RULES } from "@/content/categorias-explosivas";
import { RULES as DESAFIO_RELAMPAGO_RULES } from "@/content/desafio-relampago";
import { RULES as EL_INFILTRADO_RULES } from "@/content/el-infiltrado";
import { RULES as UN_MINUTO_PARA_GANAR_RULES } from "@/content/un-minuto-para-ganar";
import { RULES as ESTATUAS_IMPOSIBLES_RULES } from "@/content/estatuas-imposibles";
import { RULES as PALABRAS_PROHIBIDAS_RULES } from "@/content/palabras-prohibidas";
import { RULES as DEFENDE_LO_INDEFENDIBLE_RULES } from "@/content/defende-lo-indefendible";
import { RULES as MENTIRA_O_VERDAD_RULES } from "@/content/mentira-o-verdad";
import { RULES as DIBUJALO_COMO_PUEDAS_RULES } from "@/content/dibujalo-como-puedas";
import { RULES as BUSQUEDA_DESESPERADA_RULES } from "@/content/busqueda-desesperada";
import { RULES as CONFESIONES_ANONIMAS_RULES } from "@/content/confesiones-anonimas";
import { RULES as OLIMPIADAS_CALESITA_RULES } from "@/content/olimpiadas-calesita";
import { RULES as PREGUNTADOS_CALESITA_RULES } from "@/content/preguntados-calesita";
import { RULES as LA_ROSCA_RULES } from "@/content/la-rosca";
import type { GameDefinition, GameSlug } from "@/types/game";

export const GAMES: readonly GameDefinition[] = [
  {
    slug: "actua-o-perdes",
    name: "Actuá o perdés",
    description: "Mímica por equipos contra reloj. Sin hablar y sin hacer trampa.",
    category: "classic",
    players: { min: 4, max: 16 },
    durationMinutes: { min: 20, max: 40 },
    materials: [],
    difficulty: "easy",
    status: "available",
    rules: ACTUA_O_PERDES_RULES,
  },
  {
    slug: "palabras-prohibidas",
    name: "Palabras prohibidas",
    description: "Hacé adivinar una palabra sin usar las que más te ayudarían.",
    category: "classic",
    players: { min: 4, max: 12 },
    durationMinutes: { min: 20, max: 30 },
    materials: [],
    difficulty: "medium",
    status: "available",
    rules: PALABRAS_PROHIBIDAS_RULES,
  },
  {
    slug: "preguntados-calesita",
    name: "Preguntados Calesita",
    description: "Trivia para descubrir quién sabe de todo y quién dice que sabe.",
    category: "classic",
    players: { min: 2, max: 10 },
    durationMinutes: { min: 15, max: 30 },
    materials: [],
    difficulty: "medium",
    status: "available",
    rules: PREGUNTADOS_CALESITA_RULES,
  },
  {
    slug: "dibujalo-como-puedas",
    name: "Dibujalo como puedas",
    description: "Dibujá la consigna antes de que se acabe el tiempo. El talento es opcional.",
    category: "classic",
    players: { min: 4, max: 12 },
    durationMinutes: { min: 20, max: 30 },
    materials: ["paper"],
    difficulty: "medium",
    status: "available",
    rules: DIBUJALO_COMO_PUEDAS_RULES,
  },
  {
    slug: "categorias-explosivas",
    name: "Categorías explosivas",
    description: "Decí algo de la categoría antes de que explote el turno. Nadie puede repetir.",
    category: "classic",
    players: { min: 2, max: 10 },
    durationMinutes: { min: 10, max: 20 },
    materials: [],
    difficulty: "medium",
    status: "available",
    rules: CATEGORIAS_EXPLOSIVAS_RULES,
  },
  {
    slug: "el-infiltrado",
    name: "El infiltrado",
    description: "Todos tienen la misma palabra, menos uno. Encontralo antes de que se escape.",
    category: "social",
    players: { min: 4, max: 12 },
    durationMinutes: { min: 10, max: 20 },
    materials: [],
    difficulty: "medium",
    status: "available",
    rules: EL_INFILTRADO_RULES,
  },
  {
    slug: "quien-es-mas-probable-que",
    name: "¿Quién es más probable que...?",
    description: "Una pregunta, tres segundos y todos señalan al mismo tiempo.",
    category: "social",
    players: { min: 3, max: 20 },
    durationMinutes: { min: 10, max: 30 },
    materials: [],
    difficulty: "easy",
    status: "available",
    rules: [
      "Lean la pregunta en voz alta.",
      "Toquen «Contar y señalar» y esperen la cuenta regresiva.",
      "Al llegar a cero, todos señalan al mismo tiempo al amigo que mejor encaja.",
      "Debatan todo lo que quieran. Acá no hay puntos.",
      "Pasen a la siguiente pregunta.",
    ],
  },
  {
    slug: "mentira-o-verdad",
    name: "Mentira o verdad",
    description: "Contá una historia y que el grupo adivine si pasó de verdad.",
    category: "social",
    players: { min: 3, max: 12 },
    durationMinutes: { min: 15, max: 25 },
    materials: [],
    difficulty: "easy",
    status: "available",
    rules: MENTIRA_O_VERDAD_RULES,
  },
  {
    slug: "defende-lo-indefendible",
    name: "Defendé lo indefendible",
    description: "Te toca una postura absurda y tenés que convencer a todos.",
    category: "social",
    players: { min: 3, max: 10 },
    durationMinutes: { min: 15, max: 30 },
    materials: [],
    difficulty: "hard",
    status: "available",
    rules: DEFENDE_LO_INDEFENDIBLE_RULES,
  },
  {
    slug: "confesiones-anonimas",
    name: "Confesiones anónimas",
    description: "Cada uno escribe una confesión y el grupo adivina de quién es.",
    category: "social",
    players: { min: 4, max: 12 },
    durationMinutes: { min: 15, max: 30 },
    materials: ["paper"],
    difficulty: "medium",
    status: "available",
    rules: CONFESIONES_ANONIMAS_RULES,
  },
  {
    slug: "desafio-relampago",
    name: "Desafío relámpago",
    description: "Retos físicos y sociales cortitos. Cualquiera se puede saltear.",
    category: "physical",
    players: { min: 2, max: 12 },
    durationMinutes: { min: 10, max: 30 },
    materials: ["household-objects"],
    difficulty: "medium",
    status: "available",
    rules: DESAFIO_RELAMPAGO_RULES,
  },
  {
    slug: "busqueda-desesperada",
    name: "Búsqueda desesperada",
    description: "Encontrá lo que pide la consigna antes que el resto.",
    category: "physical",
    players: { min: 3, max: 12 },
    durationMinutes: { min: 10, max: 20 },
    materials: ["household-objects"],
    difficulty: "easy",
    status: "available",
    rules: BUSQUEDA_DESESPERADA_RULES,
  },
  {
    slug: "estatuas-imposibles",
    name: "Estatuas imposibles",
    description: "Copiá la pose y quedate quieto. El que se mueve, pierde.",
    category: "physical",
    players: { min: 3, max: 12 },
    durationMinutes: { min: 10, max: 15 },
    materials: [],
    difficulty: "medium",
    status: "available",
    rules: ESTATUAS_IMPOSIBLES_RULES,
  },
  {
    slug: "un-minuto-para-ganar",
    name: "Un minuto para ganar",
    description: "Pruebas de habilidad con cosas de la casa y sesenta segundos en el reloj.",
    category: "physical",
    players: { min: 2, max: 12 },
    durationMinutes: { min: 15, max: 30 },
    materials: ["household-objects"],
    difficulty: "hard",
    status: "available",
    rules: UN_MINUTO_PARA_GANAR_RULES,
  },
  {
    slug: "olimpiadas-calesita",
    name: "Olimpiadas Calesita",
    description: "Varias pruebas seguidas, equipos rivales y un solo campeón.",
    category: "physical",
    players: { min: 4, max: 16 },
    durationMinutes: { min: 30, max: 45 },
    materials: ["household-objects"],
    difficulty: "hard",
    status: "available",
    rules: OLIMPIADAS_CALESITA_RULES,
  },
  {
    slug: "la-rosca",
    name: "La Rosca",
    description: "Dos equipos, dos roscas y 25 letras. Acertá, fallá o decí pasapalabra.",
    category: "classic",
    players: { min: 2, max: 16 },
    durationMinutes: { min: 10, max: 15 },
    materials: [],
    difficulty: "medium",
    status: "available",
    rules: LA_ROSCA_RULES,
  },
];

const FEATURED_SLUGS: readonly GameSlug[] = [
  "quien-es-mas-probable-que",
  "actua-o-perdes",
  "el-infiltrado",
  "desafio-relampago",
  "categorias-explosivas",
];

export const FEATURED_GAMES = GAMES.filter((game) =>
  FEATURED_SLUGS.includes(game.slug),
);

export function getGameBySlug(slug: string): GameDefinition | undefined {
  return GAMES.find((game) => game.slug === slug);
}
