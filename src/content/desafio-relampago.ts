import type { ContentItem, GameDifficulty } from "@/types/game";

export type Challenge = ContentItem & {
  title: string;
  instructions: string;
  difficulty: GameDifficulty;
  /** Present when the challenge plays against the clock. */
  timerSeconds?: number;
};

type ChallengeDraft = Omit<Challenge, "id" | "packId">;

/**
 * Every entry must pass this line of the brief: "Evitar retos peligrosos,
 * humillantes u obligatorios. Permitir saltar cualquier desafío."
 * New entries go at the end, so existing ids keep their meaning in stored games.
 */
const DRAFTS: readonly ChallengeDraft[] = [
  {
    title: "Mantenerse en un pie durante 30 segundos.",
    instructions: "Elegí un pie y aguantá sin apoyar el otro. Ponete cerca de una pared, por las dudas.",
    difficulty: "easy",
    timerSeconds: 30,
  },
  {
    title: "Imitar a un integrante del grupo.",
    instructions: "Copiá un gesto o una frase típica, con buena onda, hasta que adivinen quién es.",
    difficulty: "easy",
  },
  {
    title: "Decir cinco animales en 10 segundos.",
    instructions: "Sin repetir y sin frenarte. Vale cualquier animal.",
    difficulty: "easy",
    timerSeconds: 10,
  },
  {
    title: "Aplaudir un ritmo y que el grupo lo repita.",
    instructions: "Inventá un ritmo corto. Sale bien si el grupo lo copia a la primera.",
    difficulty: "easy",
  },
  {
    title: "Contar un chiste malo sin reírse.",
    instructions: "Contá el peor chiste que sepas, sin que se te escape la risa.",
    difficulty: "easy",
  },
  {
    title: "Poner la mejor cara de sorpresa.",
    instructions: "Sostenela hasta que alguien del grupo aplauda.",
    difficulty: "easy",
  },
  {
    title: "Nombrar tres cosas amarillas en 10 segundos.",
    instructions: "Pueden estar en la habitación o no. Lo importante es que sean amarillas.",
    difficulty: "easy",
    timerSeconds: 10,
  },
  {
    title: "Saludar como una estrella de cine.",
    instructions: "Entrá a la escena y saludá al público como si te estuvieran sacando fotos.",
    difficulty: "easy",
  },
  {
    title: "Cruzar la habitación poniendo un pie delante del otro.",
    instructions: "Pegá el talón a la punta del otro pie a cada paso, por un camino despejado.",
    difficulty: "easy",
  },
  {
    title: "Decir tu nombre al revés.",
    instructions: "Letra por letra y de una sola vez, sin escribirlo antes.",
    difficulty: "easy",
  },
  {
    title: "Caminar con un almohadón en la cabeza.",
    instructions: "Da cinco pasos despacio, sin agarrarlo. Si se cae, no pasa nada: vale otro intento.",
    difficulty: "easy",
  },
  {
    title: "Hacer sonreír a alguien sin hablar.",
    instructions: "Elegí a alguien que quiera jugar y sacale una sonrisa con gestos, sin tocarlo.",
    difficulty: "easy",
    timerSeconds: 20,
  },
  {
    title: "Decir un trabalenguas tres veces seguidas.",
    instructions: "Probá con: «Pablito clavó un clavito». Más rápido en cada vuelta.",
    difficulty: "easy",
  },
  {
    title: "Inventar un nombre de banda para el grupo.",
    instructions: "Decí el nombre y el título de su primer disco.",
    difficulty: "easy",
  },
  {
    title: "Hacer la mímica de una tarea de la casa.",
    instructions: "Sin hablar, hasta que alguien adivine qué estás haciendo.",
    difficulty: "easy",
  },
  {
    title: "Decirle algo lindo a quien tengas al lado.",
    instructions: "Que sea sincero y que no sea sobre su aspecto.",
    difficulty: "easy",
  },
  {
    title: "Nombrar tres países con la misma letra.",
    instructions: "Elegí la letra que quieras antes de que arranque el tiempo.",
    difficulty: "easy",
    timerSeconds: 15,
  },
  {
    title: "Marchar en el lugar como un soldadito de juguete.",
    instructions: "Brazos rígidos y cara seria hasta que termine el tiempo.",
    difficulty: "easy",
    timerSeconds: 15,
  },
  {
    title: "Tararear una canción hasta que la adivinen.",
    instructions: "Sin letra: solo la melodía. Elegí una que conozca todo el grupo.",
    difficulty: "easy",
  },
  {
    title: "Construir una torre con cinco objetos disponibles.",
    instructions: "Usá cosas que no se rompan. Tiene que quedar parada sin que la toques.",
    difficulty: "medium",
    timerSeconds: 60,
  },
  {
    title: "Representar una película usando solamente sonidos.",
    instructions: "Sin palabras y sin gestos, hasta que el grupo adivine cuál es.",
    difficulty: "medium",
    timerSeconds: 60,
  },
  {
    title: "Inventar un comercial de 20 segundos para un objeto de la habitación.",
    instructions: "Elegí el objeto y vendelo como si fuera el invento del siglo.",
    difficulty: "medium",
    timerSeconds: 20,
  },
  {
    title: "Relatar la habitación como un partido de fútbol.",
    instructions: "Contá lo que está pasando como si fuera la final del Mundial.",
    difficulty: "medium",
    timerSeconds: 20,
  },
  {
    title: "Cruzar la habitación con un objeto sobre la mano.",
    instructions: "Apoyá algo liviano e irrompible en el dorso de la mano, sin agarrarlo.",
    difficulty: "medium",
  },
  {
    title: "Decir diez palabras con la misma letra.",
    instructions: "El grupo elige la letra. No valen los nombres propios.",
    difficulty: "medium",
    timerSeconds: 20,
  },
  {
    title: "Armar una oración con tres palabras al azar.",
    instructions: "Cada uno de los otros te dice una palabra. Usalas todas y que tenga sentido.",
    difficulty: "medium",
  },
  {
    title: "Hablar de un tema sin decir «eh».",
    instructions: "El grupo elige el tema. Tenés que seguir hablando hasta que termine el tiempo.",
    difficulty: "medium",
    timerSeconds: 20,
  },
  {
    title: "Dibujar un animal en el aire.",
    instructions: "Con el dedo y sin hablar, hasta que el grupo adivine cuál es.",
    difficulty: "medium",
  },
  {
    title: "Inventar un paso de baile y enseñárselo al grupo.",
    instructions: "Ponele nombre. Sale bien si al menos dos personas se animan a repetirlo.",
    difficulty: "medium",
  },
  {
    title: "Quedarse en puntas de pie durante 20 segundos.",
    instructions: "Ponete cerca de una pared. Podés apoyarte si perdés el equilibrio.",
    difficulty: "medium",
    timerSeconds: 20,
  },
  {
    title: "Ordenar cinco objetos con los ojos cerrados.",
    instructions: "Sentate. Te pasan cinco objetos y los ordenás del más chico al más grande.",
    difficulty: "medium",
  },
  {
    title: "Hacer tres sonidos de animales seguidos.",
    instructions: "Elegí animales poco comunes. El grupo tiene que adivinar los tres.",
    difficulty: "medium",
  },
  {
    title: "Narrar un documental sobre el grupo.",
    instructions: "Hablá con voz de naturalista y contá qué hace esta especie en su hábitat.",
    difficulty: "medium",
    timerSeconds: 30,
  },
  {
    title: "Cantar un estribillo como en la ópera.",
    instructions: "Elegí una canción conocida y dale todo el drama que puedas.",
    difficulty: "medium",
  },
  {
    title: "Quedarse como una estatua durante 20 segundos.",
    instructions: "Elegí una pose cómoda. Pueden hacerte reír, pero sin tocarte.",
    difficulty: "medium",
    timerSeconds: 20,
  },
  {
    title: "Inventar una excusa para llegar tarde.",
    instructions: "Cuanto más increíble, mejor. El grupo decide si se la cree.",
    difficulty: "medium",
    timerSeconds: 15,
  },
  {
    title: "Describir un objeto sin nombrarlo.",
    instructions: "Elegí algo de la habitación y da pistas hasta que lo adivinen.",
    difficulty: "medium",
    timerSeconds: 30,
  },
  {
    title: "Decir los meses del año al revés.",
    instructions: "De diciembre a enero, sin equivocarte ni volver atrás.",
    difficulty: "hard",
    timerSeconds: 20,
  },
  {
    title: "Improvisar cuatro versos que rimen sobre el grupo.",
    instructions: "Con buena onda, sin burlarte de nadie. Tienen que rimar de a dos.",
    difficulty: "hard",
    timerSeconds: 45,
  },
  {
    title: "Nombrar diez países parado en un pie.",
    instructions: "Ponete cerca de una pared. Si apoyás el otro pie, seguí desde donde estabas.",
    difficulty: "hard",
    timerSeconds: 30,
  },
  {
    title: "Defender una idea absurda durante 30 segundos.",
    instructions: "El grupo elige la idea, por ejemplo: las medias deberían venderse de a tres.",
    difficulty: "hard",
    timerSeconds: 30,
  },
  {
    title: "Responder cinco preguntas sin decir «sí» ni «no».",
    instructions: "El grupo te pregunta rápido. Con la primera que se te escape, se termina.",
    difficulty: "hard",
    timerSeconds: 30,
  },
  {
    title: "Cambiar diez veces entre la nariz y la oreja.",
    instructions: "Una mano en la nariz y la otra en la oreja contraria. Cambiá de lado sin trabarte.",
    difficulty: "hard",
    timerSeconds: 20,
  },
  {
    title: "Construir un puente que sostenga una lapicera.",
    instructions: "Usá objetos livianos que no se rompan. Tiene que quedar en el aire entre dos apoyos.",
    difficulty: "hard",
    timerSeconds: 90,
  },
  {
    title: "Contar de 30 para atrás de a tres.",
    instructions: "30, 27, 24... hasta llegar a 0, sin equivocarte.",
    difficulty: "hard",
    timerSeconds: 20,
  },
  {
    title: "Repetir una secuencia de seis gestos.",
    instructions: "Alguien hace seis gestos de corrido y vos los repetís en el mismo orden.",
    difficulty: "hard",
  },
  {
    title: "Dar el noticiero de esta juntada.",
    instructions: "Tres noticias de hoy, con voz de presentador y sin reírte.",
    difficulty: "hard",
    timerSeconds: 30,
  },
  {
    title: "Explicar cómo se ata un cordón sin usar las manos.",
    instructions: "Solo con palabras, paso a paso, y con las manos atrás.",
    difficulty: "hard",
    timerSeconds: 30,
  },
  {
    title: "Hacer la mímica de tres películas seguidas.",
    instructions: "El grupo tiene que adivinar las tres antes de que termine el tiempo.",
    difficulty: "hard",
    timerSeconds: 90,
  },
  {
    title: "Pedir un objeto en un idioma inventado.",
    instructions: "Sin palabras reales, conseguí que alguien te alcance lo que estás pidiendo.",
    difficulty: "hard",
    timerSeconds: 30,
  },
  {
    title: "Cantar un estribillo usando solo la letra A.",
    instructions: "Cambiá todas las vocales por la A. El grupo adivina qué canción es.",
    difficulty: "hard",
  },
  {
    title: "Contar una historia con tres objetos de la habitación.",
    instructions: "Elegí tres objetos y que los tres sean clave en la historia.",
    difficulty: "hard",
    timerSeconds: 45,
  },
  {
    title: "Decir el abecedario salteando una letra.",
    instructions: "A, C, E, G... hasta el final, de corrido.",
    difficulty: "hard",
    timerSeconds: 25,
  },
  {
    title: "Reconocer voces con los ojos cerrados.",
    instructions: "Sentate y cerrá los ojos. Tres personas dicen «hola» y vos decís quién es cada una.",
    difficulty: "hard",
  },
  {
    title: "Hacer de guía turístico de la habitación.",
    instructions: "Mostrá tres puntos de interés, con historia y todo, aunque te la inventes.",
    difficulty: "hard",
    timerSeconds: 30,
  },
];

export const CHALLENGES: readonly Challenge[] = DRAFTS.map((draft, index) => ({
  id: `des-${String(index + 1).padStart(3, "0")}`,
  packId: "base",
  ...draft,
}));

export const CHALLENGE_IDS = CHALLENGES.map((challenge) => challenge.id);

export function getChallengeIds(difficulty: GameDifficulty): string[] {
  return CHALLENGES.filter((challenge) => challenge.difficulty === difficulty).map(
    (challenge) => challenge.id,
  );
}

export function getChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((challenge) => challenge.id === id);
}

export const RULES: readonly string[] = [
  "Elijan cuántos juegan y la dificultad.",
  "En cada turno aparece un desafío para una persona.",
  "Si tiene cronómetro, lo arrancan cuando estén listos.",
  "Al terminar, márquenlo como completado o fallido.",
  "Nadie está obligado: cualquiera puede saltar cualquier desafío, sin penalidad.",
];
