import type { ContentItem } from "@/types/game";

export type OlympicEvent = ContentItem & {
  title: string;
  instructions: string;
  timerSeconds: number;
};

type Draft = Omit<OlympicEvent, "id" | "packId">;

/**
 * Team events with household objects, safe indoors. Each team sends one
 * athlete, or everyone, as the event says. New entries go at the end.
 */
const DRAFTS: readonly Draft[] = [
  { title: "Torre más alta", instructions: "Cada equipo arma la torre más alta que pueda con lo que tenga a mano. Gana la que siga en pie al final.", timerSeconds: 60 },
  { title: "Carrera de cucharas", instructions: "Un atleta por equipo cruza la habitación con un limón en una cuchara, ida y vuelta. Gana quien llegue primero sin que se caiga.", timerSeconds: 45 },
  { title: "Puntería con medias", instructions: "Por turnos, cada equipo tira 5 bollos de medias a un balde. Gana quien emboque más.", timerSeconds: 60 },
  { title: "Estatua olímpica", instructions: "Un atleta por equipo se para en un pie con los ojos cerrados. Gana quien aguante más.", timerSeconds: 60 },
  { title: "Soplo de equipo", instructions: "Cada equipo empuja una pelotita de papel soplando, de punta a punta de una mesa. Gana el primero.", timerSeconds: 45 },
  { title: "Lista relámpago", instructions: "Cada equipo escribe todas las frutas que pueda. Gana la lista más larga, sin repetidas.", timerSeconds: 45 },
  { title: "Globo en el aire", instructions: "Cada equipo mantiene un globo en el aire sin tocarlo con las manos. Gana el que aguante más.", timerSeconds: 60 },
  { title: "Pila de monedas", instructions: "Un atleta por equipo apila monedas con una mano. Gana la pila más alta en pie.", timerSeconds: 45 },
  { title: "Mímica en cadena", instructions: "El equipo pasa una palabra de mímica en cadena, del primero al último. Gana el que la adivine bien.", timerSeconds: 60 },
  { title: "Vasos en pirámide", instructions: "Cada equipo arma una pirámide de vasos de plástico. Gana la más alta terminada.", timerSeconds: 60 },
  { title: "Trabalenguas", instructions: "Un atleta por equipo dice «tres tristes tigres» lo más rápido posible sin trabarse. El grupo elige al ganador.", timerSeconds: 30 },
  { title: "Bollo al vaso", instructions: "Por turnos, cada equipo intenta meter un bollito de papel en un vaso soplando por un sorbete. Gana quien más meta.", timerSeconds: 60 },
];

export const EVENTS: readonly OlympicEvent[] = DRAFTS.map((draft, index) => ({
  ...draft,
  id: `oli-${String(index + 1).padStart(3, "0")}`,
  packId: "base",
}));

export const EVENT_IDS = EVENTS.map((event) => event.id);

export function getEvent(id: string): OlympicEvent | undefined {
  return EVENTS.find((event) => event.id === id);
}

export const RULES: readonly string[] = [
  "Armen dos equipos y elijan cuántas pruebas van a jugar.",
  "En cada prueba aparecen las instrucciones y el tiempo.",
  "Preparen todo y arranquen el cronómetro: compiten los dos equipos.",
  "Al final, marquen qué equipo ganó la prueba, o empate.",
  "Gana las Olimpiadas el equipo con más pruebas ganadas.",
];
