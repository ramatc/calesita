/**
 * Lines the characters say in Calesita Alive. They are written for the app, not
 * quotes from the real friends. `{name}` is replaced with the character's name and
 * `{achievement}` with an achievement name. New lines go at the end of their context,
 * so existing ids keep their meaning in the session log.
 */

export const ALIVE_CONTEXTS = [
  "welcome",
  "firstGame",
  "matchStart",
  "victory",
  "defeat",
  "achievement",
  "hallVisit",
] as const;

export type AliveContext = (typeof ALIVE_CONTEXTS)[number];

export type AliveMessage = {
  id: string;
  text: string;
};

const LINES: Record<AliveContext, readonly string[]> = {
  welcome: [
    "¡Llegó la barra! Arranquemos que se enfría el fernet.",
    "¿Otra vez acá? Me encanta. Elegí un juego.",
    "Celulares en la mesa, que la juntada sigue girando.",
    "Insert coin y que empiece el quilombo.",
  ],
  firstGame: [
    "¿Primer juego de la noche? Arrancá por uno corto.",
    "Elegí uno y después no vale quejarse.",
    "Cualquiera de estos sirve para romper el hielo.",
  ],
  matchStart: [
    "Reglas claras, amistades largas. Leelas antes.",
    "Que nadie diga después que no sabía.",
    "Se juega limpio. Más o menos.",
  ],
  victory: [
    "¡Ganó {name}! Que alguien le saque una foto.",
    "{name} se lleva la sortija. Hay revancha.",
    "Aplausos para {name}, sin agrandarse.",
  ],
  defeat: [
    "Esta vez no salió. La revancha es ya.",
    "Perder también es parte del folclore.",
    "Nadie vio nada. Otra y la damos vuelta.",
  ],
  achievement: [
    "¡{name} desbloqueó {achievement}!",
    "Nuevo logro para {name}: {achievement}.",
  ],
  hallVisit: [
    "Bienvenidos al salón. Acá no se borra nada.",
    "Mirá la tabla y después hablamos.",
    "Los récords están para romperse.",
  ],
};

function withIds(context: AliveContext): readonly AliveMessage[] {
  return LINES[context].map((text, index) => ({ id: `${context}-${index + 1}`, text }));
}

export const ALIVE_MESSAGES: Record<AliveContext, readonly AliveMessage[]> = {
  welcome: withIds("welcome"),
  firstGame: withIds("firstGame"),
  matchStart: withIds("matchStart"),
  victory: withIds("victory"),
  defeat: withIds("defeat"),
  achievement: withIds("achievement"),
  hallVisit: withIds("hallVisit"),
};

export function fillMessage(text: string, values: { name?: string; achievement?: string }): string {
  return text
    .replaceAll("{name}", values.name ?? "")
    .replaceAll("{achievement}", values.achievement ?? "");
}
