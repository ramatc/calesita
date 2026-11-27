/** Each letter is either the first letter of the answer or appears somewhere inside it. */
export type ClueKind = "starts" | "contains";

export type Clue = {
  letter: string;
  kind: ClueKind;
  definition: string;
  answer: string;
};

export type Rosco = {
  id: string;
  clues: readonly Clue[];
};

/** The letters of the TV rosco: the Spanish alphabet without K and W. */
export const LETTERS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "L", "M", "N",
  "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "X", "Y", "Z",
] as const;

/** Each team gets the whole rosco to itself: one clock, 25 letters. */
export const ROSCO_SECONDS = 150;

export const RULES: readonly string[] = [
  "Se arman dos equipos y cada uno tiene su propia rosca de 25 letras y su propio reloj.",
  "Alguien del equipo rival agarra el celular y lee la definición de cada letra en voz alta.",
  "Si aciertan, siguen con la letra que viene. Si fallan, la letra queda en rojo y le toca al otro equipo.",
  "Si no saben, digan «Pasapalabra»: la letra queda para la próxima vuelta y le toca al otro equipo.",
  "El reloj solo corre en el turno de cada equipo. La rosca termina al completar todas las letras o al quedarse sin tiempo.",
  "Gana el equipo con más aciertos. Si empatan, gana el que tuvo menos errores.",
];

type Entry = readonly [ClueKind, string, string];

function build(id: string, entries: readonly Entry[]): Rosco {
  return {
    id,
    clues: entries.map(([kind, definition, answer], index) => ({
      letter: LETTERS[index],
      kind,
      definition,
      answer,
    })),
  };
}

/** One entry per letter, in LETTERS order. */
export const ROSCOS: readonly Rosco[] = [
  build("rosca-1", [
    ["starts", "Fruta tropical con una corona de hojas arriba.", "Ananá"],
    ["starts", "Deporte de cinco por equipo en el que se encesta una pelota en un aro.", "Básquet"],
    ["starts", "Animal que relincha y se puede montar.", "Caballo"],
    ["starts", "Dulce argentino de leche y azúcar que se unta en las tostadas.", "Dulce de leche"],
    ["starts", "Masa rellena típica que se hace al horno o frita.", "Empanada"],
    ["starts", "Deporte más popular de la Argentina.", "Fútbol"],
    ["starts", "Instrumento musical de seis cuerdas.", "Guitarra"],
    ["starts", "Postre frío que se sirve en cucurucho.", "Helado"],
    ["starts", "Templo donde se reúnen los católicos.", "Iglesia"],
    ["starts", "Felino americano con manchas.", "Jaguar"],
    ["starts", "Satélite natural de la Tierra.", "Luna"],
    ["starts", "Infusión que se toma con bombilla.", "Mate"],
    ["starts", "Agua congelada que cae del cielo en copos.", "Nieve"],
    ["contains", "Lo contrario de grande.", "Pequeño"],
    ["starts", "Órgano con el que vemos.", "Ojo"],
    ["starts", "Comida redonda de origen italiano con salsa y muzzarella.", "Pizza"],
    ["starts", "Alimento que se hace cuajando la leche.", "Queso"],
    ["starts", "Objeto que marca la hora.", "Reloj"],
    ["starts", "Estrella que ilumina la Tierra.", "Sol"],
    ["starts", "Medio de transporte que va sobre rieles.", "Tren"],
    ["starts", "Fruta que crece en racimos y con la que se hace el vino.", "Uva"],
    ["starts", "Estación más calurosa del año.", "Verano"],
    ["contains", "Auto con chofer al que se le paga por viaje.", "Taxi"],
    ["starts", "Hierba con la que se prepara el mate.", "Yerba"],
    ["starts", "Calzado que cubre el pie.", "Zapato"],
  ]),
  build("rosca-2", [
    ["starts", "Vehículo con alas y motores que vuela.", "Avión"],
    ["starts", "Vehículo de dos ruedas que se mueve con pedales.", "Bicicleta"],
    ["starts", "Bebida oscura que se hace con granos tostados.", "Café"],
    ["starts", "Mamífero marino muy inteligente que salta fuera del agua.", "Delfín"],
    ["starts", "Animal enorme con trompa.", "Elefante"],
    ["starts", "Pasta larga y fina que se come con salsa.", "Fideo"],
    ["starts", "Animal doméstico que maúlla.", "Gato"],
    ["starts", "Lo que pone la gallina.", "Huevo"],
    ["starts", "Porción de tierra rodeada de agua.", "Isla"],
    ["starts", "Animal de cuello muy largo.", "Jirafa"],
    ["starts", "Felino conocido como el rey de la selva.", "León"],
    ["starts", "Elevación de tierra muy alta.", "Montaña"],
    ["starts", "Fruta cítrica que lleva el nombre de su color.", "Naranja"],
    ["starts", "Ave corredora de las pampas, parecida al avestruz.", "Ñandú"],
    ["starts", "Mamífero grande y peludo que hiberna en invierno.", "Oso"],
    ["starts", "Animal doméstico que ladra.", "Perro"],
    ["contains", "Espacio verde de la ciudad con árboles y juegos.", "Parque"],
    ["starts", "Animal chiquito de cola larga al que le gusta el queso.", "Ratón"],
    ["starts", "Condimento blanco que se le pone a la comida.", "Sal"],
    ["starts", "Fruto rojo que se usa en las ensaladas.", "Tomate"],
    ["starts", "Caballo de fantasía con un cuerno en la frente.", "Unicornio"],
    ["starts", "Animal que da leche y dice «mu».", "Vaca"],
    ["contains", "Instrumento de viento dorado típico del jazz.", "Saxofón"],
    ["starts", "Parte amarilla del huevo.", "Yema"],
    ["starts", "Hortaliza naranja que comen los conejos.", "Zanahoria"],
  ]),
];

export function getRosco(id: string): Rosco | undefined {
  return ROSCOS.find((rosco) => rosco.id === id);
}
