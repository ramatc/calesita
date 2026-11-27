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
  build("rosca-3", [
    ["starts", "Insecto que fabrica miel.", "Abeja"],
    ["starts", "Embarcación que navega por el agua.", "Barco"],
    ["starts", "Sala donde se proyectan películas.", "Cine"],
    ["starts", "Lo que se usa para pagar las cosas.", "Dinero"],
    ["starts", "Lugar donde aprenden los chicos.", "Escuela"],
    ["starts", "Lámpara que ilumina la calle.", "Farol"],
    ["starts", "Ave de corral que pone huevos.", "Gallina"],
    ["starts", "Lugar donde se atiende a los enfermos.", "Hospital"],
    ["starts", "Reptil verde parecido a un dragón chiquito.", "Iguana"],
    ["starts", "Producto que hace espuma y sirve para lavarse las manos.", "Jabón"],
    ["starts", "Útil para escribir con mina de grafito.", "Lápiz"],
    ["starts", "Animal que trepa árboles y come bananas.", "Mono"],
    ["starts", "Órgano con el que olemos.", "Nariz"],
    ["contains", "Fiesta que se hace una vez por año para celebrar que naciste.", "Cumpleaños"],
    ["starts", "Masa enorme de agua salada.", "Océano"],
    ["starts", "Ave que no vuela y vive en el frío.", "Pingüino"],
    ["starts", "Herida que deja el fuego en la piel.", "Quemadura"],
    ["starts", "Corriente de agua que desemboca en el mar.", "Río"],
    ["starts", "Mueble para sentarse.", "Silla"],
    ["starts", "Aparato para hablar con alguien a distancia.", "Teléfono"],
    ["starts", "Parte dura en la punta de los dedos.", "Uña"],
    ["starts", "Abertura en la pared para mirar afuera.", "Ventana"],
    ["contains", "Prueba que se toma en la escuela para aprobar.", "Examen"],
    ["starts", "Postre lácteo que se puede tomar con cereales.", "Yogur"],
    ["starts", "Animal astuto de cola peluda.", "Zorro"],
  ]),
  build("rosca-4", [
    ["starts", "Planta grande con tronco y ramas.", "Árbol"],
    ["starts", "Fruta amarilla y alargada.", "Banana"],
    ["starts", "Animal de orejas largas que salta.", "Conejo"],
    ["starts", "Reptil gigante que se extinguió hace millones de años.", "Dinosaurio"],
    ["starts", "Lugar donde se juegan los partidos de fútbol.", "Estadio"],
    ["starts", "Lo que sale de una fogata y quema.", "Fuego"],
    ["starts", "Prenda para abrigar las manos.", "Guante"],
    ["starts", "Insecto chiquito que vive en colonias.", "Hormiga"],
    ["starts", "Idioma que se habla en Inglaterra.", "Inglés"],
    ["starts", "Parte de la casa con pasto, plantas y flores.", "Jardín"],
    ["starts", "Ave nocturna de cara blanca.", "Lechuza"],
    ["starts", "Insecto que zumba y pica en verano.", "Mosquito"],
    ["starts", "Vapor de agua que flota en el cielo.", "Nube"],
    ["contains", "Primera parte del día.", "Mañana"],
    ["starts", "Décimo mes del año.", "Octubre"],
    ["starts", "Lugar con arena a la orilla del mar.", "Playa"],
    ["starts", "Número que va después del catorce.", "Quince"],
    ["starts", "Flor con espinas en el tallo.", "Rosa"],
    ["starts", "Reptil sin patas que se arrastra.", "Serpiente"],
    ["starts", "Animal con caparazón que camina despacio.", "Tortuga"],
    ["starts", "Ropa igual que usan todos los jugadores de un equipo.", "Uniforme"],
    ["starts", "Instrumento de cuerdas que se toca con arco.", "Violín"],
    ["contains", "Gas que respiramos para vivir.", "Oxígeno"],
    ["starts", "Barco de lujo para pasear.", "Yate"],
    ["starts", "Hortaliza naranja con la que se hace puré y sopa.", "Zapallo"],
  ]),
  build("rosca-5", [
    ["starts", "Comida argentina de carne a la parrilla.", "Asado"],
    ["starts", "Capital de la Argentina.", "Buenos Aires"],
    ["starts", "Provincia argentina famosa por sus sierras y el fernet.", "Córdoba"],
    ["starts", "Persona que atiende a los pacientes en el consultorio.", "Doctor"],
    ["starts", "Escalones para subir de un piso a otro.", "Escalera"],
    ["starts", "Bebida amarga que en Córdoba se toma con cola.", "Fernet"],
    ["starts", "Hombre de campo típico de la Argentina.", "Gaucho"],
    ["starts", "Aparato de la cocina donde se hacen las tortas.", "Horno"],
    ["starts", "Cataratas famosas de Misiones.", "Iguazú"],
    ["starts", "Provincia del norte donde está la Quebrada de Humahuaca.", "Jujuy"],
    ["starts", "Animal del altiplano parecido a un camello sin joroba.", "Llama"],
    ["starts", "Ciudad de la costa atlántica conocida como La Feliz.", "Mar del Plata"],
    ["starts", "Fiesta del 25 de diciembre.", "Navidad"],
    ["contains", "Persona que nació en España.", "Español"],
    ["starts", "Competencia deportiva mundial que se hace cada cuatro años.", "Olimpíadas"],
    ["starts", "Gran llanura argentina de pastos.", "Pampa"],
    ["contains", "Lugar donde se cruzan dos calles.", "Esquina"],
    ["starts", "Ciudad santafesina donde se izó por primera vez la bandera.", "Rosario"],
    ["starts", "Provincia del norte conocida como La Linda.", "Salta"],
    ["starts", "Baile típico de Buenos Aires.", "Tango"],
    ["starts", "País vecino del otro lado del Río de la Plata.", "Uruguay"],
    ["starts", "Bebida de uva típica de Mendoza.", "Vino"],
    ["contains", "Deportista que pelea con guantes arriba de un ring.", "Boxeador"],
    ["starts", "Reptil parecido al cocodrilo que vive en el Litoral.", "Yacaré"],
    ["starts", "Danza folklórica argentina que se baila con pañuelo.", "Zamba"],
  ]),
  build("rosca-6", [
    ["starts", "Persona que trabaja haciendo películas u obras de teatro.", "Actor"],
    ["starts", "Lugar donde se prestan libros.", "Biblioteca"],
    ["starts", "Parte de la casa donde se prepara la comida.", "Cocina"],
    ["starts", "Último día de la semana.", "Domingo"],
    ["starts", "Astro que brilla en el cielo de noche.", "Estrella"],
    ["starts", "Edificio donde se fabrican cosas en cantidad.", "Fábrica"],
    ["starts", "Prenda con visera que protege la cabeza del sol.", "Gorra"],
    ["starts", "Lugar donde se hospedan los turistas.", "Hotel"],
    ["starts", "Estación más fría del año.", "Invierno"],
    ["starts", "Planeta más grande del sistema solar.", "Júpiter"],
    ["starts", "Reptil chiquito que toma sol en las paredes.", "Lagartija"],
    ["starts", "Insecto con alas de colores.", "Mariposa"],
    ["starts", "Lugar donde los pájaros ponen sus huevos.", "Nido"],
    ["contains", "Persona de poca edad.", "Niño"],
    ["starts", "Animal que da lana.", "Oveja"],
    ["starts", "Tubérculo con el que se hacen las papas fritas.", "Papa"],
    ["starts", "Negocio chiquito donde se compran golosinas.", "Quiosco"],
    ["starts", "Máquina que hace tareas por su cuenta.", "Robot"],
    ["starts", "Siete días seguidos.", "Semana"],
    ["starts", "Pez grande de dientes filosos.", "Tiburón"],
    ["starts", "Todo lo que existe, con sus planetas y galaxias.", "Universo"],
    ["starts", "Montaña que puede largar lava.", "Volcán"],
    ["contains", "País donde se comen tacos y se escuchan mariachis.", "México"],
    ["starts", "Material blanco con el que se inmoviliza un hueso roto.", "Yeso"],
    ["starts", "Lugar donde se visitan animales de todo el mundo.", "Zoológico"],
  ]),
];

export function getRosco(id: string): Rosco | undefined {
  return ROSCOS.find((rosco) => rosco.id === id);
}
